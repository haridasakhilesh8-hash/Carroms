import { notFound } from "next/navigation";

import { SectionTitle } from "@/components/section-title";
import { Card } from "@/components/ui/card";
import { getAllTournaments, getTeamsForTournament } from "@/lib/data";

export default async function ManageTeamsPage({
  params
}: {
  params: Promise<{ tournamentId: string }>;
}) {
  const { tournamentId } = await params;
  const tournament = getAllTournaments().find((item) => item.id === tournamentId);

  if (!tournament) {
    notFound();
  }

  const tournamentTeams = getTeamsForTournament(tournamentId);

  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
      <SectionTitle eyebrow="Manage doubles teams" title={`${tournament.name} teams`} description="This module enforces the exactly-two-players rule and keeps a player from joining multiple doubles teams in one category." />
      <Card className="mt-8">
        <div className="grid gap-4 md:grid-cols-3">
          <input className="rounded-2xl border border-white/10 bg-black/10 px-4 py-3 text-white outline-none" placeholder="Team name" />
          <input className="rounded-2xl border border-white/10 bg-black/10 px-4 py-3 text-white outline-none" placeholder="Player 1" />
          <input className="rounded-2xl border border-white/10 bg-black/10 px-4 py-3 text-white outline-none" placeholder="Player 2" />
        </div>
        <button className="mt-4 rounded-full bg-[var(--color-gold)] px-5 py-3 font-semibold text-[var(--color-ink)]">Create team</button>
      </Card>
      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {tournamentTeams.map((team) => (
          <Card key={team.id}>
            <h2 className="font-display text-2xl text-white">{team.name}</h2>
            <p className="mt-3 text-[var(--color-mist)]">{team.players.join(" • ")}</p>
            <p className="mt-2 text-sm text-[var(--color-sand)]">
              {team.stats.wins} wins • {team.stats.losses} losses
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}
