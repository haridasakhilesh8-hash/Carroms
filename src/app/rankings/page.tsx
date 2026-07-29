import { SectionTitle } from "@/components/section-title";
import { Card } from "@/components/ui/card";
import { getRankings } from "@/lib/data";

export default function RankingsPage() {
  const overall = getRankings("overall");
  const singles = getRankings("singles");
  const doubles = getRankings("doubles");
  const rankingSections = [
    { label: "Overall", entries: overall },
    { label: "Singles", entries: singles },
    { label: "Doubles", entries: doubles }
  ] as const;

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <SectionTitle
        eyebrow="Rankings"
        title="Transparent points-based rankings"
        description="The MVP uses configurable points so organizers can understand exactly how a player climbed the table."
      />
      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {rankingSections.map(({ label, entries }) => (
          <Card key={label}>
            <h2 className="font-display text-2xl text-white">{label}</h2>
            <div className="mt-5 space-y-3">
              {entries.map((entry, index) => (
                <div key={`${entry.playerId}-${entry.category}`} className="flex items-center justify-between rounded-2xl border border-white/10 px-4 py-3">
                  <div>
                    <p className="text-sm text-[var(--color-mist)]">#{index + 1}</p>
                    <p className="font-semibold text-white">{entry.playerName}</p>
                  </div>
                  <div className="text-right text-sm text-[var(--color-sand)]">
                    <p>{entry.points} pts</p>
                    <p>{entry.wins} wins</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
