import { notFound } from "next/navigation";

import { SectionTitle } from "@/components/section-title";
import { StandingsTable } from "@/components/standings-table";
import { Card } from "@/components/ui/card";
import { getTournamentBySlug } from "@/lib/data";

export default async function TournamentStandingsPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tournament = getTournamentBySlug(slug);

  if (!tournament) {
    notFound();
  }

  const singlesStandings = tournament.standings.singles ?? [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <SectionTitle eyebrow="Standings" title={`${tournament.name} standings`} description="Round-robin standings use transparent tie-breakers and remain easy to read on phones." />
      <div className="mt-8">
        {singlesStandings.length ? (
          <StandingsTable standings={singlesStandings} />
        ) : (
          <Card>
            <p className="text-[var(--color-mist)]">This tournament currently uses a knockout flow, so standings are not active.</p>
          </Card>
        )}
      </div>
    </div>
  );
}
