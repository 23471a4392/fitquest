export function predictNextMonthWeight(currentWeightKg: number, targetWeightKg: number, weeklyDeficitCalories: number): number {
  // 1 kg body fat ~ 7700 kcal
  const weeklyFatLossKg = weeklyDeficitCalories / 7700;
  const fourWeeksLoss = weeklyFatLossKg * 4;
  
  if (currentWeightKg > targetWeightKg) {
    return Math.max(targetWeightKg, Math.round((currentWeightKg - fourWeeksLoss) * 10) / 10);
  } else {
    return Math.min(targetWeightKg, Math.round((currentWeightKg + fourWeeksLoss) * 10) / 10);
  }
}
