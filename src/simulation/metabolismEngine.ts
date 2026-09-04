export interface BMRResults {
  mifflinStJeor: number;
  harrisBenedict: number;
  katchMcArdle?: number;
  cunningham?: number;
  recommendedBMR: number;
  tdeeCasual: number;
  tdeeAthlete: number;
  tdeeMarathonTraining: number;
}

export interface MetabolicState {
  currentBMR: number;
  activeTDEE: number;
  respiratoryExchangeRatio: number;
  carbBurnRateGramsMin: number;
  fatBurnRateGramsMin: number;
  caloriesBurnedTotal: number;
  metabolicAdaptationFactor: number;
}

export function calculateBMR(
  weightKg: number,
  heightCm: number,
  ageYears: number,
  gender: 'male' | 'female' | 'other' = 'male',
  bodyFatPercent?: number
): BMRResults {
  // Mifflin-St Jeor Formula
  let mifflin = 10 * weightKg + 6.25 * heightCm - 5 * ageYears;
  if (gender === 'male') {
    mifflin += 5;
  } else if (gender === 'female') {
    mifflin -= 161;
  } else {
    mifflin -= 78;
  }

  // Revised Harris-Benedict
  let harris = 0;
  if (gender === 'male') {
    harris = 13.397 * weightKg + 4.799 * heightCm - 5.677 * ageYears + 88.362;
  } else {
    harris = 9.247 * weightKg + 3.098 * heightCm - 4.330 * ageYears + 447.593;
  }

  // Katch-McArdle & Cunningham if body fat is known
  let katch: number | undefined;
  let cunningham: number | undefined;
  if (bodyFatPercent !== undefined && bodyFatPercent > 0 && bodyFatPercent < 70) {
    const leanMassKg = weightKg * (1 - bodyFatPercent / 100);
    katch = 370 + 21.6 * leanMassKg;
    cunningham = 500 + 22 * leanMassKg;
  }

  const recommended = Math.round(katch || mifflin);

  return {
    mifflinStJeor: Math.round(mifflin),
    harrisBenedict: Math.round(harris),
    katchMcArdle: katch ? Math.round(katch) : undefined,
    cunningham: cunningham ? Math.round(cunningham) : undefined,
    recommendedBMR: recommended,
    tdeeCasual: Math.round(recommended * 1.375),
    tdeeAthlete: Math.round(recommended * 1.725),
    tdeeMarathonTraining: Math.round(recommended * 1.9),
  };
}

export function estimateSubstrateOxidation(
  intensityVo2Percent: number,
  currentWeightKg: number
): { rer: number; carbPercent: number; fatPercent: number; carbGramsPerHour: number; fatGramsPerHour: number } {
  // RER increases from 0.72 (rest) to 1.00+ (max intensity)
  const clampedIntensity = Math.max(0.2, Math.min(1.0, intensityVo2Percent));
  const rer = 0.70 + (0.35 * Math.pow(clampedIntensity, 1.6));
  
  // Percent carbohydrate vs fat from RER
  const carbPercent = Math.max(0, Math.min(100, (rer - 0.70) / (1.00 - 0.70) * 100));
  const fatPercent = 100 - carbPercent;

  // Approximate kcal burned per min based on intensity and weight
  const totalKcalPerMin = (clampedIntensity * 0.2) * currentWeightKg;
  const carbKcalPerMin = totalKcalPerMin * (carbPercent / 100);
  const fatKcalPerMin = totalKcalPerMin * (fatPercent / 100);

  const carbGramsPerHour = (carbKcalPerMin * 60) / 4.1;
  const fatGramsPerHour = (fatKcalPerMin * 60) / 9.3;

  return {
    rer: Math.round(rer * 100) / 100,
    carbPercent: Math.round(carbPercent),
    fatPercent: Math.round(fatPercent),
    carbGramsPerHour: Math.round(carbGramsPerHour * 10) / 10,
    fatGramsPerHour: Math.round(fatGramsPerHour * 10) / 10,
  };
}
