import Link from "next/link";
import { notFound } from "next/navigation";

import { SectionTitle } from "@/components/section-title";
import { StatCard } from "@/components/stat-card";
import { Card } from "@/components/ui/card";
import { getAllTournaments } from "@/lib/data";

export default async function OrganizerTournamentPage({
  params
}: {
  params: Promise<{ tournamentId: string }>;
}) {
  const { tournamentId } = await params;
  const tournament = getAllTournaments().find((item) => item.id === tournamentId);

  if (!tournament) {
    notFound();
  }

  const links = [
    { href: `/organizer/tournaments/${tournamentId}/players`, label: "Manage players" },
    { href: `/organizer/tournaments/${tournamentId}/teams`, label: "Manage teams" },
    { href: `/organizer/tournaments/${tournamentId}/matches`, label: "Manage matches" },
    { href: `/organizer/tournaments/${tournamentId}/results`, label: "Enter results" },
    { href: `/organizer/tournaments/${tournamentId}/publish`, label: "Publish" },
    { href: `/organizer/tournaments/${tournamentId}/settings`, label: "Settings" }
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <SectionTitle eyebrow="Tournament dashboard" title={tournament.name} description={tournament.description} />
      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Status" value={tournament.status.replace("_", " ")} />
        <StatCard label="Players" value={tournament.players.length} />
        <StatCard label="Matches completed" value={tournament.stats.completedMatches} />
        <StatCard label="Matches remaining" value={tournament.stats.pendingMatches} />
      </div>
      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {links.map((link) => (
          <Link key={link.href} href={link.href}>
            <Card className="h-full transition hover:bg-white/7">
              <h2 className="font-display text-2xl text-white">{link.label}</h2>
              <p className="mt-3 text-sm text-[var(--color-mist)]">Open the module and continue the tournament workflow.</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
