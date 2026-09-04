export interface ProgressDataPoint {
  date: string;
  weightKg: number;
  bmi: number;
  averagePaceSecondsPerKm: number;
  distanceKm: number;
  score: number;
}

export function computeProgressTrends(history: ProgressDataPoint[]): {
  weightDeltaKg: number;
  bmiDelta: number;
  paceImprovementPct: number;
  totalDistanceKm: number;
} {
  if (history.length < 2) {
    return { weightDeltaKg: 0, bmiDelta: 0, paceImprovementPct: 0, totalDistanceKm: history.reduce((acc, h) => acc + h.distanceKm, 0) };
  }

  const initial = history[0];
  const latest = history[history.length - 1];

  const weightDelta = Math.round((latest.weightKg - initial.weightKg) * 10) / 10;
  const bmiDelta = Math.round((latest.bmi - initial.bmi) * 10) / 10;
  
  const paceDelta = initial.averagePaceSecondsPerKm - latest.averagePaceSecondsPerKm;
  const pacePct = Math.round((paceDelta / initial.averagePaceSecondsPerKm) * 1000) / 10;
  const totalDist = Math.round(history.reduce((acc, h) => acc + h.distanceKm, 0) * 10) / 10;

  return {
    weightDeltaKg: weightDelta,
    bmiDelta,
    paceImprovementPct: pacePct,
    totalDistanceKm: totalDist,
  };
}
