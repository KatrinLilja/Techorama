import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from "react";
import { DAYS, DAY_KEYS, IDX, type DayKey } from "./schedule";
import { usePeople } from "./usePeople";
import { makeTeam, type LocalEdits } from "./model";
import { Knight, KnightDefs } from "./components/Knight";
import { SessionsView } from "./components/SessionsView";
import { GridView } from "./components/GridView";
import { hueStyle } from "./components/Chips";
import { ThemeToggle } from "./components/ThemeToggle";

// ---- per-device preferences (who I am, which tab) ----
const store = {
  get(k: string) { try { return localStorage.getItem(k); } catch { return null; } },
  set(k: string, v: string) { try { localStorage.setItem(k, v); } catch { /* private mode */ } },
};
const normName = (s: string) => s.trim().replace(/\s+/g, " ");
const DAY_TABS: Record<DayKey, [string, string]> = { mon: ["Mon 26", " Workshops"], tue: ["Tue 27", ""], wed: ["Wed 28", ""] };

export default function App() {
  const { people, status, loaded, addPerson, savePicks, renamePerson, removePerson } = usePeople();

  const [me, setMeState] = useState(() => store.get("tp.me") || "");
  const [day, setDayState] = useState<DayKey>(() => { const d = store.get("tp.day") as DayKey; return DAYS[d] ? d : "tue"; });
  const [view, setViewState] = useState<"sessions" | "grid">(() => (store.get("tp.view") === "grid" ? "grid" : "sessions"));
  const [onlyTeam, setOnlyTeam] = useState(() => store.get("tp.only") === "1");
  const [onlyMine, setOnlyMine] = useState(() => store.get("tp.mine") === "1");
  const [notice, setNotice] = useState<ReactNode>(null);

  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [renaming, setRenaming] = useState(false);
  const [renameText, setRenameText] = useState("");
  const [renameError, setRenameError] = useState("");
  const [confirmRemove, setConfirmRemove] = useState(false);

  // ---- my unsaved edits (optimistic), mirrored in a ref for the write loop ----
  const [local, setLocalState] = useState<LocalEdits | null>(null);
  const localRef = useRef<LocalEdits | null>(null);
  const setLocal = (l: LocalEdits | null) => { localRef.current = l; setLocalState(l); };
  const meRef = useRef(me);
  meRef.current = me;
  const peopleRef = useRef(people);
  peopleRef.current = people;

  const setMe = (id: string) => {
    setMeState(id); store.set("tp.me", id);
    setLocal(null); setRenaming(false); setRenameError(""); setConfirmRemove(false);
  };

  // If my name was removed (e.g. on another device), forget it here too
  useEffect(() => {
    if (loaded && me && !people.some(p => p.id === me)) setMe("");
  }, [loaded, me, people]); // eslint-disable-line react-hooks/exhaustive-deps

  const team = useMemo(() => makeTeam(people, me, local, status !== "unconfigured"), [people, me, local, status]);

  function ensureLocal(): LocalEdits | null {
    if (localRef.current) return localRef.current;
    const meP = peopleRef.current.find(p => p.id === meRef.current);
    if (!meP) return null;
    return { picks: new Set(meP.picks), interested: new Set(meP.interested), notes: { ...meP.notes } };
  }

  // ---- writes: one at a time, coalesced ----
  const writing = useRef(false);
  const dirty = useRef(false);
  const noteTimer = useRef<number | null>(null);

  const flush = useCallback(async () => {
    if (writing.current) { dirty.current = true; return; }
    writing.current = true;
    const id = meRef.current;
    try {
      do {
        dirty.current = false;
        const l = localRef.current;
        if (!l) break;
        await savePicks(id, { picks: [...l.picks], interested: [...l.interested], notes: { ...l.notes } });
      } while (dirty.current);
      setNotice(null);
    } catch {
      setNotice(<><strong>Couldn't save that change.</strong> Check your connection and try again.</>);
      dirty.current = false;
      setLocal(null); // fall back to what the server has
    } finally {
      writing.current = false;
      // settle onto the server's copy once nothing is pending
      if (!dirty.current && noteTimer.current === null && meRef.current === id) setLocal(null);
    }
  }, [savePicks]);

  function toggle(sid: string) {
    const l = ensureLocal();
    if (!l) return;
    const picks = new Set(l.picks);
    if (picks.has(sid)) picks.delete(sid);
    else {
      const info = IDX[sid];
      for (const other of DAYS[info.day].slots[info.slot].s) picks.delete(other.id); // one pick per slot
      picks.add(sid);
    }
    setLocal({ ...l, picks });
    flush();
  }

  function toggleInterest(sid: string) {
    const l = ensureLocal();
    if (!l) return;
    const interested = new Set(l.interested);
    if (interested.has(sid)) interested.delete(sid); else interested.add(sid);
    setLocal({ ...l, interested });
    flush();
  }

  function changeNote(sid: string, text: string) {
    const l = ensureLocal();
    if (!l) return;
    setLocal({ ...l, notes: { ...l.notes, [sid]: text } });
    if (noteTimer.current !== null) clearTimeout(noteTimer.current);
    noteTimer.current = window.setTimeout(() => { noteTimer.current = null; flush(); }, 700);
  }

  function noteDone() {
    if (noteTimer.current !== null) { clearTimeout(noteTimer.current); noteTimer.current = null; flush(); }
  }

  // ---- names ----
  async function submitAdd(e: FormEvent) {
    e.preventDefault();
    const name = normName(newName);
    if (!name) return;
    const existing = people.find(p => p.name.toLowerCase() === name.toLowerCase());
    try {
      setMe(existing ? existing.id : (await addPerson(name)).id);
      setAdding(false); setNewName("");
    } catch (err) {
      const code = (err as { code?: string }).code;
      setNotice(code === "23505"
        ? <><strong>That name is already taken.</strong> Pick it from the list instead.</>
        : <><strong>Couldn't add your name.</strong> Check your connection and try again.</>);
    }
  }

  async function saveRename() {
    const name = normName(renameText);
    const meP = team.meP;
    if (!meP) return;
    if (!name) return setRenameError("Type a name first.");
    if (people.some(p => p.id !== me && p.name.toLowerCase() === name.toLowerCase())) return setRenameError("Someone already uses that name.");
    if (name !== meP.name) {
      try { await renamePerson(me, name); }
      catch (err) {
        return setRenameError((err as { code?: string }).code === "23505" ? "Someone already uses that name." : "Couldn't save. Try again.");
      }
    }
    setRenaming(false); setRenameError("");
  }

  async function doRemove() {
    try { await removePerson(me); setMe(""); }
    catch { setNotice(<><strong>Couldn't remove your name.</strong> Check your connection and try again.</>); setConfirmRemove(false); }
  }

  const setDay = (d: DayKey) => { setDayState(d); store.set("tp.day", d); };
  const setView = (v: "sessions" | "grid") => { setViewState(v); store.set("tp.view", v); };

  // ---- connection notices ----
  let connNotice: ReactNode = null;
  if (status === "unconfigured")
    connNotice = <><strong>Supabase isn't connected yet.</strong> Copy <code>.env.example</code> to <code>.env.local</code>, fill in your project URL and anon key, then restart <code>npm run dev</code>. See README.md.</>;
  else if (status === "offline")
    connNotice = <><strong>Lost the connection to the team's picks.</strong> Retrying… changes you make may not be saved until it's back.</>;

  const selectPlaceholder = loaded ? (people.length ? "Choose your name" : "No names yet") : status === "unconfigured" ? "Not connected" : "Loading names…";

  return (
    <>
      <KnightDefs />
      <header className="top wrap">
        <div className="topline">
          <div className="eyebrow">Techorama NL · Utrecht · 26–28 Oct 2026</div>
          <ThemeToggle />
        </div>
        <h1>Techorama Team Planner</h1>
        <p className="lede">
          Choose your name, then tap the session you're going to in each time slot. Tap the shrugging knight <Knight /> on any
          sessions you're interested in, as many as you like. Everyone on the team sees the same picks, on every device.
        </p>
        <div className="legend" aria-hidden="true">
          <span><span className="chip" style={hueStyle(222)}>Name</span> going</span>
          <span><span className="chip int" style={hueStyle(222)}><Knight />Name</span> interested</span>
        </div>
      </header>

      <div className="bar">
        <div className="wrap">
          <div className="who">
            <label htmlFor="who">I am</label>
            <select
              id="who"
              aria-label="Your name"
              disabled={!loaded}
              value={team.meP ? me : ""}
              onChange={e => {
                if (e.target.value === "__add") { setAdding(true); return; }
                setMe(e.target.value);
              }}
            >
              <option value="">{selectPlaceholder}</option>
              {people.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              {loaded && <option value="__add">+ Add a name…</option>}
            </select>
            {adding && (
              <form className="addform" onSubmit={submitAdd}>
                <input type="text" placeholder="Your name" maxLength={40} autoComplete="off" autoFocus value={newName} onChange={e => setNewName(e.target.value)} />
                <button className="btn primary" type="submit">Add</button>
                <button className="btn link" type="button" onClick={() => { setAdding(false); setNewName(""); }}>Cancel</button>
              </form>
            )}
          </div>
          <div className="tabs" role="tablist" aria-label="Day">
            {DAY_KEYS.map(d => (
              <button key={d} className="tab" role="tab" aria-selected={d === day} onClick={() => setDay(d)}>
                <b>{DAY_TABS[d][0]}</b>{DAY_TABS[d][1]}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="wrap">
        <div className="tools">
          <div className="seg" role="group" aria-label="View">
            <button type="button" aria-pressed={view === "sessions"} onClick={() => setView("sessions")}>Sessions</button>
            <button type="button" aria-pressed={view === "grid"} onClick={() => setView("grid")}>Who's where</button>
          </div>
          {view === "sessions" && (
            <>
              <label className="check">
                <input type="checkbox" checked={onlyTeam} onChange={e => { setOnlyTeam(e.target.checked); store.set("tp.only", e.target.checked ? "1" : "0"); }} />
                {" "}Only sessions with teammates
              </label>
              <label className="check">
                <input type="checkbox" checked={onlyMine} onChange={e => { setOnlyMine(e.target.checked); store.set("tp.mine", e.target.checked ? "1" : "0"); }} />
                {" "}Only my picks and shrugs
              </label>
            </>
          )}
          {team.meP && (
            <span>
              {renaming ? (
                <span className="rename">
                  <label htmlFor="renamebox">New name</label>{" "}
                  <input
                    type="text" id="renamebox" maxLength={40} autoComplete="off" autoFocus
                    value={renameText}
                    onChange={e => setRenameText(e.target.value)}
                    onFocus={e => e.currentTarget.select()}
                    onKeyDown={e => {
                      if (e.key === "Enter") { e.preventDefault(); saveRename(); }
                      else if (e.key === "Escape") { setRenaming(false); setRenameError(""); }
                    }}
                  />{" "}
                  <button className="btn primary" type="button" onClick={saveRename}>Save</button>{" "}
                  <button className="btn link" type="button" onClick={() => { setRenaming(false); setRenameError(""); }}>Cancel</button>
                  {renameError && <> <span className="err">{renameError}</span></>}
                </span>
              ) : confirmRemove ? (
                <>
                  Remove {team.meP.name} and their picks?{" "}
                  <button className="btn danger" type="button" onClick={doRemove}>Remove</button>{" "}
                  <button className="btn link" type="button" onClick={() => setConfirmRemove(false)}>Keep</button>
                </>
              ) : (
                <>
                  <button className="btn link" type="button" onClick={() => { setRenameText(team.meP!.name); setRenaming(true); setConfirmRemove(false); }}>Edit my name</button>{" "}
                  <button className="btn link" type="button" onClick={() => setConfirmRemove(true)}>Remove my name</button>
                </>
              )}
            </span>
          )}
          {status === "live" && <span className="status live">Live</span>}
        </div>

        {(connNotice || notice) && <div className="notice">{connNotice || notice}</div>}

        <main>
          {!loaded && status !== "unconfigured" ? (
            <p className="empty">Loading the schedule…</p>
          ) : view === "grid" ? (
            <GridView team={team} day={day} />
          ) : (
            <SessionsView
              team={team}
              day={day}
              onlyTeam={onlyTeam}
              onlyMine={onlyMine}
              onToggle={toggle}
              onToggleInterest={toggleInterest}
              onNoteChange={changeNote}
              onNoteDone={noteDone}
            />
          )}
        </main>
      </div>
    </>
  );
}
