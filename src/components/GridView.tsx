import { DAYS, type DayKey } from "../schedule";
import type { Team } from "../model";
import { hueStyle } from "./Chips";

export function GridView({ team, day }: { team: Team; day: DayKey }) {
  const D = DAYS[day];
  return (
    <>
      <h2 className="dayhead">{D.label}</h2>
      {team.people.length === 0 ? (
        <p className="empty">No names yet. Add yours with the “I am” menu above.</p>
      ) : (
        <div className="gridwrap">
          <table>
            <thead>
              <tr>
                <th scope="col">Name</th>
                {D.slots.map((sl, i) => (
                  <th scope="col" key={i}>
                    {sl.t[0]}
                    {sl.kind ? " · " + sl.kind : ""}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {team.people.map(p => {
                const ps = team.picksOf(p);
                return (
                  <tr key={p.id}>
                    <th scope="row">
                      <span className="chip" style={hueStyle(team.hueOf(p.id))}>{p.name}</span>
                    </th>
                    {D.slots.map((sl, i) => {
                      const hit = sl.s.find(s => ps.has(s.id));
                      if (!hit) return <td className="none" key={i}>—</td>;
                      if (hit.skip)
                        return (
                          <td className="none" title="Not going" key={i}>
                            <i>{(team.notesOf(p)[hit.id] || "").trim() || hit.title}</i>
                          </td>
                        );
                      return (
                        <td title={hit.title} key={i}>
                          <span className="r">{hit.room}</span>
                          <span className="t">{hit.title}</span>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
