import { notFound } from "next/navigation";

import { MatchList } from "@/components/match-list";
import { SectionTitle } from "@/components/section-title";
import { getMatchesForTournament, getTournamentBySlug } from "@/lib/data";

export default async function TournamentResultsPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tournament = getTournamentBySlug(slug);

  if (!tournament) {
    notFound();
  }

  const completed = getMatchesForTournament(tournament.id).filter((match) => match.status === "completed");

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <SectionTitle eyebrow="Results" title={`${tournament.name} results`} description="Completed scorelines clearly show best-of format, match winner, and board-level scoring." />
      <div className="mt-8">
        <MatchList matches={completed} />
      </div>
    </div>
  );
}
