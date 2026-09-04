export type FitnessGoal = 'weight_loss' | 'maintain_weight' | 'fitness' | 'healthy_lifestyle';

export type BMICategory = 'Underweight' | 'Normal' | 'Overweight' | 'Obesity';

export interface PlayerProfile {
  name: string;
  age: number;
  gender?: string;
  heightCm: number;
  currentWeightKg: number;
  targetWeightKg: number;
  fitnessGoal: FitnessGoal;
  initialBMI: number;
  initialBMICategory: BMICategory;
}

export type FoodType = 'healthy' | 'junk';

export interface FoodItemDefinition {
  id: string;
  name: string;
  type: FoodType;
  emoji: string;
  weightDelta: number; // in kg (- for healthy, + for junk)
  healthDelta: number;
  energyDelta: number;
  scoreDelta: number;
  speedDelta: number; // percentage change
  description: string;
}

export interface ObstacleDefinition {
  id: string;
  name: string;
  emoji: string;
  healthPenalty: number;
  energyPenalty: number;
  scorePenalty: number;
  slowDurationMs: number;
  description: string;
}

export interface PowerUpDefinition {
  id: string;
  name: string;
  emoji: string;
  type: 'water' | 'salad' | 'apple' | 'shield' | 'boost';
  durationMs: number;
  healthBonus: number;
  energyBonus: number;
  scoreBonus: number;
  speedMultiplier: number;
  description: string;
}

export type Lane = -1 | 0 | 1; // Left, Center, Right

export interface SpawnedEntity {
  id: number;
  lane: Lane;
  z: number; // distance from player (100 to 0)
  kind: 'healthy_food' | 'junk_food' | 'obstacle' | 'power_up';
  data: FoodItemDefinition | ObstacleDefinition | PowerUpDefinition;
  collected?: boolean;
}

export interface FloatingText {
  id: number;
  text: string;
  color: string;
  x: number;
  y: number;
  opacity: number;
  scale: number;
  createdAt: number;
}

export interface ActivePowerUp {
  type: 'water' | 'salad' | 'apple' | 'shield' | 'boost';
  name: string;
  emoji: string;
  expiresAt: number;
}

export interface LevelConfig {
  id: number;
  name: string;
  subtitle: string;
  targetDistanceMeters: number;
  baseSpeed: number;
  obstacleFrequency: number;
  foodFrequency: number;
  environment: 'park' | 'street' | 'city' | 'valley' | 'marathon';
  description: string;
  unlockedByDefault: boolean;
}

export type GameStatus = 'idle' | 'running' | 'paused' | 'goal_reached' | 'game_over';

export interface GameSummary {
  player: PlayerProfile;
  level: LevelConfig;
  initialWeight: number;
  finalWeight: number;
  weightChange: number;
  initialBMI: number;
  finalBMI: number;
  bmiCategory: BMICategory;
  finalScore: number;
  rank: 'S' | 'A' | 'B' | 'C' | 'D';
  rankTitle: string;
  distanceCoveredMeters: number;
  healthyFoodsCollected: number;
  junkFoodsCollected: number;
  obstaclesHit: number;
  powerUpsCollected: number;
  timeElapsedSeconds: number;
  scoreBreakdown: {
    baseScore: number;
    healthyBonus: number;
    junkPenalty: number;
    obstaclePenalty: number;
    powerUpBonus: number;
    distanceBonus: number;
    healthyChoiceBonus: number;
    goalCompletionBonus: number;
    bmiImprovementBonus: number;
  };
}

export interface LeaderboardEntry {
  id: string;
  playerName: string;
  score: number;
  bmiImprovement: number; // initialBMI - finalBMI or percentage
  healthyChoices: number;
  junkChoices: number;
  distanceMeters: number;
  rankGrade: 'S' | 'A' | 'B' | 'C' | 'D';
  date: string;
  levelName: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  progress: number;
  target: number;
}

export interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  icon: string;
  current: number;
  target: number;
  bonusPoints: number;
  completed: boolean;
  claimed: boolean;
}

export interface GameSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  soundVolume: number;
  difficulty: 'casual' | 'normal' | 'pro';
  animationsEnabled: boolean;
  theme: 'dark' | 'light';
}

export interface LifetimeStats {
  totalRuns: number;
  totalDistanceMeters: number;
  highestScore: number;
  totalHealthyFoods: number;
  totalJunkFoods: number;
  totalObstaclesHit: number;
  totalPowerUps: number;
  goalsCompleted: number;
  bestBMIImprovement: number;
}
