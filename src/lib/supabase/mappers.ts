import type { Match, Tournament } from "@/lib/types";

type TournamentRow = {
  id: string;
  slug: string;
  name: string;
  location: string;
  organizer_name: string;
  description: string;
  start_date: string;
  end_date: string;
  registration_closes_on: string;
  status: Tournament["status"];
  visibility: Tournament["visibility"];
  format: Tournament["format"];
  best_of: number;
};

type MatchRow = {
  id: string;
  tournament_id: string;
  round_label: string;
  category: Match["category"];
  match_number: number;
  scheduled_at: string;
  board_number: string;
  status: Match["status"];
  best_of: number;
};

export function mapTournamentRow(row: TournamentRow): Tournament {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    location: row.location,
    organizerName: row.organizer_name,
    description: row.description,
    startDate: row.start_date,
    endDate: row.end_date,
    registrationClosesOn: row.registration_closes_on,
    status: row.status,
    visibility: row.visibility,
    format: row.format,
    categories: [],
    bestOf: row.best_of,
    players: [],
    teams: [],
    winners: {},
    stats: {
      totalMatches: 0,
      completedMatches: 0,
      pendingMatches: 0,
      currentRound: "TBD",
      bestPerformer: "TBD"
    },
    standings: {},
    notes: []
  };
}

export function mapMatchRow(row: MatchRow): Match {
  return {
    id: row.id,
    tournamentId: row.tournament_id,
    category: row.category,
    round: row.round_label,
    matchNumber: row.match_number,
    sideAName: "TBD",
    sideBName: "TBD",
    scheduledAt: row.scheduled_at,
    board: row.board_number,
    status: row.status,
    bestOf: row.best_of,
    games: []
  };
}
