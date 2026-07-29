import type { Match, Player, RankingEntry, Team, Tournament } from "@/lib/types";

export const players: Player[] = [
  {
    id: "p1",
    slug: "akhilesh-haridas",
    fullName: "Akhilesh Haridas",
    displayName: "Akhilesh",
    city: "Hyderabad",
    organization: "Nizampet Heights",
    skillLevel: "Advanced",
    imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&q=80",
    overall: {
      tournamentsPlayed: 8,
      matchesPlayed: 31,
      matchesWon: 23,
      matchesLost: 8,
      winPercentage: 74,
      titles: 2,
      runnerUpFinishes: 1,
      currentStreak: 4,
      bestStreak: 7,
      recentForm: ["W", "W", "L", "W", "W"]
    },
    singles: {
      matchesPlayed: 18,
      wins: 13,
      losses: 5,
      titles: 1,
      highestFinish: "Champion"
    },
    doubles: {
      matchesPlayed: 13,
      wins: 10,
      losses: 3,
      titles: 1,
      bestPartner: "Rahul Verma",
      partners: ["Rahul Verma", "Kiran Kumar"]
    }
  },
  {
    id: "p2",
    slug: "rahul-verma",
    fullName: "Rahul Verma",
    displayName: "Rahul",
    city: "Hyderabad",
    organization: "Ace Carrom Club",
    skillLevel: "Advanced",
    imageUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=500&q=80",
    overall: {
      tournamentsPlayed: 9,
      matchesPlayed: 33,
      matchesWon: 24,
      matchesLost: 9,
      winPercentage: 73,
      titles: 2,
      runnerUpFinishes: 2,
      currentStreak: 2,
      bestStreak: 6,
      recentForm: ["W", "L", "W", "W", "W"]
    },
    singles: {
      matchesPlayed: 17,
      wins: 11,
      losses: 6,
      titles: 0,
      highestFinish: "Runner-up"
    },
    doubles: {
      matchesPlayed: 16,
      wins: 13,
      losses: 3,
      titles: 2,
      bestPartner: "Akhilesh Haridas",
      partners: ["Akhilesh Haridas", "Nikhil Rao"]
    }
  },
  {
    id: "p3",
    slug: "priya-reddy",
    fullName: "Priya Reddy",
    displayName: "Priya",
    city: "Secunderabad",
    organization: "Urban Strikers",
    skillLevel: "Intermediate",
    imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=500&q=80",
    overall: {
      tournamentsPlayed: 7,
      matchesPlayed: 22,
      matchesWon: 14,
      matchesLost: 8,
      winPercentage: 64,
      titles: 1,
      runnerUpFinishes: 1,
      currentStreak: 1,
      bestStreak: 5,
      recentForm: ["L", "W", "W", "L", "W"]
    },
    singles: {
      matchesPlayed: 15,
      wins: 9,
      losses: 6,
      titles: 1,
      highestFinish: "Champion"
    },
    doubles: {
      matchesPlayed: 7,
      wins: 5,
      losses: 2,
      titles: 0,
      bestPartner: "Nikhil Rao",
      partners: ["Nikhil Rao", "Meghana Das"]
    }
  },
  {
    id: "p4",
    slug: "nikhil-rao",
    fullName: "Nikhil Rao",
    displayName: "Nikhil",
    city: "Hyderabad",
    organization: "Office League",
    skillLevel: "Intermediate",
    imageUrl: "https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=500&q=80",
    overall: {
      tournamentsPlayed: 6,
      matchesPlayed: 19,
      matchesWon: 11,
      matchesLost: 8,
      winPercentage: 58,
      titles: 0,
      runnerUpFinishes: 1,
      currentStreak: 0,
      bestStreak: 4,
      recentForm: ["L", "L", "W", "W", "L"]
    },
    singles: {
      matchesPlayed: 9,
      wins: 5,
      losses: 4,
      titles: 0,
      highestFinish: "Semifinalist"
    },
    doubles: {
      matchesPlayed: 10,
      wins: 6,
      losses: 4,
      titles: 0,
      bestPartner: "Priya Reddy",
      partners: ["Priya Reddy", "Rahul Verma"]
    }
  }
];

export const teams: Team[] = [
  {
    id: "t1",
    slug: "coin-masters",
    tournamentId: "tour-1",
    category: "doubles",
    name: "Coin Masters",
    players: ["Akhilesh Haridas", "Rahul Verma"],
    stats: {
      matchesPlayed: 3,
      wins: 3,
      losses: 0
    }
  },
  {
    id: "t2",
    slug: "pocket-kings",
    tournamentId: "tour-1",
    category: "doubles",
    name: "Pocket Kings",
    players: ["Priya Reddy", "Nikhil Rao"],
    stats: {
      matchesPlayed: 3,
      wins: 2,
      losses: 1
    }
  }
];

