import { Fragment, useState } from "react";
import { DAYS, LV, TR, type DayKey } from "../schedule";
import { firstName, isWorkshop, type Team } from "../model";
import { Chips } from "./Chips";
import { Knight } from "./Knight";
import { InfoIcon, SessionInfo, type InfoTarget } from "./SessionInfo";

interface Props {
  team: Team;
  day: DayKey;
  onlyTeam: boolean;
  onlyMine: boolean;
  onToggle(sid: string): void;
  onToggleInterest(sid: string): void;
  onNoteChange(sid: string, text: string): void;
  onNoteDone(): void;
}

export function SessionsView({ team, day, onlyTeam, onlyMine, onToggle, onToggleInterest, onNoteChange, onNoteDone }: Props) {
  const D = DAYS[day];
  const { meP, canPick } = team;
  const myPicks = meP ? team.picksOf(meP) : new Set<string>();
  const myInt = meP ? team.interestOf(meP) : new Set<string>();
  const myNotes = meP ? team.notesOf(meP) : {};
  const solo = day === "mon";
  const [info, setInfo] = useState<InfoTarget | null>(null);

  const slots = D.slots
    .map((sl, i) => ({
      sl,
      i,
      list: sl.s.filter(
        s =>
          (!onlyTeam || team.attendees(s.id).length > 0 || team.interested(s.id).length > 0) &&
          (!onlyMine || (meP && (myPicks.has(s.id) || (!isWorkshop(s.id) && myInt.has(s.id))))),
      ),
    }))
    .filter(x => x.list.length > 0);

  return (
    <>
      <h2 className="dayhead">
        {D.label} <small>{D.note}</small>
      </h2>

      {slots.map(({ sl, i, list }) => (
        <section className="slot" key={i}>
          <div className="time">
            {sl.t[0]}
            {sl.t[1] ? "–" + sl.t[1] : ""}
            {sl.kind && <span>{sl.kind}</span>}
          </div>
          <div className="list">
            {list.map(s => {
              const on = canPick && myPicks.has(s.id);
              const starred = canPick && !s.skip && myInt.has(s.id);
              const meta = [s.who, TR[s.track] || "", s.lvl ? LV[s.lvl] : ""].filter(Boolean).join(" · ");
              const noteLines = s.skip
                ? team.attendees(s.id).map(p => [p, (team.notesOf(p)[s.id] || "").trim()] as const).filter(x => x[1])
                : [];
              return (
                <Fragment key={s.id}>
                  <div className={"srow" + (solo ? " solo" : "")}>
                    <div
                      role="button"
                      tabIndex={canPick ? 0 : -1}
                      className={"sess" + (s.skip ? " skip" : "")}
                      aria-pressed={on}
                      aria-disabled={!canPick}
                      onClick={() => { if (canPick) onToggle(s.id); }}
                      onKeyDown={e => {
                        if (e.target === e.currentTarget && canPick && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); onToggle(s.id); }
                      }}
                    >
                      <span className="tick" aria-hidden="true" />
                      {s.skip ? (
                        <span className="body">
                          <div className="ttl">{s.title}</div>
                          <div className="meta">Not going to a session this slot</div>
                          {noteLines.length > 0 && (
                            <span className="notes">
                              {noteLines.map(([p, t]) => (
                                <span className="note" key={p.id}>
                                  <b>{firstName(p.name)}:</b> {t}
                                </span>
                              ))}
                            </span>
                          )}
                        </span>
                      ) : (
                        <span className="body">
                          <span className="room">{s.room}</span>
                          <div className="ttl">
                            {s.title.slice(0, s.title.lastIndexOf(" ") + 1)}
                            {/* keep the last word and the ⓘ together so the icon never wraps onto its own line */}
                            <span className="nowrap">
                            {s.title.slice(s.title.lastIndexOf(" ") + 1)}
                            <button
                              type="button"
                              className="info"
                              aria-label={"More about " + s.title}
                              title="More details"
                              onClick={e => { e.stopPropagation(); setInfo({ s, slot: sl, day }); }}
                              onKeyDown={e => e.stopPropagation()}
                            >
                              <InfoIcon />
                            </button>
                            </span>
                          </div>
                          <div className="meta">{meta}</div>
                        </span>
                      )}
                      <Chips team={team} sid={s.id} />
                    </div>
                    {!solo &&
                      (s.skip ? (
                        <span />
                      ) : (
                        <button
                          type="button"
                          className="star"
                          aria-pressed={starred}
                          aria-label={"Interested in " + s.title}
                          title={starred ? "Not interested any more" : "I'm interested"}
                          disabled={!canPick}
                          onClick={() => onToggleInterest(s.id)}
                        >
                          <Knight />
                        </button>
                      ))}
                  </div>
                  {s.skip && on && (
                    <div className="noteedit">
                      <label htmlFor={"note-" + s.id}>Your own excuse</label>
                      <input
                        type="text"
                        id={"note-" + s.id}
                        maxLength={80}
                        autoComplete="off"
                        placeholder={s.title}
                        value={myNotes[s.id] || ""}
                        onChange={e => onNoteChange(s.id, e.target.value.slice(0, 80))}
                        onBlur={onNoteDone}
                        onKeyDown={e => { if (e.key === "Enter") e.currentTarget.blur(); }}
                      />
                    </div>
                  )}
                </Fragment>
              );
            })}
          </div>
        </section>
      ))}

      {slots.length === 0 && (
        <p className="empty">
          {onlyMine ? "You haven't picked or shrugged at anything this day yet." : "Nobody on the team has picked or shrugged at a session this day yet."}
        </p>
      )}
      <p className="ext">
        Tap <b>ⓘ</b> for the full description and speaker info, or browse{" "}
        <a href="https://techorama.nl/schedule" target="_blank" rel="noopener">
          techorama.nl/schedule
        </a>
        . Rooms marked (JB) are in the Jaarbeurs building next door.
      </p>
      <SessionInfo target={info} team={team} onClose={() => setInfo(null)} onToggle={onToggle} />
    </>
  );
}
