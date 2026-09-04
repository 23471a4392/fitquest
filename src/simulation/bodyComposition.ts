export interface BodyCompositionMetrics {
  bodyFatPercentage: number;
  fatMassKg: number;
  leanMassKg: number;
  ffmi: number; // Fat-Free Mass Index
  category: 'Athletic' | 'Fitness' | 'Average' | 'Above Average';
}

export function calculateUSNavyBodyFat(
  gender: 'male' | 'female',
  heightCm: number,
  waistCm: number,
  neckCm: number,
  hipCm?: number
): number {
  if (gender === 'male') {
    // 495 / (1.0324 - 0.19077 * log10(waist - neck) + 0.15456 * log10(height)) - 450
    const val = 1.0324 - 0.19077 * Math.log10(waistCm - neckCm) + 0.15456 * Math.log10(heightCm);
    const bf = 495 / val - 450;
    return Math.round(Math.max(4, Math.min(55, bf)) * 10) / 10;
  } else {
    const hip = hipCm || waistCm * 1.15;
    const val = 1.29579 - 0.35004 * Math.log10(waistCm + hip - neckCm) + 0.22100 * Math.log10(heightCm);
    const bf = 495 / val - 450;
    return Math.round(Math.max(8, Math.min(60, bf)) * 10) / 10;
  }
}

export function computeBodyComposition(
  totalWeightKg: number,
  heightCm: number,
  bodyFatPercent: number
): BodyCompositionMetrics {
  const fatMass = totalWeightKg * (bodyFatPercent / 100);
  const leanMass = totalWeightKg - fatMass;
  const heightM = heightCm / 100;
  const ffmi = leanMass / (heightM * heightM);

  let cat: 'Athletic' | 'Fitness' | 'Average' | 'Above Average' = 'Average';
  if (bodyFatPercent < 14) cat = 'Athletic';
  else if (bodyFatPercent < 18) cat = 'Fitness';
  else if (bodyFatPercent < 24) cat = 'Average';
  else cat = 'Above Average';

  return {
    bodyFatPercentage: bodyFatPercent,
    fatMassKg: Math.round(fatMass * 10) / 10,
    leanMassKg: Math.round(leanMass * 10) / 10,
    ffmi: Math.round(ffmi * 10) / 10,
    category: cat,
  };
}
