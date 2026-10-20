import type { Person } from "./usePeople";

const HUES = [222, 8, 150, 275, 35, 190, 330, 95, 250, 55, 170, 300];

export const firstName = (n: string) => n.split(/\s+/)[0];
export const isWorkshop = (sid: string) => sid[0] === "w";

/** My unsaved edits while a write is in flight; everyone else comes straight from the server. */
export interface LocalEdits {
  picks: Set<string>;
  interested: Set<string>;
  notes: Record<string, string>;
}

/** Read helpers shared by both views. */
export interface Team {
  people: Person[];
  me: string;
  meP: Person | undefined;
  canPick: boolean;
  picksOf(p: Person): Set<string>;
  interestOf(p: Person): Set<string>;
  notesOf(p: Person): Record<string, string>;
  attendees(sid: string): Person[];
  interested(sid: string): Person[];
  hueOf(id: string): number;
}

export function makeTeam(people: Person[], me: string, local: LocalEdits | null, writable: boolean): Team {
  const meP = people.find(p => p.id === me);
  const picksOf = (p: Person) => (p.id === me && local ? local.picks : new Set(p.picks));
  const interestOf = (p: Person) => (p.id === me && local ? local.interested : new Set(p.interested));
  const notesOf = (p: Person) => (p.id === me && local ? local.notes : p.notes);
  return {
    people,
    me,
    meP,
    canPick: !!meP && writable,
    picksOf,
    interestOf,
    notesOf,
    attendees: sid => people.filter(p => picksOf(p).has(sid)),
    interested: sid => (isWorkshop(sid) ? [] : people.filter(p => interestOf(p).has(sid) && !picksOf(p).has(sid))),
    hueOf: id => {
      const i = people.findIndex(p => p.id === id);
      return HUES[(i < 0 ? 0 : i) % HUES.length];
    },
  };
}
