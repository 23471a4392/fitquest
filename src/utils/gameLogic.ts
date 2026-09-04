import type { BMICategory, FitnessGoal, GameSummary, LevelConfig, PlayerProfile } from '../types/game';

/**
 * Calculates Body Mass Index (BMI)
 * BMI = weightKg / (heightMeters ^ 2)
 */
export function calculateBMI(weightKg: number, heightCm: number): number {
  if (!heightCm || heightCm <= 0 || !weightKg || weightKg <= 0) return 0;
  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);
  return Math.round(bmi * 10) / 10;
}

/**
 * Determines BMI Category according to standard international guidelines
 */
export function getBMICategory(bmi: number): BMICategory {
  if (bmi <= 0) return 'Normal';
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25.0) return 'Normal';
  if (bmi < 30.0) return 'Overweight';
  return 'Obesity';
}

/**
 * Get visual badge colors and description for BMI category
 */
export function getBMICategoryMeta(category: BMICategory): { label: string; color: string; badgeBg: string; textClass: string } {
  switch (category) {
    case 'Underweight':
      return {
        label: 'Underweight (<18.5)',
        color: '#f59e0b',
        badgeBg: 'bg-amber-500/15 border-amber-500/30 text-amber-400',
        textClass: 'text-amber-400',
      };
    case 'Normal':
      return {
        label: 'Healthy Normal (18.5 - 24.9)',
        color: '#84cc16',
        badgeBg: 'bg-lime-500/15 border-lime-500/30 text-lime-400',
        textClass: 'text-lime-400',
      };
    case 'Overweight':
      return {
        label: 'Overweight (25.0 - 29.9)',
        color: '#f97316',
        badgeBg: 'bg-orange-500/15 border-orange-500/30 text-orange-400',
        textClass: 'text-orange-400',
      };
    case 'Obesity':
      return {
        label: 'Obesity Class (30+)',
        color: '#ef4444',
        badgeBg: 'bg-rose-500/15 border-rose-500/30 text-rose-400',
        textClass: 'text-rose-400',
      };
  }
}

/**
 * Computes realistic micro-simulation weight adjustments based on food type and fitness goal
 */
export function simulateWeightChange(
  currentWeight: number,
  targetWeight: number,
  goal: FitnessGoal,
  isHealthy: boolean,
  baseDelta: number
): number {
  if (isHealthy) {
    // Healthy foods help guide the body toward target equilibrium
    if (goal === 'weight_loss' || currentWeight > targetWeight) {
      // Burn & drop gradual weight: -0.05 to -0.15 kg
      const change = Math.min(-0.04, baseDelta);
      return Math.max(targetWeight, Math.round((currentWeight + change) * 100) / 100);
    } else if (goal === 'fitness' || currentWeight < targetWeight) {
      // Gaining lean mass toward target
      const change = Math.max(0.04, Math.abs(baseDelta) * 0.6);
      return Math.min(targetWeight + 1, Math.round((currentWeight + change) * 100) / 100);
    } else {
      // Maintain weight: minor healthy stabilizing fluctuations
      return currentWeight;
    }
  } else {
    // Junk food creates metabolic load: +0.06 to +0.20 kg
    const junkIncrease = Math.max(0.06, Math.abs(baseDelta));
    return Math.round((currentWeight + junkIncrease) * 100) / 100;
  }
}

/**
 * Evaluates performance rank (S, A, B, C, D)
 */
export function calculateRank(
  score: number,
  healthyCount: number,
  junkCount: number,
  goalCompleted: boolean,
  obstaclesHit: number,
  bmiMovedTowardsGoal: boolean
): { rank: 'S' | 'A' | 'B' | 'C' | 'D'; title: string } {
  const totalFood = healthyCount + junkCount;
  const healthyRatio = totalFood > 0 ? healthyCount / totalFood : 1;

  if (goalCompleted && healthyRatio >= 0.88 && obstaclesHit <= 2 && (score >= 3800 || bmiMovedTowardsGoal)) {
    return { rank: 'S', title: 'S Rank – Fitness Grandmaster' };
  }
  if (goalCompleted && healthyRatio >= 0.72 && obstaclesHit <= 5) {
    return { rank: 'A', title: 'A Rank – High Performing Athlete' };
  }
  if (healthyRatio >= 0.55 && score >= 1500) {
    return { rank: 'B', title: 'B Rank – Dedicated Runner' };
  }
  if (healthyRatio >= 0.40 || score >= 800) {
    return { rank: 'C', title: 'C Rank – Needs Improvement' };
  }
  return { rank: 'D', title: 'D Rank – Try Again & Refocus' };
}

