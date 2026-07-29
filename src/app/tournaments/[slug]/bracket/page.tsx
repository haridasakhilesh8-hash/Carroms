import { notFound } from "next/navigation";

import { SectionTitle } from "@/components/section-title";
import { Card } from "@/components/ui/card";
import { getMatchesForTournament, getTournamentBySlug } from "@/lib/data";

export default async function TournamentBracketPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tournament = getTournamentBySlug(slug);

  if (!tournament) {
    notFound();
  }

  const bracketMatches = getMatchesForTournament(tournament.id).filter((match) => match.category === "singles");

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <SectionTitle eyebrow="Bracket" title={`${tournament.name} knockout path`} description="Phase 1 includes a simple visual bracket card layout that can evolve into an interactive bracket in Phase 2." />
      <div className="mt-8 grid gap-5 lg:grid-cols-3">
        {bracketMatches.map((match) => (
          <Card key={match.id}>
            <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-gold)]">{match.round}</p>
            <div className="mt-4 space-y-3">
              <div className="rounded-2xl border border-white/10 px-4 py-3 text-white">{match.sideAName}</div>
              <div className="rounded-2xl border border-white/10 px-4 py-3 text-white">{match.sideBName}</div>
            </div>
            <p className="mt-4 text-sm text-[var(--color-mist)]">Winner: {match.winnerName ?? "Pending"}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
