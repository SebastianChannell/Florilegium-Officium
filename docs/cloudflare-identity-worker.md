# Officium keyless authentication: resolve Pages self-fetch failures

The Cloud Shell test for Cloudflare Access → Google STS → Cloud Run succeeded, but enabling `GOOGLE_AUTH_ENABLED=true` in Pages made the website fail. A likely cause is the Pages Function fetching its own same-zone URL, which may not route back through Access/Pages as an external call would.

## Safe rollout

**Keep `GOOGLE_AUTH_ENABLED=false` and keep Cloud Run public until the entire live application and GitHub updater pass.**

1. In **Cloudflare → Workers & Pages → Create**, create a standalone Worker named `officium-identity`, whose code is [identity-worker.js](../cloudflare/identity-worker.js). Deploy it.
2. In the Worker's **Settings → Domains & Routes**, add a **Custom Domain** (not a Worker Route), `identity.sacrumflorilegium.com`. Cloudflare will create its DNS entry. Do not set this up as a Cloudflare Pages domain.
3. In **Zero Trust → Access → Applications**, edit the *existing* `Officium Google Authentication` application. Add an additional public hostname `identity.sacrumflorilegium.com` with path `/assertion`. Retain the existing `officium.sacrumflorilegium.com/api/_google-identity` hostname and its Service Auth policy. By adding a domain to the existing application rather than creating a new Access application, the AUD tag remains unchanged and the Google federation provider needs no edits. Confirm the same service-token-only policy protects the new hostname/path.
4. Cloudflare Pages Production variable: `CF_ACCESS_IDENTITY_URL=https://identity.sacrumflorilegium.com/assertion`. Do not put any credentials in this URL. Existing encrypted `CF_ACCESS_CLIENT_ID` and `CF_ACCESS_CLIENT_SECRET` remain in Pages only.
5. Redeploy the Pages project to propagate the variable; with `GOOGLE_AUTH_ENABLED=false` the website should still work.
6. To test the protected identity endpoint from Google Cloud Shell, the pre-existing `verify-cloudflare-google-auth.sh` can be updated to use the *new* URL; check HTTP 204, header presence, STS, generateIdToken and Cloud Run. Do not output the assertion or service secret. A passing external test alone does not prove a Pages-to-Worker request succeeds, so also test the live Pages Function.
7. Temporarily set `GOOGLE_AUTH_ENABLED=true`, redeploy, and test the Office and Martyrology from the real website. If it fails, revert to `false` and redeploy. Capture Pages Functions error logs for a precise error.
8. Update authenticated GitHub updater smoke tests and run them successfully; refresh uploaded Cloudflare JWKS on signing-key rotation.
9. Only after those tests succeed, remove Cloud Run `allUsers` Invoker binding.

## Security notes

This response contains a bearer JWT. The Worker MUST remain protected by Cloudflare Access with a Service Auth policy for exactly `/assertion`, and service-token credentials must not be logged, embedded in front-end code, or sent to the browser. Same-zone Worker-to-Worker `fetch()` supports Worker **Custom Domains**; it does not generally support calls to Workers on Routes, and `workers.dev` often requires service bindings.

Documentation:
- https://developers.cloudflare.com/workers/configuration/routing/custom-domains/
- https://developers.cloudflare.com/workers/configuration/cloudflare-access/
- https://developers.cloudflare.com/cloudflare-one/access-controls/applications/http-apps/authorization-cookie/
