# Cloudflare Access → Google Cloud Run: keyless rollout

The existing Cloud Run backend **must remain public until all tests pass**. The Cloudflare Pages Functions authentication path is opt-in: set the Pages secret/variable `GOOGLE_AUTH_ENABLED=true` only after the Access assertion exchange is validated.

Configured names:
- Cloudflare Access team: `sacrum-florilegium.cloudflareaccess.com`
- Protected app path: `/api/_google-identity`
- Google workload identity pool: `officium-cloudflare`
- Provider: `cloudflare-access`
- Google service account: `officium-proxy@divinum-officium-506200.iam.gserviceaccount.com`
- Cloud Run origin: `https://divinum-officium-833566975684.us-east1.run.app`

The protected endpoint sends the `Cf-Access-Jwt-Assertion` from Cloudflare Access back to the invoking Pages Function **only if** the supplied service-token ID and secret match the Cloudflare Pages encrypted secrets. Configure an Access Service Auth policy limited to the dedicated service token. Do not remove this policy or expose the endpoint publicly.

Required Cloudflare Pages *encrypted Production secrets*:
- `CF_ACCESS_CLIENT_ID`
- `CF_ACCESS_CLIENT_SECRET`

Test prerequisites before enabling authentication:
1. Confirm Access sends a signed JWT to the function when calling the protected subpath from a Pages Function. Same-zone subrequests may behave differently and require another hostname or routing design.
2. Verify Google STS accepts that assertion, including issuer, audience, `type`, and `common_name`. Cloudflare's JWT claims must match the configured Google provider condition.
3. Verify IAM Credentials `generateIdToken` returns an ID token for the Cloud Run service URL and the Office and Martyrology endpoints succeed.
4. Ensure GitHub's candidate-revision and production smoke tests authenticate. The current update workflow is not yet compatible with private Cloud Run.
5. Arrange periodic refresh of Google's uploaded Cloudflare Access JWKS on signing-key rotation.
6. Only then remove `allUsers` from the Cloud Run Invoker policy.

Never store service-token secrets, Google tokens, or access assertions in GitHub or application logs.
