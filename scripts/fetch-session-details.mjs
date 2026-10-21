// Downloads session descriptions + speaker info from techorama.nl into src/sessionDetails.json.
// Run with:  npm run fetch-details   (or npm run update-schedule, which does this too)
import { readFile, writeFile } from "node:fs/promises";

const root = new URL("..", import.meta.url);
const schedule = JSON.parse(await readFile(new URL("src/scheduleData.json", root), "utf8"));

// Build the same id -> url pairs the app uses
const targets = [];
for (const day of ["tue", "wed"]) for (const sl of schedule[day]) for (const s of sl.s) targets.push([s.id, "https://techorama.nl/schedule/sessions/" + s.id.slice(1)]);
for (const w of schedule.workshops) targets.push([w.id, "https://techorama.nl/schedule/workshops/" + w.slug]);

const decode = s =>
  s
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(+d))
    .replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&");

const text = html =>
  decode(html.replace(/<br\s*\/?>/gi, "\n").replace(/<\/p>\s*<p[^>]*>/gi, "\n\n").replace(/<[^>]+>/g, ""))
    .replace(/\r\n?/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

function parse(html) {
  const pick = (re, src = html) => (src.match(re) || [])[1] || "";
  const description = text(pick(/<div class="session-detail__description"[^>]*>([\s\S]*?)<\/div>/));

  const speakers = [];
  for (const m of html.matchAll(/<a class="session-detail__speaker" href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/g)) {
    const block = m[2];
    speakers.push({
      name: text(pick(/session-detail__speaker-name"[^>]*>([\s\S]*?)<\/span>/, block)),
      tagline: text(pick(/session-detail__speaker-tagline"[^>]*>([\s\S]*?)<\/span>/, block)),
      photo: decode(pick(/<img src="([^"]+)"/, block)),
      page: "https://techorama.nl" + m[1],
      about: "",
    });
  }
  // "About the speaker" blocks (usually links) — attach to the speaker with the same name
  for (const m of html.matchAll(/<div class="session-detail__speaker-description"[^>]*>\s*<h4[^>]*>([\s\S]*?)<\/h4>\s*<div[^>]*>([\s\S]*?)<\/div>/g)) {
    const name = text(m[1]);
    const sp = speakers.find(s => s.name === name);
    if (sp) sp.about = text(m[2]);
  }
  return { description, speakers };
}

const out = {};
let failed = 0;
for (const [id, url] of targets) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("HTTP " + res.status);
    out[id] = { url, ...parse(await res.text()) };
    if (!out[id].description) console.warn("No description found:", id, url);
  } catch (e) {
    failed++;
    console.warn("Failed:", id, url, e.message);
  }
  await new Promise(r => setTimeout(r, 150)); // be gentle with the site
}

await writeFile(new URL("src/sessionDetails.json", root), JSON.stringify(out, null, 1) + "\n");
console.log(`Saved ${Object.keys(out).length} of ${targets.length} sessions to src/sessionDetails.json` + (failed ? ` (${failed} failed)` : ""));
