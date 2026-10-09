import { fetchDivinumOfficium } from "../lib/google-cloud-auth.js";
const ORIGIN = "https://divinum-officium-833566975684.us-east1.run.app";

const LANGUAGE_PROFILES = new Map([
  ["English", { lang1: "Latin", lang2: "English" }],
  ["Espanol", { lang1: "Latin", lang2: "Espanol" }],
  ["Cantilenae-English", { lang1: "Latin", lang2: "English" }],
  ["Cantilenae-Sung", { lang1: "Latin", lang2: "English" }],
  ["Cantilenae-Ssung", { lang1: "Latin", lang2: "Espanol" }],
]);

export function resolveMartyrologyLanguageProfile(language) {
  return LANGUAGE_PROFILES.get(language) || null;
}

export function toDoDate(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value || "");
  if (!match) return null;
  const [, year, month, day] = match;
  return `${Number(month)}-${Number(day)}-${year}`;
}

export async function onRequestGet({ request, env }) {
  const incoming = new URL(request.url);
  const isoDate = incoming.searchParams.get("date");
  const date = toDoDate(isoDate);
  const language = incoming.searchParams.get("lang") || "English";
  const languageProfile = resolveMartyrologyLanguageProfile(language);

  if (!date || !languageProfile) {
    return Response.json({ error: "Invalid Martyrology request." }, { status: 400 });
  }

  const upstream = new URL("/cgi-bin/horas/Pofficium.pl", ORIGIN);
  upstream.searchParams.set("command", "prayPrima");
  upstream.searchParams.set("date1", date);
  upstream.searchParams.set("version", "Divino Afflatu - 1954");
  upstream.searchParams.set("lang1", languageProfile.lang1);
  upstream.searchParams.set("lang2", languageProfile.lang2);
  upstream.searchParams.set("votive", "Hodie");
  upstream.searchParams.set("dioecesis", "Generale");
  upstream.searchParams.set("testmode", "regular");
  upstream.searchParams.set("content", "1");

  let response;
  try {
    response = await fetchDivinumOfficium(upstream.toString(), request, env, {
    headers: {
      Accept: "text/html,application/xhtml+xml",
      "User-Agent": "Florilegium-Officium/1.0",
    },
    redirect: "follow",
    });
  } catch (error) {
    const message = String(error?.message || "Unknown authentication failure");
    const stage = message.startsWith("Cloudflare Access assertion unavailable") ? "cloudflare-access-response" :
      message.includes("assertion header missing") ? "cloudflare-access-assertion" :
      message.startsWith("Google security token exchange") ? "google-token-exchange" :
      message.startsWith("Google ID token generation") ? "google-id-token" :
      message.includes("credentials are not configured") ? "cloudflare-credentials" :
      message.includes("Unexpected Cloudflare Access identity endpoint") ? "identity-url" :
      "identity-fetch";
    console.error("Officium authentication failure at stage:", stage);
    return Response.json({ error: "Officium authentication failed.", stage },
      { status: 502, headers: { "Cache-Control": "no-store" } });
  }

  if (!response.ok) {
    return Response.json(
      { error: `Divinum Officium returned ${response.status}.` },
      { status: 502 },
    );
  }

  const html = await response.text();
  return Response.json(
    { html, source: upstream.toString() },
    {
      headers: {
        "Cache-Control": "public, max-age=300, s-maxage=3600",
        "X-Content-Type-Options": "nosniff",
      },
    },
  );
}
