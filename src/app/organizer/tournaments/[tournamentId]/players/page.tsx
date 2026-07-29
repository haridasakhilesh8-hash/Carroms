import { notFound } from "next/navigation";

import { PlayerCard } from "@/components/player-card";
import { SectionTitle } from "@/components/section-title";
import { Card } from "@/components/ui/card";
import { getAllPlayers, getAllTournaments } from "@/lib/data";

export default async function ManagePlayersPage({
  params
}: {
  params: Promise<{ tournamentId: string }>;
}) {
  const { tournamentId } = await params;
  const tournament = getAllTournaments().find((item) => item.id === tournamentId);

  if (!tournament) {
    notFound();
  }

  const tournamentPlayers = getAllPlayers().filter((player) => tournament.players.includes(player.id));

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <SectionTitle eyebrow="Manage players" title={`${tournament.name} players`} description="Duplicate prevention, skill-level tracking, and tournament status live in this module." />
      <Card className="mt-8">
        <div className="grid gap-4 md:grid-cols-3">
          {["Full name", "Display name", "City"].map((label) => (
            <input key={label} className="rounded-2xl border border-white/10 bg-black/10 px-4 py-3 text-white outline-none" placeholder={label} />
          ))}
        </div>
        <button className="mt-4 rounded-full bg-[var(--color-gold)] px-5 py-3 font-semibold text-[var(--color-ink)]">Add player</button>
      </Card>
      <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {tournamentPlayers.map((player) => (
          <PlayerCard key={player.id} player={player} />
        ))}
      </div>
    </div>
  );
}
