import { PlayerCard } from "@/components/player-card";
import { SectionTitle } from "@/components/section-title";
import { getAllPlayers } from "@/lib/data";

export default function PlayersPage() {
  const players = getAllPlayers();

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <SectionTitle eyebrow="Player directory" title="Public player profiles" description="Each profile blends overall, singles, and doubles statistics with recent form and titles." />
      <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {players.map((player) => (
          <PlayerCard key={player.id} player={player} />
        ))}
      </div>
    </div>
  );
}
