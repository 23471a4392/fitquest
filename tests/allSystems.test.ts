import { describe, it, expect } from 'vitest';
import { calculateBMI, getBMICategory, simulateWeightChange, calculateRank, generateGameSummary } from '../src/utils/gameLogic';
import { calculateBMR, estimateSubstrateOxidation } from '../src/simulation/metabolismEngine';
import { initializeGlycogenPools, updateGlycogenDepletion } from '../src/simulation/glycogenModel';
import { computeSweatRate, simulateHydrationLoss } from '../src/simulation/hydrationDynamics';
import { estimateLactateThreshold } from '../src/simulation/lactateThreshold';
import { calculateHeartRateZones } from '../src/training/heartRateZones';
import { calculateJackDanielsPaces } from '../src/training/runningPacingMatrix';
import { computeDailyRecoveryScore } from '../src/training/recoveryAdvisor';
import { evaluateACWR } from '../src/training/trainingLoad';
import { getRealtimeCoachMessage } from '../src/coaching/aiFitnessCoach';
import { generateNutritionDiagnostic } from '../src/coaching/nutritionAdviceEngine';
import { calculateHabitScore } from '../src/coaching/habitTracker';
import { calculatePersonalizedMacros } from '../src/recipes/macroCalculator';
import { check3DCollision } from '../src/engine/collisionDetector';
import { updateCombo } from '../src/engine/comboSystem';
import { computeAdvancedBiometrics } from '../src/analytics/biometricsCalculator';
import { analyzeRunningSplits } from '../src/analytics/paceAnalysis';

describe('FitQuest Core Game Logic', () => {
  it('calculates BMI correctly', () => {
    const bmi = calculateBMI(70, 175);
    expect(bmi).toBe(22.9);
    expect(getBMICategory(bmi)).toBe('Normal');
  });

  it('categorizes BMI properly', () => {
    expect(getBMICategory(17.5)).toBe('Underweight');
    expect(getBMICategory(22.0)).toBe('Normal');
    expect(getBMICategory(27.0)).toBe('Overweight');
    expect(getBMICategory(32.0)).toBe('Obesity');
  });

  it('simulates healthy and junk food weight adjustments', () => {
    const weightLossHealthy = simulateWeightChange(80, 70, 'weight_loss', true, -0.1);
    expect(weightLossHealthy).toBeLessThan(80);

    const junkWeight = simulateWeightChange(80, 70, 'weight_loss', false, 0.15);
    expect(junkWeight).toBeGreaterThan(80);
  });

  it('evaluates performance ranks dynamically', () => {
    const rankS = calculateRank(4200, 20, 1, true, 1, true);
    expect(rankS.rank).toBe('S');

    const rankD = calculateRank(500, 2, 10, false, 8, false);
    expect(rankD.rank).toBe('D');
  });
});

describe('Physiological & Metabolic Simulation', () => {
  it('computes BMR via Mifflin-St Jeor', () => {
    const bmr = calculateBMR(75, 178, 28, 'male');
    expect(bmr.mifflinStJeor).toBeGreaterThan(1600);
    expect(bmr.tdeeAthlete).toBeGreaterThan(bmr.mifflinStJeor);
  });

  it('calculates substrate oxidation percentages', () => {
    const lowIntensity = estimateSubstrateOxidation(0.5, 70);
    const highIntensity = estimateSubstrateOxidation(0.9, 70);
    expect(lowIntensity.fatPercent).toBeGreaterThan(highIntensity.fatPercent);
    expect(highIntensity.carbPercent).toBeGreaterThan(lowIntensity.carbPercent);
  });

  it('models glycogen depletion and bonking', () => {
    const initial = initializeGlycogenPools(70);
    expect(initial.muscleGlycogenGrams).toBeGreaterThan(350);

    const depleted = updateGlycogenDepletion(initial, 90, 0.85);
    expect(depleted.muscleGlycogenGrams).toBeLessThan(initial.muscleGlycogenGrams);
  });

  it('calculates sweat rate and dehydration penalty', () => {
    const sweatRate = computeSweatRate(75, 5.0, 28, 65);
    expect(sweatRate).toBeGreaterThan(800);

    const hydration = simulateHydrationLoss(75, 60, sweatRate, 300, 200);
    expect(hydration.fluidDeficitMl).toBeGreaterThan(0);
  });
});

describe('Training & Pacing Algorithms', () => {
  it('calculates Jack Daniels running paces', () => {
    const paces = calculateJackDanielsPaces(1200); // 20:00 5K
    expect(paces.easyPaceMinKm).toBeDefined();
    expect(paces.thresholdPaceMinKm).toBeDefined();
  });

  it('computes Karvonen heart rate zones', () => {
    const zones = calculateHeartRateZones(190, 50, 'karvonen');
    expect(zones.length).toBe(5);
    expect(zones[0].minBpm).toBeLessThan(zones[4].maxBpm);
  });

  it('evaluates ACWR training load', () => {
    const audit = evaluateACWR(40, 38);
    expect(audit.injuryRiskStatus).toBe('Safe Sweet Spot');
  });
});

describe('AI Coaching, Recipes, & Game Engine', () => {
  it('triggers critical AI coach alerts on low energy', () => {
    const alert = getRealtimeCoachMessage(2, 0, 15, 80);
    expect(alert.urgency).toBe('critical');
  });

  it('calculates personalized macronutrient targets', () => {
    const macros = calculatePersonalizedMacros(70, 'fitness', 40);
    expect(macros.dailyCalories).toBeGreaterThan(2000);
    expect(macros.proteinGrams).toBeGreaterThan(100);
  });

  it('detects 3D bounding box collisions', () => {
    const boxA = { minX: -5, maxX: 5, minY: 0, maxY: 10, minZ: 0, maxZ: 10 };
    const boxB = { minX: -2, maxX: 2, minY: 2, maxY: 8, minZ: 2, maxZ: 8 };
    expect(check3DCollision(boxA, boxB)).toBe(true);
  });

  it('maintains clean healthy streak combo multipliers', () => {
    let combo = { currentStreak: 0, multiplier: 1.0, maxCombo: 0, lastCollectTimestamp: Date.now() };
    for (let i = 0; i < 6; i++) {
      combo = updateCombo(combo, true);
    }
    expect(combo.currentStreak).toBe(6);
    expect(combo.multiplier).toBeGreaterThan(1.0);
  });
});
