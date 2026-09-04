export interface GlycogenPoolState {
  muscleGlycogenGrams: number;
  maxMuscleGlycogenGrams: number;
  liverGlycogenGrams: number;
  maxLiverGlycogenGrams: number;
  bloodGlucoseMgDl: number;
  bonkThresholdReached: boolean;
  glycogenDepletionPercentage: number;
}

export function initializeGlycogenPools(bodyWeightKg: number, isCarbLoaded = false): GlycogenPoolState {
  // Approximate: 15g glycogen per kg of muscle mass (~40% of bodyweight)
  const muscleMassEst = bodyWeightKg * 0.42;
  const maxMuscle = isCarbLoaded ? muscleMassEst * 18 : muscleMassEst * 14;
  const maxLiver = isCarbLoaded ? 110 : 85;

  return {
    muscleGlycogenGrams: Math.round(maxMuscle),
    maxMuscleGlycogenGrams: Math.round(maxMuscle),
    liverGlycogenGrams: Math.round(maxLiver),
    maxLiverGlycogenGrams: Math.round(maxLiver),
    bloodGlucoseMgDl: 95,
    bonkThresholdReached: false,
    glycogenDepletionPercentage: 0,
  };
}

export function updateGlycogenDepletion(
  state: GlycogenPoolState,
  durationMinutes: number,
  intensityVo2Max: number,
  exogenousCarbsConsumedGrams = 0
): GlycogenPoolState {
  // Consumption rate (grams of glycogen / min)
  const burnRate = 0.5 + Math.pow(intensityVo2Max, 2.2) * 2.8;
  const totalBurn = burnRate * durationMinutes;

  // Muscle glycogen provides ~80%, liver provides ~20% + maintains blood glucose
  let newMuscle = state.muscleGlycogenGrams - (totalBurn * 0.78);
  let newLiver = state.liverGlycogenGrams - (totalBurn * 0.22) + (exogenousCarbsConsumedGrams * 0.6);

  newMuscle = Math.max(0, Math.min(state.maxMuscleGlycogenGrams, newMuscle));
  newLiver = Math.max(0, Math.min(state.maxLiverGlycogenGrams, newLiver));

  // Blood glucose drops as liver glycogen falls below 20g
  let glucose = 95;
  if (newLiver < 25) {
    glucose = 60 + (newLiver / 25) * 35;
  }

  const totalCurrent = newMuscle + newLiver;
  const totalMax = state.maxMuscleGlycogenGrams + state.maxLiverGlycogenGrams;
  const depletionPct = Math.round((1 - (totalCurrent / totalMax)) * 100);
  const bonked = newMuscle < (state.maxMuscleGlycogenGrams * 0.15) || glucose < 65;

  return {
    muscleGlycogenGrams: Math.round(newMuscle * 10) / 10,
    maxMuscleGlycogenGrams: state.maxMuscleGlycogenGrams,
    liverGlycogenGrams: Math.round(newLiver * 10) / 10,
    maxLiverGlycogenGrams: state.maxLiverGlycogenGrams,
    bloodGlucoseMgDl: Math.round(glucose),
    bonkThresholdReached: bonked,
    glycogenDepletionPercentage: depletionPct,
  };
}
