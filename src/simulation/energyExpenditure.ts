export interface RunningEnergyCost {
  netCostKcalPerKm: number;
  grossCostKcalPerKm: number;
  metsEstimated: number;
  caloriesBurnedTotal: number;
  efficiencyWatts: number;
}

export function calculateRunningCalorieExpenditure(
  weightKg: number,
  distanceKm: number,
  paceMinutesPerKm: number,
  gradeInclinePercent = 0
): RunningEnergyCost {
  // Standard net metabolic cost of running ~ 0.97 kcal / kg / km on flat
  const speedKmh = 60 / paceMinutesPerKm;
  const gradeFactor = 1 + (gradeInclinePercent * 0.045);
  
  const netKcalPerKm = 0.97 * weightKg * gradeFactor;
  const grossKcalPerKm = 1.05 * weightKg * gradeFactor;
  const totalKcal = grossKcalPerKm * distanceKm;

  // MET calculation
  const speedMetersPerMin = speedKmh * 16.6667;
  const vo2Running = 0.2 * speedMetersPerMin + 0.9 * speedMetersPerMin * (gradeInclinePercent / 100) + 3.5;
  const mets = vo2Running / 3.5;

  const watts = (totalKcal * 4184) / ((distanceKm * paceMinutesPerKm) * 60);

  return {
    netCostKcalPerKm: Math.round(netKcalPerKm * 10) / 10,
    grossCostKcalPerKm: Math.round(grossKcalPerKm * 10) / 10,
    metsEstimated: Math.round(mets * 10) / 10,
    caloriesBurnedTotal: Math.round(totalKcal),
    efficiencyWatts: Math.round(watts),
  };
}
