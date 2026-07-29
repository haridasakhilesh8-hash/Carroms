import { notFound } from "next/navigation";

import { SectionTitle } from "@/components/section-title";
import { StatCard } from "@/components/stat-card";
import { Card } from "@/components/ui/card";
import { getAllTournaments } from "@/lib/data";

export default async function PublishTournamentPage({
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
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
      <SectionTitle eyebrow="Publish tournament" title={`Publish ${tournament.name}`} description="Organizers can control public visibility and validate that winners, standings, and fixtures are ready to share." />
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <StatCard label="Visibility" value={tournament.visibility} />
        <StatCard label="Published" value={tournament.visibility === "public" ? "Ready" : "Private"} />
        <StatCard label="Public URL" value={`/tournaments/${tournament.slug}`} />
      </div>
      <Card className="mt-8">
        <div className="space-y-4 text-[var(--color-mist)]">
          <p>Before publishing, confirm fixtures, results, and winners are correct.</p>
          <p>Private tournaments stay hidden from the directory and can later support invite-only access.</p>
        </div>
        <div className="mt-6 flex gap-3">
          <button className="rounded-full bg-[var(--color-gold)] px-5 py-3 font-semibold text-[var(--color-ink)]">Publish now</button>
          <button className="rounded-full border border-white/15 px-5 py-3 text-white">Unpublish</button>
        </div>
      </Card>
    </div>
  );
}
