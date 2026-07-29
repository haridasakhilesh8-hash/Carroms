import Link from "next/link";

import { SectionTitle } from "@/components/section-title";
import { StatCard } from "@/components/stat-card";
import { Card } from "@/components/ui/card";
import { getAllTournaments, getOrganizerDashboard } from "@/lib/data";

export default function OrganizerDashboardPage() {
  const dashboard = getOrganizerDashboard();
  const tournaments = getAllTournaments();

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <SectionTitle eyebrow="Organizer dashboard" title="Operations at a glance" description="This dashboard surfaces the action list an organizer needs before and during a tournament day." />
      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total tournaments" value={dashboard.totalTournaments} />
        <StatCard label="Active tournaments" value={dashboard.activeTournaments} />
        <StatCard label="Registered players" value={dashboard.totalRegisteredPlayers} />
        <StatCard label="Pending result entries" value={dashboard.pendingResultEntries} />
      </div>
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_0.9fr]">
        <Card>
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl text-white">Managed tournaments</h2>
            <Link href="/organizer/tournaments/new" className="text-sm font-semibold text-[var(--color-gold)]">
              Quick create
            </Link>
          </div>
          <div className="mt-5 space-y-3">
            {tournaments.map((tournament) => (
              <Link
                key={tournament.id}
                href={`/organizer/tournaments/${tournament.id}`}
                className="flex items-center justify-between rounded-2xl border border-white/10 px-4 py-3 transition hover:bg-white/5"
              >
                <div>
                  <p className="font-semibold text-white">{tournament.name}</p>
                  <p className="text-sm text-[var(--color-mist)]">{tournament.status.replace("_", " ")} • {tournament.location}</p>
                </div>
                <p className="text-sm text-[var(--color-sand)]">{tournament.stats.completedMatches}/{tournament.stats.totalMatches} matches</p>
              </Link>
            ))}
          </div>
        </Card>
        <div className="space-y-5">
          <Card>
            <h2 className="font-display text-2xl text-white">Recent activity</h2>
            <div className="mt-5 space-y-3">
              {dashboard.recentActivity.map((activity) => (
                <div key={activity} className="rounded-2xl border border-white/10 px-4 py-3 text-sm text-[var(--color-mist)]">
                  {activity}
                </div>
              ))}
            </div>
          </Card>
          <Card>
            <h2 className="font-display text-2xl text-white">Top-performing players</h2>
            <div className="mt-5 space-y-3">
              {dashboard.topPerformers.map((entry) => (
                <div key={entry.playerId} className="flex items-center justify-between rounded-2xl border border-white/10 px-4 py-3">
                  <p className="font-semibold text-white">{entry.playerName}</p>
                  <p className="text-sm text-[var(--color-sand)]">{entry.points} pts</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
