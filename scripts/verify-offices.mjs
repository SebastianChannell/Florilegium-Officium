import { readFile } from "node:fs/promises";
import { VERSIONS, LANGUAGES, HOURS } from "../functions/lib/static-office.js";
const manifest = JSON.parse(await readFile("public/data/office/available.json", "utf8"));
let count = 0;
for (let cursor = new Date(`${manifest.start}T00:00:00Z`); cursor.toISOString().slice(0, 10) <= manifest.end; cursor.setUTCDate(cursor.getUTCDate() + 1)) {
  const date = cursor.toISOString().slice(0, 10);
  for (const version of Object.keys(VERSIONS)) for (const language of Object.keys(LANGUAGES)) for (const hour of HOURS) {
    const data = JSON.parse(await readFile(`public/data/office/${version}/${language}/${date}/${hour}.json`, "utf8"));
    if (data.date !== date || data.version !== version || data.language !== language || data.hour !== hour || data.source.commit !== manifest.source.commit || !/<table\b/i.test(data.html) || !/<td\b/i.test(data.html)) throw new Error(`Invalid Office: ${date}/${version}/${language}/${hour}`);
    count++;
  }
}
if (count !== manifest.count) throw new Error("Incomplete manifest");
console.log(`Verified ${count} generated Hours.`);
