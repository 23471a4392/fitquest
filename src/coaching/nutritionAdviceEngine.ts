export interface NutritionDiagnostic {
  goalAlignmentScore: number; // 0 - 100
  keyObservations: string[];
  recommendedMacroSplit: { proteinPct: number; carbsPct: number; fatsPct: number };
  dailyCalorieGuideline: string;
  smartFoodSwaps: { unhealthyChoice: string; superiorSwap: string; reason: string }[];
}

export function generateNutritionDiagnostic(
  fitnessGoal: 'weight_loss' | 'maintain_weight' | 'fitness' | 'healthy_lifestyle',
  healthyFoodsCount: number,
  junkFoodsCount: number,
  currentWeightKg: number
): NutritionDiagnostic {
  const total = healthyFoodsCount + junkFoodsCount;
  const healthyRatio = total > 0 ? healthyFoodsCount / total : 1.0;
  const score = Math.round(healthyRatio * 100);

  let macros = { proteinPct: 30, carbsPct: 45, fatsPct: 25 };
  let calories = Math.round(currentWeightKg * 28) + ' - ' + Math.round(currentWeightKg * 32) + ' kcal/day';

  if (fitnessGoal === 'weight_loss') {
    macros = { proteinPct: 35, carbsPct: 35, fatsPct: 30 };
    calories = Math.round(currentWeightKg * 22) + ' - ' + Math.round(currentWeightKg * 25) + ' kcal/day';
  } else if (fitnessGoal === 'fitness') {
    macros = { proteinPct: 25, carbsPct: 55, fatsPct: 20 };
    calories = Math.round(currentWeightKg * 34) + ' - ' + Math.round(currentWeightKg * 38) + ' kcal/day';
  }

  const observations: string[] = [];
  if (healthyRatio >= 0.8) {
    observations.push('Outstanding micronutrient density: High antioxidant status supports rapid post-workout mitochondrial recovery.');
  } else if (healthyRatio >= 0.5) {
    observations.push('Moderate balance: Consider replacing processed mid-run snacks with whole-food options like bananas and oats.');
  } else {
    observations.push('Excessive ultra-processed intake: Elevated sodium and refined sugars are contributing to reactive insulin crashes.');
  }

  const swaps = [
    { unhealthyChoice: 'Sugary Carbonated Soda', superiorSwap: 'Sparkling Mineral Water with Fresh Lime', reason: 'Eliminates 39g empty liquid sugars while supplying natural electrolyte magnesium.' },
    { unhealthyChoice: 'Deep-Fried Potato Chips', superiorSwap: 'Roasted Lightly Salted Edamame', reason: 'Replaces oxidized trans fats with 14g complete plant protein and dietary fiber.' },
    { unhealthyChoice: 'Glazed Frosted Donut', superiorSwap: 'Oatmeal with Blueberries & Chia Seeds', reason: 'Replaces simple glucose spike with 3 hours of sustained slow-burning beta-glucans.' }
  ];

  return {
    goalAlignmentScore: score,
    keyObservations: observations,
    recommendedMacroSplit: macros,
    dailyCalorieGuideline: calories,
    smartFoodSwaps: swaps,
  };
}
