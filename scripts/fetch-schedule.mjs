// Downloads the current Techorama schedule (workshops, Tuesday, Wednesday) into src/scheduleData.json
// and prints what changed since the last run.
// Run with:  npm run update-schedule   (also refreshes the session details afterwards)
import { readFile, writeFile } from "node:fs/promises";

const BASE = "https://techorama.nl";
const OUT = new URL("../src/scheduleData.json", import.meta.url);

const TRACKS = {
  "AI & Agents": "AI",
  "Architecture & Security": "ARC",
  "Cloud & DevOps": "OPS",
  "Data": "DATA",
  "Dev": "DEV",
  "Leadership & Productivity": "LEAD",
};
const LEVELS = { "100": "I", "200": "M", "300": "A" };
// Workshop ids already in use (so existing picks keep working); new workshops get the next number
const WORKSHOP_SEED = {
  "from-todo-to-ta-da-agentic-engineering-on-github": "w1",
  "mastering-modern-architecture-building-flexible-distributed-systems-with-hands-on-code": "w2",
  "software-architecture-fundamentals": "w3",
  "vibe-coding-for-production": "w4",
};

const decode = s =>
  s
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(+d))
    .replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&");
const text = html => decode(html.replace(/<[^>]+>/g, "")).replace(/\s+/g, " ").trim();
const cleanName = s => s.replace(/\s+\.(?=,|$)/g, "").trim(); // the site shows "Ardalis ."

async function get(path) {
  const res = await fetch(BASE + path);
  if (!res.ok) throw new Error(`${path}: HTTP ${res.status}`);
  return res.text();
}

function parseDay(html) {
  const slots = [];
  const parts = html.split('<div class="agenda-slot">').slice(1);
  for (const part of parts) {
    const time = text((part.match(/agenda-slot__time"><strong>([\s\S]*?)<\/strong>/) || [])[1] || "");
    const sessions = [];
    for (const m of part.matchAll(/<a class="session-card[^"]*" href="\/schedule\/sessions\/(\d+)">([\s\S]*?)<\/a>/g)) {
      const c = m[2];
      const pick = re => text((c.match(re) || [])[1] || "");
      const trackLabel = pick(/<span class="session-track[^"]*">([\s\S]*?)<\/span>/);
      const level = (c.match(/session-level--(\d+)/) || [])[1];
      sessions.push({
        id: "s" + m[1],
        room: pick(/session-card__time">([\s\S]*?)<\/div>/),
        title: pick(/session-card__title">([\s\S]*?)<\/div>/),
        who: cleanName(pick(/session-card__meta--secondary">([\s\S]*?)<\/div>/)),
        track: TRACKS[trackLabel] ?? "",
        lvl: LEVELS[level] ?? "",
      });
    }
    if (!sessions.length) continue; // breaks, registration
    const [start, end = ""] = time.split(/[–-]/).map(x => x.trim());
    slots.push({ t: [start, end], s: sessions });
  }
  return slots;
}

function parseWorkshops(html, previous) {
  const ids = { ...WORKSHOP_SEED };
  for (const w of previous?.workshops || []) ids[w.slug] = w.id;
  let next = Math.max(0, ...Object.values(ids).map(id => +id.slice(1))) + 1;
  const out = [];
  for (const m of html.matchAll(/<a class="speaker-card workshop-card" href="\/schedule\/workshops\/([^"]+)">([\s\S]*?)<\/a>/g)) {
    const c = m[2];
    const slug = m[1];
    if (!ids[slug]) ids[slug] = "w" + next++;
    out.push({
      id: ids[slug],
      slug,
      title: text((c.match(/workshop-card__title">([\s\S]*?)<\/h6>/) || [])[1] || ""),
      who: cleanName(text((c.match(/workshop-card__speakers[^"]*">([\s\S]*?)<\/div>/) || [])[1] || "")),
    });
  }
  return out;
}

// ---- fetch ----
let previous = null;
try { previous = JSON.parse(await readFile(OUT, "utf8")); } catch { /* first run */ }

const data = {
  updated: new Date().toISOString(),
  workshops: parseWorkshops(await get("/schedule/workshops"), previous),
  tue: parseDay(await get("/schedule/tuesday")),
  wed: parseDay(await get("/schedule/wednesday")),
};

// Sanity checks so a site redesign can't silently wipe the schedule
for (const d of ["tue", "wed"]) {
  const n = data[d].reduce((a, sl) => a + sl.s.length, 0);
  if (data[d].length < 5 || n < 20) throw new Error(`Only found ${data[d].length} slots / ${n} sessions for ${d} — the site layout may have changed. Nothing was saved.`);
}
if (data.workshops.length === 0) throw new Error("No workshops found — the site layout may have changed. Nothing was saved.");

// ---- report changes ----
if (previous) {
  const index = d => {
    const m = new Map();
    for (const w of d.workshops) m.set(w.id, { day: "Mon", time: "Full day", room: "", title: w.title });
    for (const day of ["tue", "wed"]) for (const sl of d[day]) for (const s of sl.s) m.set(s.id, { day: day === "tue" ? "Tue" : "Wed", time: sl.t[0], room: s.room, title: s.title });
    return m;
  };
  const a = index(previous), b = index(data);
  const lines = [];
  for (const [id, o] of a) if (!b.has(id)) lines.push(`  REMOVED  ${o.day} ${o.time} ${o.room} — ${o.title}`);
  for (const [id, n] of b) if (!a.has(id)) lines.push(`  ADDED    ${n.day} ${n.time} ${n.room} — ${n.title}`);
  for (const [id, n] of b) {
    const o = a.get(id);
    if (!o) continue;
    if (o.day !== n.day || o.time !== n.time || o.room !== n.room) lines.push(`  MOVED    ${n.title}: ${o.day} ${o.time} ${o.room} → ${n.day} ${n.time} ${n.room}`);
    else if (o.title !== n.title) lines.push(`  RENAMED  "${o.title}" → "${n.title}"`);
  }
  console.log(lines.length ? "Schedule changes:\n" + lines.join("\n") : "No schedule changes.");
}

await writeFile(OUT, JSON.stringify(data, null, 1) + "\n");
const count = ["tue", "wed"].reduce((a, d) => a + data[d].reduce((x, sl) => x + sl.s.length, 0), 0);
console.log(`Saved ${data.workshops.length} workshops and ${count} sessions to src/scheduleData.json`);
