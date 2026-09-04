export interface HydrationState {
  fluidDeficitMl: number;
  bodyWeightLossPercent: number;
  plasmaOsmolalityMoms: number;
  sweatRateMlPerHour: number;
  sodiumLossMg: number;
  dehydrationLevel: 'hydrated' | 'mild' | 'moderate' | 'severe' | 'critical';
  performanceImpairmentPercent: number;
}

export function computeSweatRate(
  weightKg: number,
  runningPaceMinKm: number,
  ambientTempCelsius: number,
  humidityPercent: number
): number {
  // Base sweat rate: 0.8 L / hr at 20C moderate pace
  const speedFactor = (6.0 / runningPaceMinKm) * 0.3;
  const heatFactor = Math.max(0, (ambientTempCelsius - 18) * 0.045);
  const humidityFactor = (humidityPercent / 100) * 0.15;

  const rateLiters = 0.6 + speedFactor + heatFactor + humidityFactor + (weightKg * 0.005);
  return Math.round(rateLiters * 1000); // in ml/hr
}

export function simulateHydrationLoss(
  startingWeightKg: number,
  durationMinutes: number,
  sweatRateMlHr: number,
  fluidConsumedMl: number,
  sodiumConsumedMg: number
): HydrationState {
  const totalSweatMl = (sweatRateMlHr / 60) * durationMinutes;
  const netDeficitMl = Math.max(0, totalSweatMl - fluidConsumedMl);

  // 1000ml fluid loss ~ 1kg bodyweight loss
  const weightLostKg = netDeficitMl / 1000;
  const weightLossPercent = Math.round((weightLostKg / startingWeightKg) * 1000) / 10;

  // Sodium loss in sweat: ~900mg per Liter of sweat
  const totalSodiumLossMg = Math.round((totalSweatMl / 1000) * 900) - sodiumConsumedMg;

  // Plasma Osmolality baseline 285 mOsm/kg
  const osmolality = 285 + (weightLossPercent * 3.5);

  let level: 'hydrated' | 'mild' | 'moderate' | 'severe' | 'critical' = 'hydrated';
  let impairment = 0;

  if (weightLossPercent > 5.0) {
    level = 'critical';
    impairment = 30;
  } else if (weightLossPercent > 3.5) {
    level = 'severe';
    impairment = 18;
  } else if (weightLossPercent > 2.0) {
    level = 'moderate';
    impairment = 10;
  } else if (weightLossPercent > 1.0) {
    level = 'mild';
    impairment = 4;
  }

  return {
    fluidDeficitMl: Math.round(netDeficitMl),
    bodyWeightLossPercent: weightLossPercent,
    plasmaOsmolalityMoms: Math.round(osmolality),
    sweatRateMlPerHour: sweatRateMlHr,
    sodiumLossMg: Math.max(0, totalSodiumLossMg),
    dehydrationLevel: level,
    performanceImpairmentPercent: impairment,
  };
}
