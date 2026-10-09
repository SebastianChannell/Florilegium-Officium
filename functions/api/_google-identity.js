// This route must be protected by Cloudflare Access with a Service Auth policy.
// Never return the assertion without authenticating the service-token credentials.
export async function onRequestGet({ request, env }) {
  const clientId = request.headers.get("CF-Access-Client-Id");
  const clientSecret = request.headers.get("CF-Access-Client-Secret");
  const assertion = request.headers.get("Cf-Access-Jwt-Assertion");
  if (!env.CF_ACCESS_CLIENT_ID || !env.CF_ACCESS_CLIENT_SECRET ||
      clientId !== env.CF_ACCESS_CLIENT_ID ||
      clientSecret !== env.CF_ACCESS_CLIENT_SECRET || !assertion) {
    return new Response(null, { status: 403, headers: { "Cache-Control": "no-store" } });
  }
  return new Response(null, {
    status: 204,
    headers: {
      "X-Officium-Access-Assertion": assertion,
      "Cache-Control": "no-store",
    },
  });
}
