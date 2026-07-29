export type TournamentFormat = "knockout" | "round_robin" | "group_knockout";
export type TournamentStatus =
  | "draft"
  | "registration_open"
  | "upcoming"
  | "ongoing"
  | "completed"
  | "cancelled";
export type CategoryType = "singles" | "doubles";
export type MatchStatus =
  | "scheduled"
  | "live"
  | "completed"
  | "postponed"
  | "cancelled"
  | "abandoned";
export type ResultType =
  | "normal"
  | "walkover"
  | "player_withdrawal"
  | "team_withdrawal"
  | "disqualification"
  | "cancelled"
  | "abandoned";

export type Player = {
  id: string;
  slug: string;
  fullName: string;
  displayName: string;
  city?: string;
  organization?: string;
  skillLevel: "Beginner" | "Intermediate" | "Advanced" | "Professional";
  imageUrl?: string;
  overall: {
    tournamentsPlayed: number;
    matchesPlayed: number;
    matchesWon: number;
    matchesLost: number;
    winPercentage: number;
    titles: number;
    runnerUpFinishes: number;
    currentStreak: number;
    bestStreak: number;
    recentForm: Array<"W" | "L">;
  };
  singles: {
    matchesPlayed: number;
    wins: number;
    losses: number;
    titles: number;
    highestFinish: string;
  };
  doubles: {
    matchesPlayed: number;
    wins: number;
    losses: number;
    titles: number;
    bestPartner: string;
    partners: string[];
  };
};

export type Team = {
  id: string;
  slug: string;
  tournamentId: string;
  category: CategoryType;
  name: string;
  players: string[];
  stats: {
    matchesPlayed: number;
    wins: number;
    losses: number;
  };
};

export type MatchGame = {
  gameNumber: number;
  sideAScore: number;
  sideBScore: number;
};

export type Match = {
  id: string;
  tournamentId: string;
  category: CategoryType;
  round: string;
  matchNumber: number;
  sideAName: string;
  sideBName: string;
  scheduledAt: string;
  board: string;
  status: MatchStatus;
  bestOf: number;
  resultType?: ResultType;
  games: MatchGame[];
  winnerName?: string;
};

export type Standing = {
  name: string;
  played: number;
  wins: number;
  losses: number;
  gamesWon: number;
  gamesLost: number;
  pointsScored: number;
  pointsConceded: number;
  standingPoints: number;
  qualificationStatus: string;
  tieBreakNote?: string;
};

export type Tournament = {
  id: string;
  slug: string;
  name: string;
  location: string;
  organizerName: string;
  description: string;
  startDate: string;
  endDate: string;
  registrationClosesOn: string;
  status: TournamentStatus;
  visibility: "public" | "private";
  format: TournamentFormat;
  categories: CategoryType[];
  bestOf: number;
  players: string[];
  teams: string[];
  winners: {
    singlesWinner?: string;
    singlesRunnerUp?: string;
    doublesWinner?: string;
    doublesRunnerUp?: string;
  };
  stats: {
    totalMatches: number;
    completedMatches: number;
    pendingMatches: number;
    currentRound: string;
    bestPerformer: string;
  };
  standings: Partial<Record<CategoryType, Standing[]>>;
  notes: string[];
};

export type RankingEntry = {
  playerId: string;
  playerName: string;
  points: number;
  wins: number;
  titles: number;
  category: "overall" | CategoryType;
};
