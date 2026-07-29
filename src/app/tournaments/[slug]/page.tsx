import Link from "next/link";
import { notFound } from "next/navigation";

import { MatchList } from "@/components/match-list";
import { SectionTitle } from "@/components/section-title";
import { StatCard } from "@/components/stat-card";
import { Card } from "@/components/ui/card";
import { getMatchesForTournament, getTeamsForTournament, getTournamentBySlug } from "@/lib/data";

export default async function TournamentDetailPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tournament = getTournamentBySlug(slug);

  if (!tournament) {
    notFound();
  }

  const tournamentMatches = getMatchesForTournament(tournament.id);
  const tournamentTeams = getTeamsForTournament(tournament.id);

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <SectionTitle eyebrow="Public tournament page" title={tournament.name} description={tournament.description} />
      <div className="mt-8 grid gap-4 md:grid-cols-4">
        <StatCard label="Status" value={tournament.status.replace("_", " ")} />
        <StatCard label="Players" value={tournament.players.length} />
        <StatCard label="Teams" value={tournamentTeams.length} />
        <StatCard label="Current round" value={tournament.stats.currentRound} />
      </div>
      <div className="mt-8 flex flex-wrap gap-3">
        {["fixtures", "results", "standings", "bracket"].map((tab) => (
          <Link key={tab} href={`/tournaments/${tournament.slug}/${tab}`} className="rounded-full border border-white/15 px-4 py-2 text-sm text-white">
            {tab}
          </Link>
        ))}
      </div>
      <div className="mt-10 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <Card>
            <h3 className="font-display text-2xl text-white">Overview</h3>
            <p className="mt-4 text-[var(--color-mist)]">
              Organizer: {tournament.organizerName} • {tournament.location} • {tournament.startDate} to {tournament.endDate}
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              {tournament.categories.map((category) => (
                <span key={category} className="rounded-full bg-white/8 px-4 py-2 text-sm text-[var(--color-sand)]">
                  {category}
                </span>
              ))}
            </div>
            <div className="mt-6 space-y-3">
              {tournament.notes.map((note) => (
                <div key={note} className="rounded-2xl border border-white/10 bg-black/10 px-4 py-3 text-sm text-[var(--color-mist)]">
                  {note}
                </div>
              ))}
            </div>
          </Card>
          <div className="mt-8">
            <MatchList matches={tournamentMatches.slice(0, 4)} />
          </div>
        </div>
        <div className="space-y-6">
          <Card>
            <h3 className="font-display text-2xl text-white">Winners</h3>
            <div className="mt-5 space-y-3 text-sm text-[var(--color-mist)]">
              <p>Singles winner: {tournament.winners.singlesWinner ?? "To be decided"}</p>
              <p>Singles runner-up: {tournament.winners.singlesRunnerUp ?? "To be decided"}</p>
              <p>Doubles winner: {tournament.winners.doublesWinner ?? "To be decided"}</p>
              <p>Doubles runner-up: {tournament.winners.doublesRunnerUp ?? "To be decided"}</p>
            </div>
          </Card>
          <Card>
            <h3 className="font-display text-2xl text-white">Tournament summary</h3>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <StatCard label="Total matches" value={tournament.stats.totalMatches} />
              <StatCard label="Completed" value={tournament.stats.completedMatches} />
              <StatCard label="Remaining" value={tournament.stats.pendingMatches} />
              <StatCard label="Best performer" value={tournament.stats.bestPerformer} />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
