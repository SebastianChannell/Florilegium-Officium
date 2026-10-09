import assert from "node:assert/strict";
import test from "node:test";
import { onRequestGet as office } from "../functions/api/office.js";
import { onRequestGet as martyrology } from "../functions/api/martyrology.js";

test("Office reads the exact static asset without a live backend", async () => {
  const request = new Request("https://officium.example/api/office?date=2026-10-09&version=1954-bvm&hour=Vesperae&lang=Cantilenae-English");
  let path;
  const response = await office({ request, env: { ASSETS: { fetch: async request => {
    path = new URL(request.url).pathname;
    return Response.json({ html: "<table>Saved office</table>" });
  } } } });
  assert.equal(path, "/data/office/1954-bvm/Cantilenae-English/2026-10-09/Vesperae.json");
  assert.equal(response.status, 200);
  assert.equal((await response.json()).html, "<table>Saved office</table>");
});

test("unsupported modes and impossible dates fail before reading assets", async () => {
  for (const query of ["version=1939", "version=1955", "lang=Cantilenae-Sung", "lang=Cantilenae-Ssung", "date=2026-02-30", "date=2026-13-01", "hour=Unknown", "version=toString"]) {
    const params = new URLSearchParams({ date: "2026-10-09" });
    for (const [key, value] of new URLSearchParams(query)) params.set(key, value);
    const response = await office({ request: new Request(`https://officium.example/api/office?${params}`), env: {} });
    assert.equal(response.status, 400, query);
  }
});

test("Martyrology uses 1954 Prime and plain bilingual text in chant mode", async () => {
  let path;
  const response = await martyrology({ request: new Request("https://officium.example/api/martyrology?date=2026-10-09&lang=Cantilenae-English"), env: { ASSETS: { fetch: async request => {
    path = new URL(request.url).pathname;
    return Response.json({ html: "saved" });
  } } } });
  assert.equal(response.status, 200);
  assert.equal(path, "/data/office/1954/English/2026-10-09/Prima.json");
});

test("an unavailable date or Pages HTML fallback returns a useful 404", async () => {
  for (const asset of [new Response("missing", { status: 404 }), new Response("<html>App shell</html>", { headers: { "Content-Type": "text/html" } })]) {
    const response = await office({ request: new Request("https://officium.example/api/office?date=2025-01-01"), env: { ASSETS: { fetch: async () => asset } } });
    assert.equal(response.status, 404);
    assert.match((await response.json()).error, /not been generated/);
  }
});
