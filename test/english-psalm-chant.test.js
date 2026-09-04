import assert from "node:assert/strict";
import test from "node:test";

await import("../public/english-psalm-chant.js");

const {
  buildEnglishPsalmGabc,
  englishPsalmLines,
  latinPsalmVerses,
  syllabifyWord,
} = globalThis.EnglishPsalmChantTest;

const psalmSource = `name: 98-6;
initial-style: 1;
annotation: 6.;
user-notes: Psalm 98.;
centering-scheme: latin;
%%
(c4)Dó(f)mi(gh)nus(h) re(h)gná(h)vit,(h) i(h)ras(h)*cán*(ixi)tur(h) *pó*(g)pu(h)li:(h.) *(:) qui(h) se(h)det(h) su(h)per(h) Ché(h)ru(h)bim,(h) mo(h)ve(h)_á_(f)_tur_(gh) *ter*(g)ra.(f.)  ^2.^(::) Dó(h)mi(h)nus(h) in(h) *Si*(ixi)on(h) *ma*(g)gnus:(h.) *(:) et(h) ex(h)cél(h)sus(h) su(h)per(h) _om_(f)_nes_(gh) *pó*(g)pu(f)los.(f.)  V/.(::) Gló(h)ri(h)a(h) Pa(h)tri:(h.) *(:) et(h) Spi(h)rí(h)tu(h)i(h) Sanc(g)to.(f.)  R/.(::) Sic(h)ut(h) e(h)rat(h):(h.) *(:) A(g)men.(f.) (::)`;

const englishText = `Psalms
Ant. Exalt ye the Lord.
Psalm 98
98:1 The Lord hath reigned, let the people be angry: * he that sitteth on the cherubims: let the earth be moved.
98:2 The Lord is great in Sion, * and high above all people.
℣. Glory be to the Father, and to the Son, * and to the Holy Ghost.
℟. As it was in the beginning, is now, * and ever shall be, world without end. Amen.
Ant. Exalt ye the Lord our God.`;

test("parses every Psalm verse from Divinum Officium's single-line GABC", () => {
  const verses = latinPsalmVerses(psalmSource.split("%%")[1]);
  assert.equal(verses.length, 2);
  assert.equal(verses[0].clef, "(c4)");
  assert.equal(verses[1].label, "2");
});

test("uses DO's English verses and English Gloria Patri with the selected tone", () => {
  const result = buildEnglishPsalmGabc(psalmSource, englishText);
  assert.ok(result);
  assert.equal(result.tone, "6.");
  assert.match(result.gabc, /The\(.*Lord\(/);
  assert.match(result.gabc, /Glo\(.*Fat\(.*her/);
  assert.match(result.gabc, /be\(.*gin\(.*world\(.*end/);
  assert.doesNotMatch(result.gabc, /Dó\(f\)mi/);
  assert.equal((result.gabc.match(/greheightstar/g) || []).length, 4);
});

test("keeps antiphons and non-Psalm canticles out of the English adapter", () => {
  const antiphon = "name: Exaltate Dominum;\nannotation: 6.;\n%%\n(c4) EX(h)al(hg)tá(h)te.(gf) (::)";
  const canticle = psalmSource.replace("name: 98-6;", "name: Benedictus-8G;");
  assert.equal(buildEnglishPsalmGabc(antiphon, englishText), null);
  assert.equal(buildEnglishPsalmGabc(canticle, englishText), null);
});

test("extracts Psalm verses separately from DO's Gloria lines", () => {
  const result = englishPsalmLines(englishText, 2);
  assert.equal(result.verses.length, 2);
  assert.deepEqual(result.gloria, [
    "Glory be to the Father, and to the Son, * and to the Holy Ghost.",
    "As it was in the beginning, is now, * and ever shall be, world without end. Amen.",
  ]);
});

test("syllabifies traditional English text without dropping punctuation", () => {
  assert.deepEqual(syllabifyWord("beginning,"), [
    { text: "be", wordEnd: false },
    { text: "gin", wordEnd: false },
    { text: "ning,", wordEnd: true },
  ]);
});
