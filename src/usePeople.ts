import { useCallback, useEffect, useState } from "react";
import { supabase } from "./supabase";

export interface Person {
  id: string;
  name: string;
  picks: string[];
  interested: string[];
  notes: Record<string, string>;
  created_at: string;
}

export interface PicksPatch {
  picks: string[];
  interested: string[];
  notes: Record<string, string>;
}

export type Status = "unconfigured" | "loading" | "live" | "offline";

const TABLE = "people";

function clean(row: Record<string, unknown>): Person {
  const notes: Record<string, string> = {};
  if (row.notes && typeof row.notes === "object")
    for (const [k, v] of Object.entries(row.notes as Record<string, unknown>)) if (typeof v === "string") notes[k] = v;
  return {
    id: String(row.id),
    name: String(row.name || "Someone"),
    picks: Array.isArray(row.picks) ? (row.picks as string[]) : [],
    interested: Array.isArray(row.interested) ? (row.interested as string[]) : [],
    notes,
    created_at: String(row.created_at || ""),
  };
}

const byCreated = (a: Person, b: Person) => a.created_at.localeCompare(b.created_at);

function upsertLocal(list: Person[], p: Person) {
  const i = list.findIndex(x => x.id === p.id);
  const next = i < 0 ? [...list, p] : list.map(x => (x.id === p.id ? p : x));
  return next.sort(byCreated);
}

/** The team list, kept live from Supabase, plus the write operations. */
export function usePeople() {
  const [people, setPeople] = useState<Person[]>([]);
  const [status, setStatus] = useState<Status>(supabase ? "loading" : "unconfigured");
  const [loaded, setLoaded] = useState(false); // true once the list has been fetched successfully

  useEffect(() => {
    const db = supabase;
    if (!db) return;
    let cancelled = false;

    const load = async () => {
      const { data, error } = await db.from(TABLE).select("*").order("created_at");
      if (cancelled) return;
      if (error) { setStatus("offline"); return; }
      setPeople((data || []).map(clean));
      setLoaded(true);
    };

    const channel = db
      .channel("people-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: TABLE }, payload => {
        if (payload.eventType === "DELETE") {
          const id = (payload.old as { id?: string }).id;
          setPeople(list => list.filter(p => p.id !== id));
        } else {
          const p = clean(payload.new as Record<string, unknown>);
          setPeople(list => upsertLocal(list, p));
        }
      })
      .subscribe(state => {
        if (cancelled) return;
        if (state === "SUBSCRIBED") { setStatus("live"); load(); } // (re)load on every (re)connect so nothing is missed
        else if (state === "CHANNEL_ERROR" || state === "TIMED_OUT" || state === "CLOSED") setStatus("offline");
      });

    load();
    // Catch up when a phone wakes up or the tab comes back into view
    const onVisible = () => { if (document.visibilityState === "visible") load(); };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      cancelled = true;
      document.removeEventListener("visibilitychange", onVisible);
      db.removeChannel(channel);
    };
  }, []);

  const addPerson = useCallback(async (name: string): Promise<Person> => {
    if (!supabase) throw new Error("not configured");
    const { data, error } = await supabase.from(TABLE).insert({ name }).select().single();
    if (error) throw error;
    const p = clean(data);
    setPeople(list => upsertLocal(list, p));
    return p;
  }, []);

  const savePicks = useCallback(async (id: string, patch: PicksPatch) => {
    if (!supabase) throw new Error("not configured");
    const { data, error } = await supabase
      .from(TABLE)
      .update({ ...patch, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    const p = clean(data);
    setPeople(list => upsertLocal(list, p));
  }, []);

  const renamePerson = useCallback(async (id: string, name: string) => {
    if (!supabase) throw new Error("not configured");
    const { data, error } = await supabase.from(TABLE).update({ name }).eq("id", id).select().single();
    if (error) throw error;
    const p = clean(data);
    setPeople(list => upsertLocal(list, p));
  }, []);

  const removePerson = useCallback(async (id: string) => {
    if (!supabase) throw new Error("not configured");
    const { error } = await supabase.from(TABLE).delete().eq("id", id);
    if (error) throw error;
    setPeople(list => list.filter(p => p.id !== id));
  }, []);

  return { people, status, loaded, addPerson, savePicks, renamePerson, removePerson };
}
