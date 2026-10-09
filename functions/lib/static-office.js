export const VERSIONS = { "1954": "Divino Afflatu - 1954", "1960": "Rubrics 1960 - 1960", "1954-bvm": "Divino Afflatu - 1954" };
export const LANGUAGES = { English: ["Latin", "English"], Espanol: ["Latin", "Espanol"], "Cantilenae-English": ["Latin-gabc", "English"] };
export const HOURS = ["Matutinum", "Laudes", "Prima", "Tertia", "Sexta", "Nona", "Vesperae", "Completorium"];

export function validDate(date) {
  return /^\d{4}-\d{2}-\d{2}$/.test(date || "") && Number(date.slice(0, 4)) >= 1900 && Number(date.slice(0, 4)) <= 2100 && new Date(`${date}T00:00:00Z`).toISOString().slice(0, 10) === date;
}

export async function serveOfficeAsset(request, env, { date, version, language, hour }) {
  let valid = false;
  try { valid = validDate(date); } catch { /* Invalid calendar date. */ }
  if (!valid || !Object.hasOwn(VERSIONS, version) || !Object.hasOwn(LANGUAGES, language) || !HOURS.includes(hour)) {
    return Response.json({ error: "Invalid Office request." }, { status: 400 });
  }
  const asset = new URL(`/data/office/${version}/${language}/${date}/${hour}.json`, request.url);
  const response = await env.ASSETS.fetch(new Request(asset, { headers: { Accept: "application/json" } }));
  if (!response.ok || !response.headers.get("Content-Type")?.includes("application/json")) {
    return Response.json({ error: "This date has not been generated yet." }, { status: 404 });
  }
  return new Response(response.body, { headers: {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "public, max-age=300, s-maxage=3600",
    "X-Content-Type-Options": "nosniff",
  } });
}
