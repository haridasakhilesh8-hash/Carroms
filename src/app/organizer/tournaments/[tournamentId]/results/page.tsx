import { notFound } from "next/navigation";

import { MatchList } from "@/components/match-list";
import { SectionTitle } from "@/components/section-title";
import { Card } from "@/components/ui/card";
import { getAllTournaments, getMatchesForTournament } from "@/lib/data";

export default async function ManageResultsPage({
  params
}: {
  params: Promise<{ tournamentId: string }>;
}) {
  const { tournamentId } = await params;
  const tournament = getAllTournaments().find((item) => item.id === tournamentId);

  if (!tournament) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <SectionTitle eyebrow="Enter results" title={`${tournament.name} result entry`} description="The MVP result-entry experience is optimized for touch use, quick score entry, and later corrections with recalculation." />
      <Card className="mt-8">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {["Match number", "Game 1", "Game 2", "Game 3", "Winner", "Result type", "Status", "Notes"].map((field) => (
            <input key={field} className="rounded-2xl border border-white/10 bg-black/10 px-4 py-3 text-white outline-none" placeholder={field} />
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <button className="rounded-full bg-[var(--color-gold)] px-5 py-3 font-semibold text-[var(--color-ink)]">Confirm result</button>
          <button className="rounded-full border border-white/15 px-5 py-3 text-white">Reopen completed match</button>
        </div>
      </Card>
      <div className="mt-8">
        <MatchList matches={getMatchesForTournament(tournamentId)} />
      </div>
    </div>
  );
}
