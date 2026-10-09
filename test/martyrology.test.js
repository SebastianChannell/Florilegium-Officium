import assert from "node:assert/strict";
import test from "node:test";

import {
  resolveMartyrologyLanguageProfile,
  toDoDate,
} from "../functions/api/martyrology.js";

test("Martyrology always uses plain Latin in the left column", () => {
  assert.deepEqual(resolveMartyrologyLanguageProfile("English"), {
    lang1: "Latin",
    lang2: "English",
  });
  assert.deepEqual(resolveMartyrologyLanguageProfile("Cantilenae-English"), {
    lang1: "Latin",
    lang2: "English",
  });
});

test("Martyrology follows the selected Spanish translation", () => {
  assert.deepEqual(resolveMartyrologyLanguageProfile("Espanol"), {
    lang1: "Latin",
    lang2: "Espanol",
  });
});

test("Martyrology rejects unknown language profiles", () => {
  assert.equal(resolveMartyrologyLanguageProfile("Unknown"), null);
});

test("converts the selected ISO date to Divinum Officium format", () => {
  assert.equal(toDoDate("2026-10-06"), "10-6-2026");
  assert.equal(toDoDate("2026-01-09"), "1-9-2026");
  assert.equal(toDoDate("not-a-date"), null);
});
