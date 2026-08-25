import assert from "node:assert/strict";
import test from "node:test";

import { correctKnownUpstreamDefects } from "../functions/api/office.js";

const heading = `<P><SPAN>Commemoratio:</SPAN> <FONT COLOR="red">S. Zephyrini Papæ et Martyris</FONT></P>`;
const prayerRow = `<TR><TD ID='Vespera9'>Oratio<br/>Collect of St. Louis.<br/></TD><TD>Prayer<br/>Collect of St. Louis.<br/></TD></TR>`;
const suffrageRow = `<TR><TD ID='Vespera10'>Suffragium<br/>Full suffrage text.</TD><TD>Suffrage<br/>Full suffrage text.</TD></TR>`;

test("adds the omitted bilingual commemoration to 25 August Vespers", () => {
  const corrected = correctKnownUpstreamDefects(`${heading}${prayerRow}${suffrageRow}`, {
    isoDate: "2026-08-25",
    hour: "Vesperae",
  });

  assert.match(corrected, /Commemoratio S\. Zephyrini Papæ et Martyris/);
  assert.match(corrected, /regem tuum, Pastor ætérne/);
  assert.match(corrected, /Commemoration of St\. Zephyrinus, Pope and Martyr/);
  assert.match(corrected, /ook forgivingly on thy flock, Eternal Shepherd/);
  assert.match(corrected, /Suffragium\{omittitur\}/);
  assert.match(corrected, /Suffrage\{omit\}/);
  assert.doesNotMatch(corrected, /Full suffrage text/);
  assert.equal((corrected.match(/Amen\.<br\/>/g) || []).length, 2);
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
