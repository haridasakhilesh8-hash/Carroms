import type { Standing } from "@/lib/types";

export function StandingsTable({ standings }: { standings: Standing[] }) {
  return (
    <div className="overflow-hidden rounded-[28px] border border-white/10 bg-white/5">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-white/10 text-[var(--color-sand)]">
            <tr>
              {["Player/Team", "P", "W", "L", "GW", "GL", "PF", "PA", "Pts", "Status"].map((head) => (
                <th key={head} className="px-4 py-3 font-semibold">
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {standings.map((entry) => (
              <tr key={entry.name} className="border-t border-white/10 text-[var(--color-mist)]">
                <td className="px-4 py-3 font-medium text-white">{entry.name}</td>
                <td className="px-4 py-3">{entry.played}</td>
                <td className="px-4 py-3">{entry.wins}</td>
                <td className="px-4 py-3">{entry.losses}</td>
                <td className="px-4 py-3">{entry.gamesWon}</td>
                <td className="px-4 py-3">{entry.gamesLost}</td>
                <td className="px-4 py-3">{entry.pointsScored}</td>
                <td className="px-4 py-3">{entry.pointsConceded}</td>
                <td className="px-4 py-3 font-semibold text-[var(--color-gold)]">{entry.standingPoints}</td>
                <td className="px-4 py-3">{entry.qualificationStatus}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
