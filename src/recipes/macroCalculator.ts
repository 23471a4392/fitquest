export interface MacroTargets {
  dailyCalories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  waterLiters: number;
}

export function calculatePersonalizedMacros(
  weightKg: number,
  goal: 'weight_loss' | 'maintain_weight' | 'fitness' | 'healthy_lifestyle',
  weeklyMileageKm: number
): MacroTargets {
  let baseCal = weightKg * 30;
  if (goal === 'weight_loss') baseCal -= 400;
  if (goal === 'fitness') baseCal += 300;

  // Additional mileage calories: ~65 kcal per km
  const runningCalPerDay = (weeklyMileageKm * 65) / 7;
  const totalCal = Math.round(baseCal + runningCalPerDay);

  // Endurance athletes: 1.6 - 2.0g protein / kg
  const proteinG = Math.round(weightKg * 1.8);
  const fatG = Math.round((totalCal * 0.25) / 9);
  const remainingCalForCarbs = totalCal - (proteinG * 4) - (fatG * 9);
  const carbsG = Math.round(remainingCalForCarbs / 4);

  return {
    dailyCalories: totalCal,
    proteinGrams: proteinG,
    carbsGrams: Math.max(100, carbsG),
    fatGrams: fatG,
    waterLiters: Math.round((weightKg * 0.04) * 10) / 10,
  };
}
