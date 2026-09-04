export interface TrainingLoadAudit {
  acuteLoadKm: number; // last 7 days
  chronicLoadKm: number; // average of last 28 days
  acwrRatio: number; // Acute to Chronic Workload Ratio
  injuryRiskStatus: 'Safe Sweet Spot' | 'Under-training' | 'Elevated Risk' | 'High Danger Zone';
  recommendedAdjustment: string;
}

export function evaluateACWR(past7DaysMileageKm: number, past28DaysAverageWeeklyMileageKm: number): TrainingLoadAudit {
  const acwr = past28DaysAverageWeeklyMileageKm > 0 ? past7DaysMileageKm / past28DaysAverageWeeklyMileageKm : 1.0;
  const roundedAcwr = Math.round(acwr * 100) / 100;

  let status: 'Safe Sweet Spot' | 'Under-training' | 'Elevated Risk' | 'High Danger Zone' = 'Safe Sweet Spot';
  let adj = 'Maintain current progressive overload structure (+5-8% next week).';

  if (roundedAcwr < 0.8) {
    status = 'Under-training';
    adj = 'Mileage dropped significantly. Gradually build back volume to maintain cardiovascular conditioning.';
  } else if (roundedAcwr >= 0.8 && roundedAcwr <= 1.3) {
    status = 'Safe Sweet Spot';
    adj = 'Optimal zone for fitness adaptations while keeping injury risks minimal.';
  } else if (roundedAcwr > 1.3 && roundedAcwr <= 1.5) {
    status = 'Elevated Risk';
    adj = 'Workload spike detected. Cap weekly mileage increase and schedule an active recovery session.';
  } else {
    status = 'High Danger Zone';
    adj = 'Critical workload jump (>1.5 ACWR). High risk of stress fractures. Reduce mileage by 25% immediately.';
  }

  return {
    acuteLoadKm: past7DaysMileageKm,
    chronicLoadKm: past28DaysAverageWeeklyMileageKm,
    acwrRatio: roundedAcwr,
    injuryRiskStatus: status,
    recommendedAdjustment: adj,
  };
}
