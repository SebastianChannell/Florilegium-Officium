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
<FONT SIZE="+2" COLOR="red"><B><I>G</I></B></FONT>regem tuum, Pastor ætérne, placátus inténde: et, per beátum Zephyrínum Mártyrem tuum atque Summum Pontíficem, perpétua protectióne custódi; quem totíus Ecclésiæ præstitísti esse pastórem.<br/>
<FONT SIZE="+1" COLOR="red"><B><I>P</I></B></FONT>er Dóminum nostrum Jesum Christum, Fílium tuum: qui tecum vivit et regnat in unitáte Spíritus Sancti, Deus, per ómnia sǽcula sæculórum.<br/>
<FONT COLOR="red"><I>℟.</I></FONT> Amen.<br/>`;

const ZEPHYRINUS_ENGLISH = `<br/>
<FONT COLOR="red"><I>Commemoration of St. Zephyrinus, Pope and Martyr</I></FONT><br/>
<FONT COLOR="red"><I>Ant.</I></FONT> This man is holy for he hath striven for the law of his God even unto death, and hath not feared for the words of the ungodly; For he had his foundation upon a strong rock.<br/>
 <br/>
<FONT COLOR="red"><I>℣.</I></FONT> Thou hast crowned him with glory and honour, O Lord.<br/>
<FONT COLOR="red"><I>℟.</I></FONT> And madest him to have dominion over the works of thy hands.<br/>
 <br/>
<FONT SIZE="+2" COLOR="red"><B><I>L</I></B></FONT>et us pray.<br/>
<FONT SIZE="+2" COLOR="red"><B><I>L</I></B></FONT>ook forgivingly on thy flock, Eternal Shepherd, and keep it in thy constant protection, by the intercession of blessed Zephyrinus thy Martyr and Sovereign Pontiff, whom thou didst constitute Shepherd of the whole Church.<br/>
<FONT SIZE="+1" COLOR="red"><B><I>T</I></B></FONT>hrough Jesus Christ, thy Son our Lord, Who liveth and reigneth with thee, in the unity of the Holy Ghost, God, world without end.<br/>
<FONT COLOR="red"><I>℟.</I></FONT> Amen.<br/>`;

const OMITTED_SUFFRAGE = `<TR><TD VALIGN='TOP' WIDTH='50%' ID='Vespera10'><FONT SIZE='-1' >Suffragium{omittitur}</FONT><br/>
</TD>
<TD VALIGN='TOP' WIDTH='50%'><FONT SIZE='-1' >Suffrage{omit}</FONT><br/>
</TD>
</TR>`;

function appendToCell(cell, addition) {
  const closingTag = cell.lastIndexOf("</TD>");
  if (closingTag < 0) return null;
  return `${cell.slice(0, closingTag)}${addition}\n${cell.slice(closingTag)}`;
}

function omitSuffrage(html) {
  const suffrageMarker = html.indexOf("ID='Vespera10'");
  if (suffrageMarker < 0) return html;

  const rowStart = html.lastIndexOf("<TR><TD", suffrageMarker);
  const rowEnd = html.indexOf("</TR>", suffrageMarker);
  if (rowStart < 0 || rowEnd < 0) return html;

  return `${html.slice(0, rowStart)}${OMITTED_SUFFRAGE}${html.slice(rowEnd + 5)}`;
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

  const corrected = `${html.slice(0, rowStart)}${correctedLatin}${correctedEnglish}${html.slice(rowEnd + 5)}`;
  return omitSuffrage(corrected);
}

export async function onRequestGet({ request }) {
  const incoming = new URL(request.url);
  const version = VERSIONS[incoming.searchParams.get("version") || "1954"];
  const hour = incoming.searchParams.get("hour") || "Laudes";
  const isoDate = incoming.searchParams.get("date");
  const date = toDoDate(isoDate);

  if (!version || !HOURS.has(hour) || !date) {
    return Response.json({ error: "Invalid Office request." }, { status: 400 });
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
    return Response.json(
      { error: `Divinum Officium returned ${response.status}.` },
      { status: 502 },
    );
  }

  const upstreamHtml = await response.text();
  const html = correctKnownUpstreamDefects(upstreamHtml, { isoDate, hour });
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
