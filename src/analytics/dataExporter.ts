import type { LeaderboardEntry, LifetimeStats, PlayerProfile } from '../types/game';

export function exportAthleteDataAsJSON(
  player: PlayerProfile | null,
  stats: LifetimeStats,
  leaderboard: LeaderboardEntry[]
): string {
  const payload = {
    exportedAt: new Date().toISOString(),
    fitquestVersion: '2.0.0',
    athleteProfile: player,
    careerStats: stats,
    highScores: leaderboard,
  };
  return JSON.stringify(payload, null, 2);
}

export function exportLeaderboardAsCSV(leaderboard: LeaderboardEntry[]): string {
  const header = 'Rank,Player,Score,BMIDelta,HealthyChoices,JunkChoices,DistanceMeters,Grade,Date,Level\\n';
  const rows = leaderboard.map((e, i) => {
    return [
      i + 1,
      '"' + e.playerName + '"',
      e.score,
      e.bmiImprovement,
      e.healthyChoices,
      e.junkChoices,
      e.distanceMeters,
      e.rankGrade,
      e.date,
      '"' + e.levelName + '"'
    ].join(',');
  }).join('\\n');
  return header + rows;
}
