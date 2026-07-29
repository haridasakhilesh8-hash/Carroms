import { format } from "date-fns";

import { Card } from "@/components/ui/card";
import type { Match } from "@/lib/types";

export function MatchList({ matches }: { matches: Match[] }) {
  return (
    <div className="space-y-4">
      {matches.map((match) => (
        <Card key={match.id} className="p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-gold)]">
                {match.category} • {match.round} • Match {match.matchNumber}
              </p>
              <h3 className="mt-2 text-xl font-semibold text-white">
                {match.sideAName} vs {match.sideBName}
              </h3>
              <p className="mt-2 text-sm text-[var(--color-mist)]">
                {format(new Date(match.scheduledAt), "dd MMM yyyy, hh:mm a")} • {match.board}
              </p>
            </div>
            <div className="text-sm text-[var(--color-sand)] md:text-right">
              <p className="font-semibold uppercase tracking-[0.18em]">{match.status}</p>
              <p className="mt-1">Best of {match.bestOf}</p>
              {match.winnerName ? <p className="mt-1 text-white">Winner: {match.winnerName}</p> : null}
            </div>
          </div>
          {match.games.length ? (
            <div className="mt-4 grid gap-2 text-sm text-[var(--color-mist)] sm:grid-cols-3">
              {match.games.map((game) => (
                <div key={game.gameNumber} className="rounded-2xl border border-white/10 bg-black/10 px-4 py-3">
                  Game {game.gameNumber}: {game.sideAScore} - {game.sideBScore}
                </div>
              ))}
            </div>
          ) : null}
        </Card>
      ))}
    </div>
  );
}
