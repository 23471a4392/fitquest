import type {
  Achievement,
  DailyChallenge,
  GameSettings,
  LeaderboardEntry,
  LifetimeStats,
  PlayerProfile,
} from '../types/game';
import {
  INITIAL_ACHIEVEMENTS,
  INITIAL_DAILY_CHALLENGES,
  INITIAL_LEADERBOARD,
} from '../data/gameConstants';

const STORAGE_KEYS = {
  PLAYER: 'fitquest_player_profile',
  LEADERBOARD: 'fitquest_leaderboard',
  ACHIEVEMENTS: 'fitquest_achievements',
  DAILY_CHALLENGES: 'fitquest_daily_challenges',
  DAILY_DATE: 'fitquest_daily_date',
  SETTINGS: 'fitquest_settings',
  STATS: 'fitquest_lifetime_stats',
  UNLOCKED_LEVELS: 'fitquest_unlocked_levels',
};

const DEFAULT_SETTINGS: GameSettings = {
  soundEnabled: true,
  musicEnabled: false,
  soundVolume: 0.7,
  difficulty: 'normal',
  animationsEnabled: true,
  theme: 'dark',
};

const DEFAULT_STATS: LifetimeStats = {
  totalRuns: 0,
  totalDistanceMeters: 0,
  highestScore: 0,
  totalHealthyFoods: 0,
  totalJunkFoods: 0,
  totalObstaclesHit: 0,
  totalPowerUps: 0,
  goalsCompleted: 0,
  bestBMIImprovement: 0,
};

// Safe LocalStorage read/write wrappers
function safeGet<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return fallback;
    return JSON.parse(item) as T;
  } catch (e) {
    console.warn(`FitQuest storage read failed for key ${key}:`, e);
    return fallback;
  }
}

function safeSet<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn(`FitQuest storage write failed for key ${key}:`, e);
  }
}

// Profile
export function getSavedPlayer(): PlayerProfile | null {
  return safeGet<PlayerProfile | null>(STORAGE_KEYS.PLAYER, null);
}

export function savePlayer(player: PlayerProfile): void {
  safeSet(STORAGE_KEYS.PLAYER, player);
}

// Leaderboard
export function getLeaderboard(): LeaderboardEntry[] {
  const data = safeGet<LeaderboardEntry[]>(STORAGE_KEYS.LEADERBOARD, INITIAL_LEADERBOARD);
  return data.sort((a, b) => b.score - a.score);
}

export function addLeaderboardEntry(entry: LeaderboardEntry): LeaderboardEntry[] {
  const current = getLeaderboard();
  // Prevent duplicate exact timestamp & player
  const exists = current.some((item) => item.id === entry.id);
  const updated = exists ? current : [entry, ...current];
  updated.sort((a, b) => b.score - a.score);
  // Keep top 50
  const sliced = updated.slice(0, 50);
  safeSet(STORAGE_KEYS.LEADERBOARD, sliced);
  return sliced;
}

// Achievements
export function getAchievements(): Achievement[] {
  const saved = safeGet<Achievement[]>(STORAGE_KEYS.ACHIEVEMENTS, INITIAL_ACHIEVEMENTS);
  // Merge with initial in case new ones were introduced
  const map = new Map(saved.map((a) => [a.id, a]));
  return INITIAL_ACHIEVEMENTS.map((initial) => {
    const existing = map.get(initial.id);
    return existing ? { ...initial, ...existing } : initial;
  });
}

export function updateAchievements(updated: Achievement[]): void {
  safeSet(STORAGE_KEYS.ACHIEVEMENTS, updated);
}

export function checkAndUnlockAchievements(context: {
  runFinished?: boolean;
  score?: number;
  healthyCount?: number;
  junkCount?: number;
  waterCount?: number;
  rank?: string;
  distance?: number;
  shieldBlocks?: number;
  goalCompleted?: boolean;
}): { updated: Achievement[]; newlyUnlocked: Achievement[] } {
  const current = getAchievements();
  const newlyUnlocked: Achievement[] = [];

  const updated = current.map((ach) => {
    if (ach.unlocked) return ach;
    let newProgress = ach.progress;
    let unlockNow = false;

    switch (ach.id) {
      case 'first_run':
        if (context.runFinished) unlockNow = true;
        break;
      case 'healthy_eater':
        if (context.healthyCount) {
          newProgress += context.healthyCount;
          if (newProgress >= ach.target) unlockNow = true;
        }
        break;
      case 'hydration_hero':
        if (context.waterCount) {
          newProgress += context.waterCount;
          if (newProgress >= ach.target) unlockNow = true;
        }
        break;
      case 'speed_runner':
        if (context.score && context.score > 2000) unlockNow = true;
        break;
      case 'junk_food_fighter':
        if (context.runFinished && (context.junkCount ?? 0) <= 2) unlockNow = true;
        break;
      case 'goal_crusher':
        if (context.goalCompleted) unlockNow = true;
        break;
      case 'points_1000':
        if (context.score && context.score >= ach.target) unlockNow = true;
        break;
      case 'perfect_run':
        if (context.rank === 'S') unlockNow = true;
        break;
      case 'shield_master':
        if (context.shieldBlocks) {
          newProgress += context.shieldBlocks;
          if (newProgress >= ach.target) unlockNow = true;
        }
        break;
      case 'marathoner':
        if (context.distance) {
          newProgress += context.distance;
          if (newProgress >= ach.target) unlockNow = true;
        }
        break;
    }

    if (unlockNow) {
      const unlockedAch: Achievement = {
        ...ach,
        progress: ach.target,
        unlocked: true,
        unlockedAt: new Date().toISOString(),
      };
      newlyUnlocked.push(unlockedAch);
      return unlockedAch;
    }

    return { ...ach, progress: newProgress };
  });

  updateAchievements(updated);
  return { updated, newlyUnlocked };
}

