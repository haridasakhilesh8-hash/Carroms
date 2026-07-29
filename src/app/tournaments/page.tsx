import { SectionTitle } from "@/components/section-title";
import { TournamentCard } from "@/components/tournament-card";
import { getAllTournaments } from "@/lib/data";

export default function TournamentsPage() {
  const tournaments = getAllTournaments();

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <SectionTitle
        eyebrow="Tournament directory"
        title="Browse public tournaments"
        description="Public tournaments can be shared with players and viewers through clean slug-based URLs."
      />
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {tournaments.map((tournament) => (
          <TournamentCard key={tournament.id} tournament={tournament} />
        ))}
      </div>
    </div>
  );
}
