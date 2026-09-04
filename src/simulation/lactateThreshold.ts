export interface LactateProfile {
  restingLactateMmol: number;
  lactateThreshold1_AerobicMmol: number;
  lactateThreshold2_AnaerobicMmol: number;
  estimatedLT2HeartRateBpm: number;
  estimatedLT2PaceSecondsPerKm: number;
  bufferingCapacityScore: number;
}

export function estimateLactateThreshold(
  maxHeartRateBpm: number,
  restingHeartRateBpm: number,
  fiveKmTimeSeconds: number
): LactateProfile {
  // LT2 typically occurs at 85-88% of HR Max in trained runners
  const lt2HR = Math.round(restingHeartRateBpm + (maxHeartRateBpm - restingHeartRateBpm) * 0.86);
  
  // 5K pace is roughly 102-105% of LT2 pace
  const fiveKmPaceSec = fiveKmTimeSeconds / 5;
  const lt2PaceSec = Math.round(fiveKmPaceSec * 1.05);

  return {
    restingLactateMmol: 1.0,
    lactateThreshold1_AerobicMmol: 2.0,
    lactateThreshold2_AnaerobicMmol: 4.0,
    estimatedLT2HeartRateBpm: lt2HR,
    estimatedLT2PaceSecondsPerKm: lt2PaceSec,
    bufferingCapacityScore: 85,
  };
}

export function calculateLactateAccumulation(
  currentPaceSecKm: number,
  lt2PaceSecKm: number,
  durationMinutes: number
): { bloodLactateMmol: number; muscleFatigueIndex: number } {
  if (currentPaceSecKm >= lt2PaceSecKm) {
    // Aerobic zone, steady state
    return { bloodLactateMmol: 2.2, muscleFatigueIndex: 15 };
  }
  // Above threshold, exponential lactate rise
  const deltaPace = lt2PaceSecKm - currentPaceSecKm; // seconds faster than LT2
  const accumulationRate = 0.05 * Math.pow(deltaPace / 10, 1.8);
  const totalLactate = 4.0 + (accumulationRate * durationMinutes);

  return {
    bloodLactateMmol: Math.round(Math.min(18.0, totalLactate) * 10) / 10,
    muscleFatigueIndex: Math.round(Math.min(100, (totalLactate / 14) * 100)),
  };
}
