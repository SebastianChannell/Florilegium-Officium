const ORIGIN = "https://divinum-officium-833566975684.us-east1.run.app";

const VERSIONS = {
  "1939": "Divino Afflatu - 1939",
  "1954": "Divino Afflatu - 1954",
  "1955": "Reduced - 1955",
  "1960": "Rubrics 1960 - 1960",
};

const HOURS = new Set([
  "Matutinum",
  "Laudes",
  "Prima",
  "Tertia",
  "Sexta",
  "Nona",
  "Vesperae",
  "Completorium",
]);

function toDoDate(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value || "");
  if (!match) return null;
  const [, year, month, day] = match;
  return `${Number(month)}-${Number(day)}-${year}`;
}

function buildBaseParams(url, date, version) {
  url.searchParams.set("date1", date);
  url.searchParams.set("version", version);
  url.searchParams.set("lang1", "Latin");
  url.searchParams.set("lang2", "English");
  url.searchParams.set("votive", "Hodie");
  url.searchParams.set("dioecesis", "Generale");
  url.searchParams.set("testmode", "regular");
}

export async function onRequestGet({ request }) {
  const incoming = new URL(request.url);
  const version = VERSIONS[incoming.searchParams.get("version") || "1954"];
  const hour = incoming.searchParams.get("hour") || "Laudes";
  const date = toDoDate(incoming.searchParams.get("date"));

  if (!version || !HOURS.has(hour) || !date) {
    return Response.json({ error: "Invalid Office request." }, { status: 400 });
  }

  const officeUrl = new URL("/cgi-bin/horas/Pofficium.pl", ORIGIN);
  buildBaseParams(officeUrl, date, version);
  officeUrl.searchParams.set("command", `pray${hour}`);
  officeUrl.searchParams.set("content", "1");

  const headlineUrl = new URL("/cgi-bin/horas/Pofficium.pl", ORIGIN);
  buildBaseParams(headlineUrl, date, version);
  headlineUrl.searchParams.set("command", "kalendar");

  const init = {
    headers: {
      Accept: "text/html,application/xhtml+xml",
      "User-Agent": "Florilegium-Officium/1.0",
    },
    redirect: "follow",
  };

  const [officeResponse, headlineResponse] = await Promise.all([
    fetch(officeUrl.toString(), init),
    fetch(headlineUrl.toString(), init),
  ]);

  if (!officeResponse.ok) {
    return Response.json(
      { error: `Divinum Officium returned ${officeResponse.status}.` },
      { status: 502 },
    );
  }

  const [html, headline] = await Promise.all([
    officeResponse.text(),
    headlineResponse.ok ? headlineResponse.text() : Promise.resolve(""),
  ]);

  return Response.json(
    {
      html,
      headline,
      source: officeUrl.toString(),
    },
    {
      headers: {
        "Cache-Control": "public, max-age=300, s-maxage=3600",
        "X-Content-Type-Options": "nosniff",
      },
    },
  );
}
