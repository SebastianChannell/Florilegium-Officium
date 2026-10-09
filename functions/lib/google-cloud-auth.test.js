import test from "node:test";
import assert from "node:assert/strict";
import { getCloudRunIdToken, fetchDivinumOfficium } from "./google-cloud-auth.js";

const authEnv = {
  CF_ACCESS_CLIENT_ID: "test-client-id",
  CF_ACCESS_CLIENT_SECRET: "test-client-secret",
  CF_ACCESS_IDENTITY_URL: "https://identity.sacrumflorilegium.com/assertion",
  GOOGLE_AUTH_ENABLED: "true",
};

test("keyless auth uses protected Custom Domain, exchanges JWT, and retrieves an ID token", async () => {
  const urls = [];
  const fetcher = async (url, options = {}) => {
    urls.push(url);
    if (urls.length === 1) {
      assert.equal(url, authEnv.CF_ACCESS_IDENTITY_URL);
      assert.equal(options.headers["CF-Access-Client-Id"], authEnv.CF_ACCESS_CLIENT_ID);
      assert.equal(options.headers["CF-Access-Client-Secret"], authEnv.CF_ACCESS_CLIENT_SECRET);
      return new Response(null, { status: 204, headers: { "X-Officium-Access-Assertion": "sample.jwt" } });
    }
    if (urls.length === 2) {
      assert.match(url, /^https:\/\/sts\.googleapis\.com\//);
      assert.equal(new URLSearchParams(options.body).get("subject_token"), "sample.jwt");
      return Response.json({ access_token: "sample-google-access-token" });
    }
    if (urls.length === 3) {
      assert.match(url, /iamcredentials\.googleapis\.com/);
      assert.equal(options.headers.Authorization, "Bearer sample-google-access-token");
      return Response.json({ token: "sample-google-id-token" });
    }
    throw new Error("Unexpected request");
  };
  const token = await getCloudRunIdToken(new Request("https://officium.sacrumflorilegium.com/api/office"), authEnv, fetcher);
  assert.equal(token, "sample-google-id-token");
  assert.equal(urls.length, 3);
});

test("auth remains disabled by default and makes one unchanged upstream request", async () => {
  const urls = [];
  const fetcher = async (url, options) => { urls.push({ url, options }); return new Response("ok"); };
  const upstream = "https://divinum-officium-833566975684.us-east1.run.app/";
  const response = await fetchDivinumOfficium(upstream, new Request("https://officium.sacrumflorilegium.com/api/office"), {}, { headers: { Accept: "text/html" } }, fetcher);
  assert.equal(response.status, 200);
  assert.equal(urls.length, 1);
  assert.equal(urls[0].url, upstream);
});

test("invalid identity domain fails closed without sending credentials", async () => {
  const env = { ...authEnv, CF_ACCESS_IDENTITY_URL: "https://attacker.example/assertion" };
  await assert.rejects(
    getCloudRunIdToken(new Request("https://officium.sacrumflorilegium.com/api/office"), env, () => { throw new Error("must not fetch"); }),
    /Unexpected Cloudflare Access identity endpoint/,
  );
});
