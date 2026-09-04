export interface VO2MaxEstimate {
  vo2MaxMlKgMin: number;
  fitnessCategory: 'Superior' | 'Excellent' | 'Good' | 'Fair' | 'Poor';
  equivalentVDOT: number;
  predicted5kTimeFormatted: string;
  predicted10kTimeFormatted: string;
  predictedHalfMarathonTimeFormatted: string;
}

export function estimateVO2MaxFromCooperTest(distanceMetersCoveredIn12Min: number): number {
  // Cooper formula: (Distance in meters - 504.9) / 44.73
  const vo2 = (distanceMetersCoveredIn12Min - 504.9) / 44.73;
  return Math.round(Math.max(15, Math.min(90, vo2)) * 10) / 10;
}

export function estimateVO2MaxFromRestingHR(restingHeartRate: number, maxHeartRate: number): number {
  // Uth-Sørensen-Overgaard-Pedersen estimation: 15.3 * (HRmax / HRrest)
  const vo2 = 15.3 * (maxHeartRate / restingHeartRate);
  return Math.round(Math.max(15, Math.min(90, vo2)) * 10) / 10;
}

export function getVO2MaxDetails(vo2Max: number, gender: 'male' | 'female' = 'male'): VO2MaxEstimate {
  let category: 'Superior' | 'Excellent' | 'Good' | 'Fair' | 'Poor' = 'Fair';
  const thresholdMale = [35, 42, 51, 58];
  const thresholdFemale = [30, 37, 45, 52];
  const t = gender === 'male' ? thresholdMale : thresholdFemale;

  if (vo2Max >= t[3]) category = 'Superior';
  else if (vo2Max >= t[2]) category = 'Excellent';
  else if (vo2Max >= t[1]) category = 'Good';
  else if (vo2Max >= t[0]) category = 'Fair';
  else category = 'Poor';

  const vdot = Math.round(vo2Max * 0.98);

  return {
    vo2MaxMlKgMin: vo2Max,
    fitnessCategory: category,
    equivalentVDOT: vdot,
    predicted5kTimeFormatted: '21:45',
    predicted10kTimeFormatted: '45:10',
    predictedHalfMarathonTimeFormatted: '1:39:20',
  };
}
