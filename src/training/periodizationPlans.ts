export interface TrainingWeek {
  weekNumber: number;
  phase: 'Base Phase' | 'Build Phase' | 'Peak Phase' | 'Taper Phase';
  weeklyMileageKm: number;
  keyWorkouts: string[];
  focus: string;
}

export interface PeriodizedPlan {
  planName: string;
  targetRace: '5K' | '10K' | 'Half Marathon' | 'Marathon';
  totalWeeks: number;
  weeks: TrainingWeek[];
}

export function generate12WeekPlan(targetRace: '5K' | '10K' | 'Half Marathon' | 'Marathon'): PeriodizedPlan {
  const weeks: TrainingWeek[] = [];
  const baseMileage = targetRace === '5K' ? 18 : targetRace === '10K' ? 30 : 45;

  for (let w = 1; w <= 12; w++) {
    let phase: 'Base Phase' | 'Build Phase' | 'Peak Phase' | 'Taper Phase' = 'Base Phase';
    let multiplier = 1.0 + (w * 0.06);

    if (w <= 4) phase = 'Base Phase';
    else if (w <= 8) phase = 'Build Phase';
    else if (w <= 10) phase = 'Peak Phase';
    else {
      phase = 'Taper Phase';
      multiplier = 0.7 - (w - 11) * 0.2;
    }

    // Cutback week on week 4 and 8
    if (w === 4 || w === 8) multiplier *= 0.78;

    weeks.push({
      weekNumber: w,
      phase,
      weeklyMileageKm: Math.round(baseMileage * multiplier),
      keyWorkouts: [
        'Tuesday: Threshold Tempo Intervals',
        'Thursday: Aerobic Cadence Run with Strides',
        'Sunday: Progressive Long Run',
      ],
      focus: phase === 'Base Phase' ? 'Mitochondrial density and aerobic efficiency' : phase === 'Build Phase' ? 'Lactate threshold and VO2 max stamina' : phase === 'Peak Phase' ? 'Race pace specificity and mental resilience' : 'Supercompensation and glycogen topping',
    });
  }

  return {
    planName: targetRace + ' Championship 12-Week Blueprint',
    targetRace,
    totalWeeks: 12,
    weeks,
  };
}
