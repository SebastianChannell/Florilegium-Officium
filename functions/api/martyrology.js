import { serveOfficeAsset } from "../lib/static-office.js";

const LANGUAGE_PROFILES = new Map([
  ["English", { lang1: "Latin", lang2: "English" }],
  ["Espanol", { lang1: "Latin", lang2: "Espanol" }],
  ["Cantilenae-English", { lang1: "Latin", lang2: "English" }],
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
  const url = new URL(request.url);
  const language = url.searchParams.get("lang") || "English";
  return serveOfficeAsset(request, env, {
    date: url.searchParams.get("date"), version: "1954",
    language: language === "Cantilenae-English" ? "English" : language,
    hour: "Prima",
  });
}