// Daily Challenges
export function getDailyChallenges(): DailyChallenge[] {
  const today = new Date().toISOString().slice(0, 10);
  const savedDate = localStorage.getItem(STORAGE_KEYS.DAILY_DATE);

  if (savedDate !== today) {
    // New day: reset challenges
    safeSet(STORAGE_KEYS.DAILY_DATE, today);
    safeSet(STORAGE_KEYS.DAILY_CHALLENGES, INITIAL_DAILY_CHALLENGES);
    return INITIAL_DAILY_CHALLENGES;
  }

  return safeGet<DailyChallenge[]>(STORAGE_KEYS.DAILY_CHALLENGES, INITIAL_DAILY_CHALLENGES);
}

export function updateDailyChallenges(challenges: DailyChallenge[]): void {
  safeSet(STORAGE_KEYS.DAILY_CHALLENGES, challenges);
}

export function advanceDailyChallengeProgress(data: {
  healthyFoods?: number;
  avoidJunkDistance?: number;
  distanceMeters?: number;
  waterBoosts?: number;
}): DailyChallenge[] {
  const current = getDailyChallenges();
  const updated = current.map((c) => {
    if (c.completed) return c;
    let cur = c.current;
    if (c.id === 'daily_healthy_10' && data.healthyFoods) {
      cur = Math.min(c.target, cur + data.healthyFoods);
    }
    if (c.id === 'daily_avoid_junk' && data.avoidJunkDistance) {
      cur = Math.min(c.target, cur + data.avoidJunkDistance);
    }
    if (c.id === 'daily_run_2km' && data.distanceMeters) {
      cur = Math.min(c.target, cur + data.distanceMeters);
    }
    if (c.id === 'daily_water_3' && data.waterBoosts) {
      cur = Math.min(c.target, cur + data.waterBoosts);
    }
    return {
      ...c,
      current: cur,
      completed: cur >= c.target,
    };
  });
  updateDailyChallenges(updated);
  return updated;
}

// Settings
export function getGameSettings(): GameSettings {
  return safeGet<GameSettings>(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
}

export function saveGameSettings(settings: GameSettings): void {
  safeSet(STORAGE_KEYS.SETTINGS, settings);
}

// Lifetime Statistics
export function getLifetimeStats(): LifetimeStats {
  return safeGet<LifetimeStats>(STORAGE_KEYS.STATS, DEFAULT_STATS);
}

export function recordRunStats(stats: {
  distanceMeters: number;
  score: number;
  healthyFoods: number;
  junkFoods: number;
  obstaclesHit: number;
  powerUps: number;
  goalCompleted: boolean;
  bmiDelta: number;
}): LifetimeStats {
  const current = getLifetimeStats();
  const updated: LifetimeStats = {
    totalRuns: current.totalRuns + 1,
    totalDistanceMeters: current.totalDistanceMeters + stats.distanceMeters,
    highestScore: Math.max(current.highestScore, stats.score),
    totalHealthyFoods: current.totalHealthyFoods + stats.healthyFoods,
    totalJunkFoods: current.totalJunkFoods + stats.junkFoods,
    totalObstaclesHit: current.totalObstaclesHit + stats.obstaclesHit,
    totalPowerUps: current.totalPowerUps + stats.powerUps,
    goalsCompleted: current.goalsCompleted + (stats.goalCompleted ? 1 : 0),
    bestBMIImprovement: Math.max(current.bestBMIImprovement, stats.bmiDelta > 0 ? stats.bmiDelta : 0),
  };
  safeSet(STORAGE_KEYS.STATS, updated);
  return updated;
}

// Unlocked Levels
export function getUnlockedLevels(): number[] {
  return safeGet<number[]>(STORAGE_KEYS.UNLOCKED_LEVELS, [1, 2]);
}

export function unlockLevel(levelId: number): number[] {
  const current = getUnlockedLevels();
  if (!current.includes(levelId)) {
    const updated = [...current, levelId].sort((a, b) => a - b);
    safeSet(STORAGE_KEYS.UNLOCKED_LEVELS, updated);
    return updated;
  }
  return current;
}

// Clear / Reset All Data
export function resetAllGameData(): void {
  Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
}
