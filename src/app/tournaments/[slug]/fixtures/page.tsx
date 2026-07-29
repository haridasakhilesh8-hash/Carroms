import { notFound } from "next/navigation";

import { MatchList } from "@/components/match-list";
import { SectionTitle } from "@/components/section-title";
import { getMatchesForTournament, getTournamentBySlug } from "@/lib/data";

export default async function TournamentFixturesPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tournament = getTournamentBySlug(slug);

  if (!tournament) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <SectionTitle eyebrow="Fixtures" title={`${tournament.name} fixtures`} description="Scheduled and completed matches stay on one mobile-friendly list in the MVP." />
      <div className="mt-8">
        <MatchList matches={getMatchesForTournament(tournament.id)} />
      </div>
    </div>
  );
}