export const matches: Match[] = [
  {
    id: "m1",
    tournamentId: "tour-1",
    category: "singles",
    round: "Semifinal",
    matchNumber: 1,
    sideAName: "Akhilesh Haridas",
    sideBName: "Priya Reddy",
    scheduledAt: "2026-07-22T10:00:00+05:30",
    board: "Board 1",
    status: "completed",
    bestOf: 3,
    resultType: "normal",
    games: [
      { gameNumber: 1, sideAScore: 25, sideBScore: 18 },
      { gameNumber: 2, sideAScore: 20, sideBScore: 25 },
      { gameNumber: 3, sideAScore: 25, sideBScore: 17 }
    ],
    winnerName: "Akhilesh Haridas"
  },
  {
    id: "m2",
    tournamentId: "tour-1",
    category: "singles",
    round: "Semifinal",
    matchNumber: 2,
    sideAName: "Rahul Verma",
    sideBName: "Nikhil Rao",
    scheduledAt: "2026-07-22T11:15:00+05:30",
    board: "Board 2",
    status: "completed",
    bestOf: 3,
    resultType: "normal",
    games: [
      { gameNumber: 1, sideAScore: 25, sideBScore: 12 },
      { gameNumber: 2, sideAScore: 19, sideBScore: 25 },
      { gameNumber: 3, sideAScore: 25, sideBScore: 22 }
    ],
    winnerName: "Rahul Verma"
  },
  {
    id: "m3",
    tournamentId: "tour-1",
    category: "doubles",
    round: "Final",
    matchNumber: 3,
    sideAName: "Coin Masters",
    sideBName: "Pocket Kings",
    scheduledAt: "2026-07-22T17:30:00+05:30",
    board: "Board 1",
    status: "completed",
    bestOf: 3,
    resultType: "normal",
    games: [
      { gameNumber: 1, sideAScore: 25, sideBScore: 19 },
      { gameNumber: 2, sideAScore: 24, sideBScore: 25 },
      { gameNumber: 3, sideAScore: 25, sideBScore: 21 }
    ],
    winnerName: "Coin Masters"
  },
  {
    id: "m4",
    tournamentId: "tour-2",
    category: "singles",
    round: "League Round 4",
    matchNumber: 7,
    sideAName: "Priya Reddy",
    sideBName: "Rahul Verma",
    scheduledAt: "2026-08-03T18:30:00+05:30",
    board: "Board 3",
    status: "scheduled",
    bestOf: 1,
    games: []
  }
];

export const tournaments: Tournament[] = [
  {
    id: "tour-1",
    slug: "nizampet-carrom-championship-2026",
    name: "Nizampet Carrom Championship 2026",
    location: "Nizampet, Hyderabad",
    organizerName: "Akhilesh Sports Committee",
    description:
      "A premium neighborhood carrom event featuring singles and doubles competition with live standings, public fixtures, and player statistics.",
    startDate: "2026-07-22",
    endDate: "2026-07-24",
    registrationClosesOn: "2026-07-20",
    status: "ongoing",
    visibility: "public",
    format: "knockout",
    categories: ["singles", "doubles"],
    bestOf: 3,
    players: ["p1", "p2", "p3", "p4"],
    teams: ["t1", "t2"],
    winners: {
      doublesWinner: "Coin Masters",
      doublesRunnerUp: "Pocket Kings"
    },
    stats: {
      totalMatches: 8,
      completedMatches: 3,
      pendingMatches: 5,
      currentRound: "Singles Final",
      bestPerformer: "Akhilesh Haridas"
    },
    standings: {},
    notes: [
      "Manual fixtures enabled for last-minute player availability changes.",
      "Organizer can reopen completed results with audit logging."
    ]
  },
  {
    id: "tour-2",
    slug: "metro-office-carrom-league-2026",
    name: "Metro Office Carrom League 2026",
    location: "HITEC City, Hyderabad",
    organizerName: "Metro Recreation Club",
    description:
      "An office league built around round-robin singles play with transparent standings and a public rankings board.",
    startDate: "2026-08-02",
    endDate: "2026-08-08",
    registrationClosesOn: "2026-07-28",
    status: "upcoming",
    visibility: "public",
    format: "round_robin",
    categories: ["singles"],
    bestOf: 1,
    players: ["p1", "p2", "p3", "p4"],
    teams: [],
    winners: {},
    stats: {
      totalMatches: 12,
      completedMatches: 0,
      pendingMatches: 12,
      currentRound: "League Round 1",
      bestPerformer: "TBD"
    },
    standings: {
      singles: [
        {
          name: "Rahul Verma",
          played: 3,
          wins: 3,
          losses: 0,
          gamesWon: 3,
          gamesLost: 0,
          pointsScored: 75,
          pointsConceded: 49,
          standingPoints: 9,
          qualificationStatus: "Leading",
          tieBreakNote: "Most match wins"
        },
        {
          name: "Priya Reddy",
          played: 3,
          wins: 2,
          losses: 1,
          gamesWon: 2,
          gamesLost: 1,
          pointsScored: 67,
          pointsConceded: 58,
          standingPoints: 6,
          qualificationStatus: "In contention"
        }
      ]
    },
    notes: [
      "Standings use wins, head-to-head, then point difference as tie-breakers."
    ]
  }
];

export const rankings: RankingEntry[] = [
  { playerId: "p1", playerName: "Akhilesh Haridas", points: 49, wins: 23, titles: 2, category: "overall" },
  { playerId: "p2", playerName: "Rahul Verma", points: 47, wins: 24, titles: 2, category: "overall" },
  { playerId: "p3", playerName: "Priya Reddy", points: 31, wins: 14, titles: 1, category: "overall" },
  { playerId: "p4", playerName: "Nikhil Rao", points: 24, wins: 11, titles: 0, category: "overall" },
  { playerId: "p1", playerName: "Akhilesh Haridas", points: 28, wins: 13, titles: 1, category: "singles" },
  { playerId: "p2", playerName: "Rahul Verma", points: 24, wins: 11, titles: 0, category: "singles" },
  { playerId: "p2", playerName: "Rahul Verma", points: 23, wins: 13, titles: 2, category: "doubles" },
  { playerId: "p1", playerName: "Akhilesh Haridas", points: 21, wins: 10, titles: 1, category: "doubles" }
];
