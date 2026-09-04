export interface RecoveryScoreResult {
  score: number; // 0 - 100
  readinessState: 'Peak Readiness' | 'Optimal Training' | 'Caution / Deload' | 'Full Rest Required';
  recommendedSessionType: string;
  factors: {
    sleepScore: number;
    hrvScore: number;
    muscleSorenessScore: number;
    trainingLoadScore: number;
  };
}

export function computeDailyRecoveryScore(
  sleepHours: number,
  sleepQuality1To10: number,
  restingHRDeltaBpm: number,
  soreness1To10: number,
  acuteLoadRatio: number
): RecoveryScoreResult {
  const sleepComp = Math.min(100, (sleepHours / 8.5) * 60 + (sleepQuality1To10 * 4));
  const hrComp = Math.max(0, 100 - Math.abs(restingHRDeltaBpm) * 8);
  const sorenessComp = Math.max(0, 100 - (soreness1To10 * 9));
  const loadComp = acuteLoadRatio <= 1.2 ? 95 : acuteLoadRatio <= 1.4 ? 70 : 40;

  const totalScore = Math.round((sleepComp * 0.35) + (hrComp * 0.25) + (sorenessComp * 0.20) + (loadComp * 0.20));

  let state: 'Peak Readiness' | 'Optimal Training' | 'Caution / Deload' | 'Full Rest Required' = 'Optimal Training';
  let session = 'Standard aerobic progression run with strides';

  if (totalScore >= 85) {
    state = 'Peak Readiness';
    session = 'High-intensity interval repeats or lactate tempo workout';
  } else if (totalScore >= 65) {
    state = 'Optimal Training';
    session = 'Moderate aerobic base mileage or steady long run';
  } else if (totalScore >= 45) {
    state = 'Caution / Deload';
    session = 'Easy Zone 1 active recovery flush or foam rolling';
  } else {
    state = 'Full Rest Required';
    session = 'Complete rest day with nutrient-dense anti-inflammatory meals';
  }

  return {
    score: totalScore,
    readinessState: state,
    recommendedSessionType: session,
    factors: {
      sleepScore: Math.round(sleepComp),
      hrvScore: Math.round(hrComp),
      muscleSorenessScore: Math.round(sorenessComp),
      trainingLoadScore: Math.round(loadComp),
    },
  };
}
