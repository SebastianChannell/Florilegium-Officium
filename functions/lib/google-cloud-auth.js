// Keyless Cloudflare Access -> Google WIF -> Cloud Run.
// Opt in only after end-to-end production verification.
const PROJECT_NUMBER = "833566975684";
const POOL = "officium-cloudflare";
const PROVIDER = "cloudflare-access";
const ACCESS_PATH = "/api/_google-identity";
const CLOUD_RUN_AUDIENCE = "https://divinum-officium-833566975684.us-east1.run.app";
const SERVICE_ACCOUNT = "officium-proxy@divinum-officium-506200.iam.gserviceaccount.com";
const PROVIDER_NAME = `projects/${PROJECT_NUMBER}/locations/global/workloadIdentityPools/${POOL}/providers/${PROVIDER}`;
const GOOGLE_STS = "https://sts.googleapis.com/v1/token";
const IAM_ID_TOKEN = `https://iamcredentials.googleapis.com/v1/projects/-/serviceAccounts/${SERVICE_ACCOUNT}:generateIdToken`;

async function jsonOrFail(response, stage) {
  if (!response.ok) throw new Error(`${stage} failed (${response.status})`);
  return response.json();
}

export async function getCloudRunIdToken(request, env, fetcher = fetch) {
  if (!env?.CF_ACCESS_CLIENT_ID || !env?.CF_ACCESS_CLIENT_SECRET) {
    throw new Error("Cloudflare Access service credentials are not configured");
  }
  // Pages Functions calling back to the same Pages hostname may bypass Access
  // or fail same-zone routing. Prefer a separate Access-protected Worker on a
  // Worker Custom Domain, which Cloudflare supports for same-zone fetch().
  // Never fall back to the Pages self-fetch URL: it can silently target
  // the wrong Access application and produce a misleading 401.
  if (!env.CF_ACCESS_IDENTITY_URL) {
    throw new Error("Cloudflare identity endpoint URL is not configured");
  }
  const identityUrl = env.CF_ACCESS_IDENTITY_URL;
  if (identityUrl !== "https://identity.sacrumflorilegium.com/assertion") {
    throw new Error("Unexpected Cloudflare Access identity endpoint");
  }
  const assertionResponse = await fetcher(identityUrl, {
    headers: {
      "CF-Access-Client-Id": env.CF_ACCESS_CLIENT_ID,
      "CF-Access-Client-Secret": env.CF_ACCESS_CLIENT_SECRET,
    },
    redirect: "manual",
    cache: "no-store",
  });
  if (assertionResponse.status !== 204) {
    // Non-sensitive diagnostic only: NEVER log assertion headers or service tokens.
    console.error("Officium identity Worker HTTP status:", assertionResponse.status, "hostname:", new URL(identityUrl).hostname);
    const error = new Error("Cloudflare Access assertion unavailable");
    error.stage = "cloudflare-access-response";
    error.upstreamStatus = assertionResponse.status;
    throw error;
  }
  const assertion = assertionResponse.headers.get("X-Officium-Access-Assertion");
  if (!assertion) throw new Error("Cloudflare Access assertion header missing");

  const stsBody = new URLSearchParams({
    audience: `//iam.googleapis.com/${PROVIDER_NAME}`,
    grant_type: "urn:ietf:params:oauth:grant-type:token-exchange",
    requested_token_type: "urn:ietf:params:oauth:token-type:access_token",
    subject_token_type: "urn:ietf:params:oauth:token-type:jwt",
    subject_token: assertion,
    scope: "https://www.googleapis.com/auth/cloud-platform",
  });
  const sts = await jsonOrFail(await fetcher(GOOGLE_STS, {
    method: "POST",
    body: stsBody,
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  }), "Google security token exchange");
  if (!sts.access_token) throw new Error("Google STS returned no access token");

  const identity = await jsonOrFail(await fetcher(IAM_ID_TOKEN, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${sts.access_token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ audience: CLOUD_RUN_AUDIENCE, includeEmail: true }),
  }), "Google ID token generation");
  if (!identity.token) throw new Error("Google returned no Cloud Run ID token");
  return identity.token;
}

export async function fetchDivinumOfficium(upstream, request, env, options = {}, fetcher = fetch) {
  // The public path stays unchanged until production authentication is validated.
  if (env?.GOOGLE_AUTH_ENABLED !== "true") return fetcher(upstream, options);
  const identityToken = await getCloudRunIdToken(request, env, fetcher);
  const headers = new Headers(options.headers || {});
  headers.set("X-Serverless-Authorization", `Bearer ${identityToken}`);
  return fetcher(upstream, { ...options, headers });
}