/**
 * Calculates full game summary with dynamic scoring breakdown
 */
export function generateGameSummary(
  player: PlayerProfile,
  level: LevelConfig,
  finalWeight: number,
  _finalHealth: number,
  distanceCovered: number,
  healthyFoods: number,
  junkFoods: number,
  obstaclesHit: number,
  powerUps: number,
  timeElapsedSeconds: number,
  goalReached: boolean
): GameSummary {
  const initialBMI = player.initialBMI;
  const finalBMI = calculateBMI(finalWeight, player.heightCm);
  const bmiCategory = getBMICategory(finalBMI);
  const weightChange = Math.round((finalWeight - player.currentWeightKg) * 100) / 100;

  // Base Score
  const baseScore = 1000;
  const healthyBonus = healthyFoods * 50;
  const junkPenalty = junkFoods * 75;
  const obstaclePenalty = obstaclesHit * 50;
  const powerUpBonus = powerUps * 100;
  const distanceBonus = Math.floor(distanceCovered / 100) * 10;

  // Healthy Choice Bonus (if healthy choices constitute 70%+ of eaten foods and at least 4 foods eaten)
  const totalFood = healthyFoods + junkFoods;
  const healthyChoiceBonus = totalFood >= 4 && healthyFoods / totalFood >= 0.7 ? 500 : 0;

  // Goal completion
  const goalCompletionBonus = goalReached ? 1000 : 0;

  // BMI Improvement Bonus
  const initialDistToTarget = Math.abs(player.currentWeightKg - player.targetWeightKg);
  const finalDistToTarget = Math.abs(finalWeight - player.targetWeightKg);
  let bmiImprovementBonus = 0;
  const bmiMovedTowardsGoal = finalDistToTarget < initialDistToTarget;

  if (bmiMovedTowardsGoal) {
    bmiImprovementBonus = 500;
  } else if (Math.abs(finalDistToTarget - initialDistToTarget) < 0.1) {
    bmiImprovementBonus = 250;
  } else {
    bmiImprovementBonus = 0;
  }

  const rawFinalScore =
    baseScore +
    healthyBonus -
    junkPenalty -
    obstaclePenalty +
    powerUpBonus +
    distanceBonus +
    healthyChoiceBonus +
    goalCompletionBonus +
    bmiImprovementBonus;

  const finalScore = Math.max(0, Math.round(rawFinalScore));
  const { rank, title: rankTitle } = calculateRank(
    finalScore,
    healthyFoods,
    junkFoods,
    goalReached,
    obstaclesHit,
    bmiMovedTowardsGoal
  );

  return {
    player,
    level,
    initialWeight: player.currentWeightKg,
    finalWeight,
    weightChange,
    initialBMI,
    finalBMI,
    bmiCategory,
    finalScore,
    rank,
    rankTitle,
    distanceCoveredMeters: Math.round(distanceCovered),
    healthyFoodsCollected: healthyFoods,
    junkFoodsCollected: junkFoods,
    obstaclesHit,
    powerUpsCollected: powerUps,
    timeElapsedSeconds,
    scoreBreakdown: {
      baseScore,
      healthyBonus,
      junkPenalty,
      obstaclePenalty,
      powerUpBonus,
      distanceBonus,
      healthyChoiceBonus,
      goalCompletionBonus,
      bmiImprovementBonus,
    },
  };
}

export function formatDistance(meters: number): string {
  if (meters >= 1000) {
    return `${(meters / 1000).toFixed(2)} km`;
  }
  return `${Math.round(meters)} m`;
}

export function formatWeight(kg: number): string {
  return `${kg.toFixed(2)} kg`;
}

export function formatScore(num: number): string {
  return new Intl.NumberFormat().format(num);
}
