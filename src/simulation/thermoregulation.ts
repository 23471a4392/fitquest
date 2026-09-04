export interface ThermalState {
  coreBodyTemperatureCelsius: number;
  heatStrainIndex: number;
  heatExhaustionRisk: 'low' | 'moderate' | 'high' | 'critical';
  coolingEfficiencyPercent: number;
}

export function simulateCoreTemperature(
  baselineTempCelsius: number,
  durationMinutes: number,
  runningIntensityPercent: number,
  ambientTempCelsius: number,
  hydrationLossPercent: number
): ThermalState {
  // Metabolic heat production generates heat
  const heatProduction = 0.045 * runningIntensityPercent * durationMinutes;
  // Ambient thermal gradient
  const environmentalLoad = Math.max(0, (ambientTempCelsius - 22) * 0.02 * durationMinutes);
  // Dehydration suppresses sweating evaporation
  const dehydrationPenalty = hydrationLossPercent * 0.12;

  const coreTemp = baselineTempCelsius + heatProduction + environmentalLoad + dehydrationPenalty;
  const clampedCore = Math.min(41.5, Math.max(36.5, coreTemp));

  let risk: 'low' | 'moderate' | 'high' | 'critical' = 'low';
  if (clampedCore >= 40.0) risk = 'critical';
  else if (clampedCore >= 39.2) risk = 'high';
  else if (clampedCore >= 38.5) risk = 'moderate';

  return {
    coreBodyTemperatureCelsius: Math.round(clampedCore * 100) / 100,
    heatStrainIndex: Math.round(((clampedCore - 37.0) / 3.5) * 100),
    heatExhaustionRisk: risk,
    coolingEfficiencyPercent: Math.max(20, Math.round((1 - hydrationLossPercent * 0.15) * 100)),
  };
}
