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

export async function onRequestGet({ request }) {
  const incoming = new URL(request.url);
  const version = VERSIONS[incoming.searchParams.get("version") || "1954"];
  const hour = incoming.searchParams.get("hour") || "Laudes";
  const date = toDoDate(incoming.searchParams.get("date"));

  if (!version || !HOURS.has(hour) || !date) {
    return new Response("Invalid Office request.", { status: 400 });
  }

  const upstream = new URL("/cgi-bin/horas/Pofficium.pl", ORIGIN);
  upstream.searchParams.set("command", `pray${hour}`);
  upstream.searchParams.set("date1", date);
  upstream.searchParams.set("version", version);
  upstream.searchParams.set("lang1", "Latin");
  upstream.searchParams.set("lang2", "English");
  upstream.searchParams.set("votive", "Hodie");
  upstream.searchParams.set("dioecesis", "Generale");
  upstream.searchParams.set("testmode", "regular");
  upstream.searchParams.set("content", "1");

  const response = await fetch(upstream.toString(), {
    headers: {
      Accept: "text/html,application/xhtml+xml",
      "User-Agent": "Florilegium-Officium/1.0",
    },
    redirect: "follow",
  });

  if (!response.ok) {
    return new Response(`Divinum Officium returned ${response.status}.`, {
      status: 502,
    });
  }

  const body = await response.text();
  return new Response(body, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=300, s-maxage=3600",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
