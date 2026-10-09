// Dedicated Cloudflare Worker, served on a *Worker Custom Domain*
// such as identity.sacrumflorilegium.com (NOT a Workers Route).
//
// Cloudflare Zero Trust must require Service Auth for /assertion and
// authorize only the Officium service token. Do not make this endpoint public.
// This Worker does not use or need any secrets; Cloudflare Access issues
// Cf-Access-Jwt-Assertion after verifying the caller's service token.
//
// IMPORTANT: The response header is a short-lived signed bearer token;
// never log it, cache it, or expose the endpoint outside Cloudflare Access.
export default {
  async fetch(request) {
    if (request.method !== "GET" ||
        new URL(request.url).pathname !== "/assertion") {
      return new Response(null, {
        status: 404,
        headers: { "Cache-Control": "no-store" },
      });
    }

    const assertion = request.headers.get("Cf-Access-Jwt-Assertion");
    if (!assertion) {
      return new Response(null, {
        status: 403,
        headers: { "Cache-Control": "no-store" },
      });
    }

    return new Response(null, {
      status: 204,
      headers: {
        "X-Officium-Access-Assertion": assertion,
        "Cache-Control": "no-store",
      },
    });
  },
};
