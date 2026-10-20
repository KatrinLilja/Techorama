import type { CSSProperties } from "react";
import { firstName, type Team } from "../model";
import { Knight } from "./Knight";

export const hueStyle = (h: number) => ({ "--h": h }) as CSSProperties;

export function Chips({ team, sid }: { team: Team; sid: string }) {
  return (
    <span className="chips">
      {team.attendees(sid).map(p => (
        <span key={p.id} className={"chip" + (p.id === team.me ? " me" : "")} style={hueStyle(team.hueOf(p.id))} title={p.name + " is going"}>
          {firstName(p.name)}
        </span>
      ))}
      {team.interested(sid).map(p => (
        <span key={"i" + p.id} className={"chip int" + (p.id === team.me ? " me" : "")} style={hueStyle(team.hueOf(p.id))} title={p.name + " is interested"}>
          <Knight />
          {firstName(p.name)}
        </span>
      ))}
    </span>
  );
}
