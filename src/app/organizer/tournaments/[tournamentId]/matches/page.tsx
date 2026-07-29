import { notFound } from "next/navigation";

import { MatchList } from "@/components/match-list";
import { SectionTitle } from "@/components/section-title";
import { Card } from "@/components/ui/card";
import { getAllTournaments, getMatchesForTournament } from "@/lib/data";

export default async function ManageMatchesPage({
  params
}: {
  params: Promise<{ tournamentId: string }>;
}) {
  const { tournamentId } = await params;
  const tournament = getAllTournaments().find((item) => item.id === tournamentId);

  if (!tournament) {
    notFound();
  }

  const tournamentMatches = getMatchesForTournament(tournamentId);

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <SectionTitle eyebrow="Manage matches" title={`${tournament.name} fixtures`} description="Phase 1 supports manual match creation while keeping the shape ready for automatic fixture generation later." />
      <Card className="mt-8">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {["Category", "Round", "Side A", "Side B", "Date & time", "Board", "Best of", "Status"].map((field) => (
            <input key={field} className="rounded-2xl border border-white/10 bg-black/10 px-4 py-3 text-white outline-none" placeholder={field} />
          ))}
        </div>
        <button className="mt-4 rounded-full bg-[var(--color-gold)] px-5 py-3 font-semibold text-[var(--color-ink)]">Create match</button>
      </Card>
      <div className="mt-8">
        <MatchList matches={tournamentMatches} />
      </div>
    </div>
  );
}
