// Techorama NL 2026 schedule.
// The sessions come from src/scheduleData.json, which `npm run update-schedule` downloads from techorama.nl.
// Day notes below use only wording confirmed on techorama.nl (schedule, FAQ and venue pages).
// The "not going" excuses are the planner's own jokes, not conference information.
import data from "./scheduleData.json";

export type DayKey = "mon" | "tue" | "wed";
export interface Session { id: string; url?: string; room: string; title: string; who: string; track: string; lvl: string; skip?: boolean }
export interface Slot { t: [string, string]; kind?: string; s: Session[] }
export interface Day { label: string; note: string; slots: Slot[] }

export const TR: Record<string, string> = { AI: "AI & Agents", ARC: "Architecture & Security", OPS: "Cloud & DevOps", DATA: "Data", DEV: "Dev", LEAD: "Leadership & Productivity", "": "" };
export const LV: Record<string, string> = { I: "Introductory and overview", M: "Intermediate", A: "Advanced" };

interface RawSession { id: string; room: string; title: string; who: string; track: string; lvl: string }
interface RawSlot { t: string[]; s: RawSession[] }
interface RawWorkshop { id: string; slug: string; title: string; who: string }
const raw = data as { workshops: RawWorkshop[]; tue: RawSlot[]; wed: RawSlot[] };

const DAY_INFO: Record<DayKey, { label: string; note: string }> = {
  mon: { label: "Monday 26 October", note: "Workshops at the Van der Valk hotel Utrecht." },
  tue: { label: "Tuesday 27 October", note: "Kinepolis Jaarbeurs Utrecht. Registration and breakfast from 07:30." },
  wed: { label: "Wednesday 28 October", note: "Kinepolis Jaarbeurs Utrecht. Registration and breakfast from 07:30." },
};

const toSlot = (sl: RawSlot): Slot => ({
  t: [sl.t[0] || "", sl.t[1] || ""],
  s: sl.s.map(s => ({ ...s, url: "https://techorama.nl/schedule/sessions/" + s.id.slice(1) })),
});

export const DAYS: Record<DayKey, Day> = {
  mon: {
    ...DAY_INFO.mon,
    slots: [{
      t: ["Full day", ""],
      kind: "Full Day Workshop",
      s: raw.workshops.map(w => ({ id: w.id, url: "https://techorama.nl/schedule/workshops/" + w.slug, room: "Van der Valk hotel Utrecht", title: w.title, who: w.who, track: "", lvl: "" })),
    }],
  },
  tue: { ...DAY_INFO.tue, slots: raw.tue.map(toSlot) },
  wed: { ...DAY_INFO.wed, slots: raw.wed.map(toSlot) },
};

// Every slot gets a "Not going" option, stored like a pick, with a slot-appropriate excuse
const FUN: Record<string, Record<string, string>> = {
  mon: { "Full day": "Skipping the workshop to tour the canals" },
  tue: {
    "08:30": "Sleeping",
    "09:45": "On my third coffee and second croissant",
    "11:15": "Lost somewhere in the expo hall",
    "12:30": "Busy at the lunch buffet",
    "13:15": "Food coma",
    "14:30": "Hunting for free socks at the booths",
    "16:00": "Recharging (me and my laptop)",
    "17:15": "Already looking for the bar",
  },
  wed: {
    "08:30": "Still sleeping off last night",
    "09:45": "Queueing for coffee",
    "11:15": "Collecting stickers for my laptop",
    "12:30": "Second round at the lunch buffet",
    "13:15": "Post-lunch nap in a comfy cinema seat",
    "14:30": "Pretending to answer urgent emails",
    "16:00": "Guarding our spot at the closing reception",
    "17:15": "Already at the closing reception",
  },
};
for (const [d, day] of Object.entries(DAYS)) day.slots.forEach((sl, i) => sl.s.push({ id: "skip-" + d + "-" + i, skip: true, room: "", title: FUN[d]?.[sl.t[0]] || "Not going", who: "", track: "", lvl: "" }));

// Index: session id -> {day, slotIndex, session}
export const IDX: Record<string, { day: DayKey; slot: number; s: Session }> = {};
for (const [d, day] of Object.entries(DAYS)) day.slots.forEach((sl, i) => sl.s.forEach(s => { IDX[s.id] = { day: d as DayKey, slot: i, s }; }));

export const DAY_KEYS: DayKey[] = ["mon", "tue", "wed"];
