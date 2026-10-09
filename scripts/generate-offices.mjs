import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { mkdir, writeFile, readFile, rename, rm } from "node:fs/promises";
import { resolve, join } from "node:path";
import { VERSIONS, LANGUAGES, HOURS, validDate } from "../functions/lib/static-office.js";

const run = promisify(execFile);
const args = Object.fromEntries(process.argv.slice(2).reduce((pairs, value, i, all) => value.startsWith("--") ? [...pairs, [value.slice(2), all[i + 1]]] : pairs, []));
const source = resolve(args.source || process.env.DIVINUM_OFFICIUM_SOURCE || "");
if (!args.source && !process.env.DIVINUM_OFFICIUM_SOURCE) throw new Error("Provide --source");
const start = args.start || new Date().toISOString().slice(0, 10);
const days = Number(args.days || 90);
const concurrency = Number(args.concurrency || 4);
if (!validDate(start) || !Number.isInteger(days) || days < 1 || days > 732 || !Number.isInteger(concurrency) || concurrency < 1 || concurrency > 16) throw new Error("Invalid generation range or concurrency");
const output = resolve(args.output || "public/data/office");
const staging = `${output}.staging`;
const { stdout: sha } = await run("git", ["rev-parse", "HEAD"], { cwd: source });
const commit = sha.trim();
const end = new Date(`${start}T00:00:00Z`); end.setUTCDate(end.getUTCDate() + days - 1);
const lastDate = end.toISOString().slice(0, 10);
let previous;
try { previous = JSON.parse(await readFile(join(output, "available.json"), "utf8")); } catch (error) { if (error.code !== "ENOENT") throw error; }
if (!args.force && previous?.source.commit === commit && previous.start <= start && previous.end >= lastDate) {
  console.log("Upstream and generated range are current."); process.exit(0);
}
await rm(staging, { recursive: true, force: true });
await mkdir(staging, { recursive: true });
const tasks = [];
for (let offset = 0; offset < days; offset++) {
  const cursor = new Date(`${start}T00:00:00Z`); cursor.setUTCDate(cursor.getUTCDate() + offset);
  const date = cursor.toISOString().slice(0, 10);
  for (const version of Object.keys(VERSIONS)) for (const language of Object.keys(LANGUAGES)) for (const hour of HOURS) tasks.push({ date, version, language, hour });
}
let cursor = 0, completed = 0;
async function worker() {
  while (cursor < tasks.length) {
    const { date, version, language, hour } = tasks[cursor++];
    const [year, month, day] = date.split("-");
    const [lang1, lang2] = LANGUAGES[language];
    const parameters = [`command=pray${hour}`, `date1=${month}-${day}-${year}`, `version=${VERSIONS[version]}`, `lang1=${lang1}`, `lang2=${lang2}`, `votive=${version === "1954-bvm" ? "C12" : "Hodie"}`, "dioecesis=Generale", "testmode=regular", "content=1"];
    const { stdout, stderr } = await run("perl", [join(source, "web/cgi-bin/horas/Pofficium.pl"), ...parameters], { cwd: source, maxBuffer: 8 * 1024 * 1024, timeout: 90000 });
    const html = stdout.replace(/^Content-type:[^\r\n]*\r?\n\r?\n/i, "");
    if (stderr.trim() || !/<table\b/i.test(html) || !/<td\b/i.test(html) || /Software error:|Can't locate|Undefined subroutine/i.test(html)) throw new Error(`${date}/${version}/${language}/${hour}: invalid DO output ${stderr.slice(0, 500)}`);
    const directory = join(staging, version, language, date);
    await mkdir(directory, { recursive: true });
    await writeFile(join(directory, `${hour}.json`), JSON.stringify({ html, source: { repository: "https://github.com/DivinumOfficium/divinum-officium", commit }, date, version, language, hour }));
    if (++completed % 72 === 0) console.log(`Generated ${completed}/${tasks.length} Hours`);
  }
}
await Promise.all(Array.from({ length: concurrency }, worker));
await writeFile(join(staging, "available.json"), JSON.stringify({ schemaVersion: 1, source: { commit }, start, end: lastDate, versions: Object.keys(VERSIONS), languages: Object.keys(LANGUAGES), hours: HOURS, count: tasks.length }, null, 2) + "\n");
await rm(output, { recursive: true, force: true });
await rename(staging, output);
console.log(`Saved ${tasks.length} verified Hours from ${start} through ${lastDate}.`);
