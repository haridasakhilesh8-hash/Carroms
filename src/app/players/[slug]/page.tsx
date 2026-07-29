import Image from "next/image";
import { notFound } from "next/navigation";

import { MatchList } from "@/components/match-list";
import { SectionTitle } from "@/components/section-title";
import { StatCard } from "@/components/stat-card";
import { Card } from "@/components/ui/card";
import { getAllTournaments, getMatchesForTournament, getPlayerBySlug } from "@/lib/data";

export default async function PlayerProfilePage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const player = getPlayerBySlug(slug);

  if (!player) {
    notFound();
  }

  const playerTournaments = getAllTournaments().filter((tournament) => tournament.players.includes(player.id));
  const playerMatches = playerTournaments.flatMap((tournament) =>
    getMatchesForTournament(tournament.id).filter(
      (match) => match.sideAName === player.fullName || match.sideBName === player.fullName
    )
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <Card className="h-fit">
          <div className="flex items-center gap-4">
            <div className="relative h-20 w-20 overflow-hidden rounded-3xl">
              <Image src={player.imageUrl ?? "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&q=80"} alt={player.fullName} fill className="object-cover" />
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-[var(--color-gold)]">{player.skillLevel}</p>
              <h1 className="mt-2 font-display text-3xl text-white">{player.fullName}</h1>
              <p className="text-[var(--color-mist)]">{player.city} • {player.organization}</p>
            </div>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <StatCard label="Matches won" value={player.overall.matchesWon} />
            <StatCard label="Win percentage" value={`${player.overall.winPercentage}%`} />
            <StatCard label="Titles" value={player.overall.titles} />
            <StatCard label="Best streak" value={player.overall.bestStreak} />
          </div>
          <div className="mt-6 rounded-2xl border border-white/10 bg-black/10 p-4">
            <p className="text-sm text-[var(--color-mist)]">Recent form</p>
            <div className="mt-3 flex gap-2">
              {player.overall.recentForm.map((result, index) => (
                <span key={`${result}-${index}`} className="grid h-10 w-10 place-items-center rounded-full bg-white/8 text-sm font-semibold text-white">
                  {result}
                </span>
              ))}
            </div>
          </div>
        </Card>
        <div className="space-y-8">
          <SectionTitle eyebrow="Player profile" title={`${player.displayName}'s tournament record`} description="This public profile is ready for WhatsApp sharing and can grow into deeper head-to-head views later." />
          <div className="grid gap-5 md:grid-cols-2">
            <Card>
              <h2 className="font-display text-2xl text-white">Singles</h2>
              <p className="mt-4 text-[var(--color-mist)]">
                {player.singles.wins} wins, {player.singles.losses} losses, {player.singles.titles} titles.
              </p>
              <p className="mt-2 text-sm text-[var(--color-sand)]">Highest finish: {player.singles.highestFinish}</p>
            </Card>
            <Card>
              <h2 className="font-display text-2xl text-white">Doubles</h2>
              <p className="mt-4 text-[var(--color-mist)]">
                {player.doubles.wins} wins, {player.doubles.losses} losses, {player.doubles.titles} titles.
              </p>
              <p className="mt-2 text-sm text-[var(--color-sand)]">Best partner: {player.doubles.bestPartner}</p>
            </Card>
          </div>
          <Card>
            <h2 className="font-display text-2xl text-white">Tournaments participated</h2>
            <div className="mt-4 grid gap-3">
              {playerTournaments.map((tournament) => (
                <div key={tournament.id} className="rounded-2xl border border-white/10 px-4 py-3 text-sm text-[var(--color-mist)]">
                  {tournament.name} • {tournament.location}
                </div>
              ))}
            </div>
          </Card>
          <MatchList matches={playerMatches} />
        </div>
      </div>
    </div>
  );
}
