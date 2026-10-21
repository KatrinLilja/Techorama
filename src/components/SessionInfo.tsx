import { useEffect, useRef, type ReactNode } from "react";
import { DAYS, LV, TR, type DayKey, type Session, type Slot } from "../schedule";
import { isWorkshop, type Team } from "../model";
import detailsJson from "../sessionDetails.json";

interface Speaker { name: string; tagline: string; photo: string; page: string; about: string }
interface Details { url: string; description: string; speakers: Speaker[] }
const DETAILS = detailsJson as Record<string, Details>;

export interface InfoTarget { s: Session; slot: Slot; day: DayKey }

/** Turns bare URLs in text into links. */
function linkify(t: string): ReactNode[] {
  return t.split(/(https?:\/\/[^\s)]+)/g).map((part, i) =>
    i % 2 ? <a key={i} href={part} target="_blank" rel="noopener">{part.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")}</a> : part,
  );
}

const initials = (n: string) => n.split(/\s+/).map(w => w[0]).slice(0, 2).join("");

export function InfoIcon() {
  return (
    <svg className="infoicon" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="7.6" r="1.35" fill="currentColor" />
      <path d="M12 11v6.2" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" />
    </svg>
  );
}

interface Props {
  target: InfoTarget | null;
  team: Team;
  onClose(): void;
  onToggle(sid: string): void;
}

export function SessionInfo({ target, onClose }: Props) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (target && !d.open) d.showModal();
    if (!target && d.open) d.close();
  }, [target]);

  const s = target?.s;
  const det = s ? DETAILS[s.id] : undefined;
  const time = target ? target.slot.t[0] + (target.slot.t[1] ? "–" + target.slot.t[1] : "") : "";

  return (
    <dialog
      ref={ref}
      className="info-dialog"
      aria-labelledby="info-title"
      onClose={onClose}
      onClick={e => { if (e.target === ref.current) ref.current?.close(); }} // click on the backdrop
    >
      {target && s && (
        <div className="info-inner">
          <div className="info-head">
            <div className="info-when">
              <span className="room">{s.room}</span>
              <span>{DAYS[target.day].label.replace(/ \w+$/, "")} · {time}{target.slot.kind ? " · " + target.slot.kind : ""}</span>
            </div>
            <button type="button" className="info-close" aria-label="Close" onClick={() => ref.current?.close()}>×</button>
          </div>

          <h2 id="info-title" className="info-title">{s.title}</h2>
          {(TR[s.track] || s.lvl) && (
            <div className="info-tags">
              {TR[s.track] && <span className="tag">{TR[s.track]}</span>}
              {s.lvl && <span className="tag">{LV[s.lvl]}</span>}
              {isWorkshop(s.id) && <span className="tag">Full Day Workshop</span>}
            </div>
          )}

          {det?.description ? (
            <p className="info-desc">{det.description}</p>
          ) : (
            <p className="info-desc muted">Techorama hasn't published a description for this one yet.</p>
          )}

          {det && det.speakers.length > 0 && (
            <section className="info-speakers">
              <h3 className="info-label">{det.speakers.length > 1 ? "Speakers" : "Speaker"}</h3>
              {det.speakers.map(sp => (
                <div className="speaker" key={sp.name}>
                  {sp.photo ? <img src={sp.photo} alt="" loading="lazy" /> : <span className="ph" aria-hidden="true">{initials(sp.name)}</span>}
                  <div className="speaker-body">
                    <a className="speaker-name" href={sp.page} target="_blank" rel="noopener">{sp.name}</a>
                    {sp.tagline && <p>{sp.tagline}</p>}
                    {sp.about && sp.about !== sp.tagline && <p className="speaker-about">{linkify(sp.about)}</p>}
                  </div>
                </div>
              ))}
            </section>
          )}

          <div className="info-actions">
            <a className="btn" href={det?.url || s.url || "https://techorama.nl/schedule"} target="_blank" rel="noopener">
              View on techorama.nl ↗
            </a>
          </div>
        </div>
      )}
    </dialog>
  );
}
