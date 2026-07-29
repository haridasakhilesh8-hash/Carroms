import type { Match, Player, RankingEntry } from "@/lib/types";

export type CalculatedPlayerStatistics = {
  matchesPlayed: number;
  matchesWon: number;
  matchesLost: number;
  gamesWon: number;
  gamesLost: number;
  pointsScored: number;
  pointsConceded: number;
  winPercentage: number;
  currentStreak: number;
  longestStreak: number;
  recentForm: Array<"W" | "L">;
};

export function calculatePlayerStatistics(player: Player, allMatches: Match[]): CalculatedPlayerStatistics {
  const playerMatches = allMatches.filter(
    (match) => match.status === "completed" && (match.sideAName === player.fullName || match.sideBName === player.fullName)
  );

  let wins = 0;
  let losses = 0;
  let gamesWon = 0;
  let gamesLost = 0;
  let pointsScored = 0;
  let pointsConceded = 0;
  let currentStreak = 0;
  let longestStreak = 0;
  let activeStreak = 0;
  const recentForm: Array<"W" | "L"> = [];

  for (const match of playerMatches) {
    const isSideA = match.sideAName === player.fullName;
    const didWin = match.winnerName === player.fullName;

    if (didWin) {
      wins += 1;
      activeStreak += 1;
      currentStreak = activeStreak;
      longestStreak = Math.max(longestStreak, activeStreak);
      recentForm.push("W");
    } else {
      losses += 1;
      activeStreak = 0;
      currentStreak = 0;
      recentForm.push("L");
    }

    for (const game of match.games) {
      const selfScore = isSideA ? game.sideAScore : game.sideBScore;
      const opponentScore = isSideA ? game.sideBScore : game.sideAScore;

      pointsScored += selfScore;
      pointsConceded += opponentScore;

      if (selfScore > opponentScore) {
        gamesWon += 1;
      } else if (selfScore < opponentScore) {
        gamesLost += 1;
      }
    }
  }

  return {
    matchesPlayed: playerMatches.length,
    matchesWon: wins,
    matchesLost: losses,
    gamesWon,
    gamesLost,
    pointsScored,
    pointsConceded,
    winPercentage: playerMatches.length ? Math.round((wins / playerMatches.length) * 100) : 0,
    currentStreak,
    longestStreak,
    recentForm: recentForm.slice(-5)
  };
}

export function calculateRankingPoints(
  wins: number,
  awards: { titles: number; runnerUp: number; semifinals: number }
) {
  return wins * 3 + awards.titles * 10 + awards.runnerUp * 6 + awards.semifinals * 3;
}

export function sortRankings(entries: RankingEntry[]) {
  return [...entries].sort((a, b) => {
    if (b.points !== a.points) {
      return b.points - a.points;
    }

    if (b.wins !== a.wins) {
      return b.wins - a.wins;
    }

    return b.titles - a.titles;
  });
}
