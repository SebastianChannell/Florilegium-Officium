import assert from "node:assert/strict";
import test from "node:test";

import { correctKnownUpstreamDefects, resolveLanguageProfile } from "../functions/api/office.js";

const heading = `<P><SPAN>Commemoratio:</SPAN> <FONT COLOR="red">S. Zephyrini Papæ et Martyris</FONT></P>`;
const prayerRow = `<TR><TD ID='Vespera9'>Oratio<br/>Collect of St. Louis.<br/></TD><TD>Prayer<br/>Collect of St. Louis.<br/></TD></TR>`;
const suffrageRow = `<TR><TD ID='Vespera10'>Suffragium<br/>Full suffrage text.</TD><TD>Suffrage<br/>Full suffrage text.</TD></TR>`;

test("maps Cantilenae English to DO's GABC Latin and English columns", () => {
  assert.deepEqual(resolveLanguageProfile("Cantilenae-English"), {
    lang1: "Latin-gabc",
    lang2: "English",
  });
});

test("maps the separate English Psalm sung mode to the same DO source columns", () => {
  assert.deepEqual(resolveLanguageProfile("Cantilenae-Sung"), {
    lang1: "Latin-gabc",
    lang2: "English",
  });
});

test("keeps the existing bilingual language profiles", () => {
  assert.deepEqual(resolveLanguageProfile("English"), { lang1: "Latin", lang2: "English" });
  assert.deepEqual(resolveLanguageProfile("Espanol"), { lang1: "Latin", lang2: "Espanol" });
  assert.equal(resolveLanguageProfile("Unknown"), null);
});

test("adds the omitted bilingual commemoration to 25 August Vespers", () => {
  const corrected = correctKnownUpstreamDefects(`${heading}${prayerRow}${suffrageRow}`, {
    isoDate: "2026-08-25",
    hour: "Vesperae",
  });

  assert.match(corrected, /Commemoratio S\. Zephyrini Papæ et Martyris/);
  assert.match(corrected, /regem tuum, Pastor ætérne/);
  assert.match(corrected, /Commemoration of St\. Zephyrinus, Pope and Martyr/);
  assert.match(corrected, /ook forgivingly on thy flock, Eternal Shepherd/);
  assert.match(corrected, /Full suffrage text/);
  assert.doesNotMatch(corrected, /Suffragium\{omittitur\}|Suffrage\{omit\}/);
  assert.doesNotMatch(corrected, /Zephyrínum[\s\S]*Per Dóminum nostrum/);
  assert.ok(corrected.indexOf("Collect of St. Louis") < corrected.indexOf("Commemoratio S. Zephyrini"));
});

test("does not duplicate a commemoration already rendered upstream", () => {
  const html = `${heading}${prayerRow.replace(
    "Collect of St. Louis.<br/>",
    "Collect of St. Louis.<br/>Commemoratio S. Zephyrini Papæ et Martyris<br/>",
  )}`;

  assert.equal(
    correctKnownUpstreamDefects(html, { isoDate: "2026-08-25", hour: "Vesperae" }),
    html,
  );
});

test("does not alter another date or Hour", () => {
  const html = `${heading}${prayerRow}`;

  assert.equal(
    correctKnownUpstreamDefects(html, { isoDate: "2026-08-26", hour: "Vesperae" }),
    html,
  );
  assert.equal(
    correctKnownUpstreamDefects(html, { isoDate: "2026-08-25", hour: "Laudes" }),
    html,
  );
});

test("does not override Divinum Officium when the heading has no commemoration", () => {
  assert.equal(
    correctKnownUpstreamDefects(prayerRow, { isoDate: "2026-08-25", hour: "Vesperae" }),
    prayerRow,
  );
});
