import { matches, players, rankings, teams, tournaments } from "@/lib/demo-data";
import type { Match, Player, RankingEntry, Team, Tournament } from "@/lib/types";

export function getAllTournaments(): Tournament[] {
  return tournaments;
}

export function getTournamentBySlug(slug: string): Tournament | undefined {
  return tournaments.find((tournament) => tournament.slug === slug);
}

export function getMatchesForTournament(tournamentId: string, category?: "singles" | "doubles"): Match[] {
  return matches.filter((match) => match.tournamentId === tournamentId && (!category || match.category === category));
}

export function getAllPlayers(): Player[] {
  return players;
}

export function getPlayerBySlug(slug: string): Player | undefined {
  return players.find((player) => player.slug === slug);
}

export function getTeamsForTournament(tournamentId: string): Team[] {
  return teams.filter((team) => team.tournamentId === tournamentId);
}

export function getRankings(category: RankingEntry["category"] = "overall"): RankingEntry[] {
  return rankings.filter((ranking) => ranking.category === category);
}

export function getOrganizerDashboard() {
  const totalTournaments = tournaments.length;
  const activeTournaments = tournaments.filter((tournament) => tournament.status === "ongoing").length;
  const completedTournaments = tournaments.filter((tournament) => tournament.status === "completed").length;
  const totalRegisteredPlayers = new Set(tournaments.flatMap((tournament) => tournament.players)).size;
  const matchesScheduledToday = matches.filter((match) => match.status === "scheduled").length;
  const matchesCompleted = matches.filter((match) => match.status === "completed").length;

  return {
    totalTournaments,
    activeTournaments,
    completedTournaments,
    totalRegisteredPlayers,
    matchesScheduledToday,
    matchesCompleted,
    pendingResultEntries: matches.filter((match) => match.status !== "completed").length,
    topPerformers: rankings.filter((entry) => entry.category === "overall").slice(0, 3),
    recentActivity: [
      "Akhilesh entered the doubles final result for Nizampet Carrom Championship.",
      "Metro Office Carrom League moved to registration open.",
      "Two new players were added to Nizampet Carrom Championship."
    ]
  };
}
