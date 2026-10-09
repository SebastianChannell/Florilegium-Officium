import { serveOfficeAsset } from "../lib/static-office.js";
const LANGUAGE_PROFILES = new Map([
  ["English", { lang1: "Latin", lang2: "English" }],
  ["Espanol", { lang1: "Latin", lang2: "Espanol" }],
  ["Cantilenae-English", { lang1: "Latin-gabc", lang2: "English" }],
]);

export function resolveLanguageProfile(language) {
  return LANGUAGE_PROFILES.get(language) || null;
}

const ZEPHYRINUS_HEADING = /Commemoratio:<\/SPAN>\s*<FONT[^>]*>S\. Zephyrini Papæ et Martyris<\/FONT>/i;
const ZEPHYRINUS_RENDERED = /Commemoratio S\. Zephyrini Papæ et Martyris|Commemoration of St\. Zephyrinus, Pope and Martyr/i;

const ZEPHYRINUS_LATIN = `<br/>
<FONT COLOR="red"><I>Commemoratio S. Zephyrini Papæ et Martyris</I></FONT><br/>
<FONT COLOR="red"><I>Ant.</I></FONT> Iste Sanctus pro lege Dei sui certávit usque ad mortem, et a verbis impiórum non tímuit: fundátus enim erat supra firmam petram.<br/>
 <br/>
<FONT COLOR="red"><I>℣.</I></FONT> Glória et honóre coronásti eum, Dómine.<br/>
<FONT COLOR="red"><I>℟.</I></FONT> Et constituísti eum super ópera mánuum tuárum.<br/>
 <br/>
<FONT SIZE="+2" COLOR="red"><B><I>O</I></B></FONT>rémus.<br/>
<FONT SIZE="+2" COLOR="red"><B><I>G</I></B></FONT>regem tuum, Pastor ætérne, placátus inténde: et, per beátum Zephyrínum Mártyrem tuum atque Summum Pontíficem, perpétua protectióne custódi; quem totíus Ecclésiæ præstitísti esse pastórem.<br/>`;

const ZEPHYRINUS_ENGLISH = `<br/>
<FONT COLOR="red"><I>Commemoration of St. Zephyrinus, Pope and Martyr</I></FONT><br/>
<FONT COLOR="red"><I>Ant.</I></FONT> This man is holy for he hath striven for the law of his God even unto death, and hath not feared for the words of the ungodly; For he had his foundation upon a strong rock.<br/>
 <br/>
<FONT COLOR="red"><I>℣.</I></FONT> Thou hast crowned him with glory and honour, O Lord.<br/>
<FONT COLOR="red"><I>℟.</I></FONT> And madest him to have dominion over the works of thy hands.<br/>
 <br/>
<FONT SIZE="+2" COLOR="red"><B><I>L</I></B></FONT>et us pray.<br/>
<FONT SIZE="+2" COLOR="red"><B><I>L</I></B></FONT>ook forgivingly on thy flock, Eternal Shepherd, and keep it in thy constant protection, by the intercession of blessed Zephyrinus thy Martyr and Sovereign Pontiff, whom thou didst constitute Shepherd of the whole Church.<br/>`;

function appendToCell(cell, addition) {
  const closingTag = cell.lastIndexOf("</TD>");
  if (closingTag < 0) return null;
  return `${cell.slice(0, closingTag)}${addition}\n${cell.slice(closingTag)}`;
}

export function correctKnownUpstreamDefects(html, { isoDate, hour }) {
  if (
    !/^\d{4}-08-25$/.test(isoDate || "") ||
    hour !== "Vesperae" ||
    !ZEPHYRINUS_HEADING.test(html) ||
    ZEPHYRINUS_RENDERED.test(html)
  ) {
    return html;
  }

  const prayerMarker = html.indexOf("ID='Vespera9'");
  const rowStart = html.lastIndexOf("<TR><TD", prayerMarker);
  const rowEnd = html.indexOf("</TR>", rowStart);
  if (rowStart < 0 || rowEnd < 0) return html;

  const row = html.slice(rowStart, rowEnd + 5);
  const cellBoundary = row.search(/<\/TD>\s*<TD\b/i);
  if (cellBoundary < 0) return html;

  const firstCellEnd = row.indexOf("</TD>", cellBoundary) + 5;
  const latinCell = row.slice(0, firstCellEnd);
  const englishCell = row.slice(firstCellEnd);
  const correctedLatin = appendToCell(latinCell, ZEPHYRINUS_LATIN);
  const correctedEnglish = appendToCell(englishCell, ZEPHYRINUS_ENGLISH);
  if (!correctedLatin || !correctedEnglish) return html;

  return `${html.slice(0, rowStart)}${correctedLatin}${correctedEnglish}${html.slice(rowEnd + 5)}`;
}

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  return serveOfficeAsset(request, env, {
    date: url.searchParams.get("date"),
    version: url.searchParams.get("version") || "1954",
    language: url.searchParams.get("lang") || "English",
    hour: url.searchParams.get("hour") || "Laudes",
  });
}
