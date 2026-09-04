export interface RecoveryBowlProtocol {
  distanceCategory: '5k_10k' | 'half_marathon' | 'marathon';
  carbToProteinRatio: '3:1' | '4:1';
  targetCarbsGrams: number;
  targetProteinGrams: number;
  hydrationTargetMl: number;
  suggestedMenu: string;
}

export function getPostWorkoutRefuelPlan(distanceKm: number, weightKg: number): RecoveryBowlProtocol {
  if (distanceKm <= 7) {
    return {
      distanceCategory: '5k_10k',
      carbToProteinRatio: '3:1',
      targetCarbsGrams: Math.round(weightKg * 0.8),
      targetProteinGrams: Math.round(weightKg * 0.3),
      hydrationTargetMl: 600,
      suggestedMenu: 'Greek Yogurt Bowl with Sliced Bananas, Berries, and Chia Seeds',
    };
  } else {
    return {
      distanceCategory: 'half_marathon',
      carbToProteinRatio: '4:1',
      targetCarbsGrams: Math.round(weightKg * 1.2),
      targetProteinGrams: Math.round(weightKg * 0.35),
      hydrationTargetMl: 1000,
      suggestedMenu: 'Grilled Chicken Breast with 2 cups Jasmine Rice, Sweet Potato, and Coconut Water',
    };
  }
}
