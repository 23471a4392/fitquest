export interface BiometricsSummary {
  bmi: number;
  waistToHeightRatio: number;
  waistToHipRatio?: number;
  whTrRiskCategory: 'Low Risk' | 'Increased Risk' | 'High Risk';
  idealWeightRangeKg: { min: number; max: number };
}

export function computeAdvancedBiometrics(
  weightKg: number,
  heightCm: number,
  waistCm: number,
  hipCm?: number
): BiometricsSummary {
  const heightM = heightCm / 100;
  const bmi = Math.round((weightKg / (heightM * heightM)) * 10) / 10;
  const whtr = Math.round((waistCm / heightCm) * 100) / 100;
  const whr = hipCm && hipCm > 0 ? Math.round((waistCm / hipCm) * 100) / 100 : undefined;

  let risk: 'Low Risk' | 'Increased Risk' | 'High Risk' = 'Low Risk';
  if (whtr > 0.58) risk = 'High Risk';
  else if (whtr > 0.50) risk = 'Increased Risk';

  // Healthy BMI range 18.5 - 24.9
  const minIdeal = Math.round(18.5 * heightM * heightM * 10) / 10;
  const maxIdeal = Math.round(24.9 * heightM * heightM * 10) / 10;

  return {
    bmi,
    waistToHeightRatio: whtr,
    waistToHipRatio: whr,
    whTrRiskCategory: risk,
    idealWeightRangeKg: { min: minIdeal, max: maxIdeal },
  };
}
