import { notFound } from "next/navigation";

import { SectionTitle } from "@/components/section-title";
import { Card } from "@/components/ui/card";
import { getAllTournaments } from "@/lib/data";

export default async function TournamentSettingsPage({
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
      <SectionTitle eyebrow="Tournament settings" title={`${tournament.name} settings`} description="This page holds status changes, rules, archive controls, and destructive actions that should always require confirmation." />
      <div className="mt-8 grid gap-5 md:grid-cols-2">
        <Card>
          <h2 className="font-display text-2xl text-white">Status</h2>
          <p className="mt-4 text-[var(--color-mist)]">Current status: {tournament.status.replace("_", " ")}</p>
          <button className="mt-5 rounded-full bg-[var(--color-gold)] px-5 py-3 font-semibold text-[var(--color-ink)]">Update status</button>
        </Card>
        <Card>
          <h2 className="font-display text-2xl text-white">Danger zone</h2>
          <p className="mt-4 text-[var(--color-mist)]">Deleting a tournament should remove related categories, matches, awards, and activity logs only after explicit confirmation.</p>
          <button className="mt-5 rounded-full border border-[var(--color-accent)]/60 px-5 py-3 font-semibold text-[var(--color-accent)]">Delete tournament</button>
        </Card>
      </div>
    </div>
  );
}
