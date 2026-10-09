import assert from "node:assert/strict";
import test from "node:test";
import { restoreMissingChantText } from "../scripts/lib/chant-fallback.mjs";

test("missing notation uses DO's same Latin section and keeps the translated column", () => {
  const chant = `<TR><TD ID='Completorium8'>Hymnus 'GABC score /private/path not found'</TD><TD>English hymn</TD></TR><TR><TD ID='Completorium9'>Valid GABC</TD><TD>Prayer</TD></TR>`;
  const plain = `<TR><TD ID='Completorium8'>Hymnus Te lucis ante terminum</TD><TD>Other English</TD></TR>`;
  const result = restoreMissingChantText(chant, plain);
  assert.match(result, /Te lucis ante terminum/);
  assert.match(result, /English hymn/);
  assert.match(result, /Valid GABC/);
  assert.doesNotMatch(result, /private\/path|Other English/);
});

test("incomplete fallback output fails instead of publishing an omitted hymn", () => {
  assert.throws(() => restoreMissingChantText(`<TR><TD ID='Completorium8'>GABC score missing not found</TD><TD>Hymn</TD></TR>`, "<table></table>"), /Missing DO text/);
});
