export interface GlycemicResponseCurve {
  peakBloodGlucoseMgDl: number;
  timeToPeakMinutes: number;
  reactiveHypoglycemiaRisk: boolean;
  glucoseTrajectory: number[];
  insulinSpikeMagnitudeUuMl: number;
}

export function simulateGlycemicResponse(
  foodGlycemicIndex: number,
  carbsGrams: number,
  proteinGrams: number,
  fatGrams: number,
  fiberGrams: number
): GlycemicResponseCurve {
  // Fat, protein, and fiber buffer the glycemic spike
  const bufferFactor = 1 + (fatGrams * 0.03) + (proteinGrams * 0.02) + (fiberGrams * 0.05);
  const effectiveGI = foodGlycemicIndex / bufferFactor;
  const glycemicLoad = (effectiveGI * carbsGrams) / 100;

  const baselineGlucose = 90;
  const peakIncrease = glycemicLoad * 2.8;
  const peakGlucose = Math.round(baselineGlucose + peakIncrease);
  const timeToPeak = Math.round(20 + (bufferFactor * 15));

  // Trajectory over 120 minutes (12 steps of 10 mins)
  const trajectory: number[] = [];
  for (let t = 0; t <= 120; t += 10) {
    if (t < timeToPeak) {
      trajectory.push(Math.round(baselineGlucose + (peakIncrease * (t / timeToPeak))));
    } else {
      const decay = Math.exp(-(t - timeToPeak) / 30);
      // If high GI with low buffering, sugar drops below baseline (reactive crash)
      const undershoot = effectiveGI > 70 ? 12 : 0;
      trajectory.push(Math.round(baselineGlucose - undershoot + (peakIncrease * decay)));
    }
  }

  const reactiveHypo = effectiveGI > 75 && glycemicLoad > 20;

  return {
    peakBloodGlucoseMgDl: peakGlucose,
    timeToPeakMinutes: timeToPeak,
    reactiveHypoglycemiaRisk: reactiveHypo,
    glucoseTrajectory: trajectory,
    insulinSpikeMagnitudeUuMl: Math.round(glycemicLoad * 1.9),
  };
}
