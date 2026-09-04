export interface FatMaxCurvePoint {
  percentVO2Max: number;
  fatOxidationGramsPerMinute: number;
  carbOxidationGramsPerMinute: number;
  totalEnergyKcalPerMinute: number;
}

export function generateFatMaxCurve(weightKg: number): FatMaxCurvePoint[] {
  const points: FatMaxCurvePoint[] = [];
  // FatMax typically peaks around 55-65% VO2 Max
  for (let pct = 30; pct <= 95; pct += 5) {
    const vo2Fraction = pct / 100;
    // Parabolic curve for fat oxidation
    const fatRate = 0.65 * Math.sin((vo2Fraction - 0.25) * Math.PI * 1.4);
    const clampedFatRate = Math.max(0.05, fatRate);

    // Exponential curve for carb oxidation
    const carbRate = 0.3 + Math.pow(vo2Fraction, 2.5) * 3.2;
    const totalKcal = (clampedFatRate * 9.3) + (carbRate * 4.1);

    points.push({
      percentVO2Max: pct,
      fatOxidationGramsPerMinute: Math.round(clampedFatRate * 100) / 100,
      carbOxidationGramsPerMinute: Math.round(carbRate * 100) / 100,
      totalEnergyKcalPerMinute: Math.round(totalKcal * 10) / 10,
    });
  }
  return points;
}
