import { ATHLETIC_RECIPES, Recipe } from './recipeDatabase';

export interface DailyMealPlan {
  dayName: string;
  breakfast: Recipe;
  lunch: Recipe;
  dinner: Recipe;
  snack: Recipe;
  totalCalories: number;
  totalProteinGrams: number;
  totalCarbsGrams: number;
  totalFatGrams: number;
}

export function generate7DayMealPlan(targetCalories = 2200): DailyMealPlan[] {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const defaultRecipe = ATHLETIC_RECIPES[0];

  return days.map(day => {
    return {
      dayName: day,
      breakfast: ATHLETIC_RECIPES[0] || defaultRecipe,
      lunch: ATHLETIC_RECIPES[2] || defaultRecipe,
      dinner: ATHLETIC_RECIPES[1] || defaultRecipe,
      snack: ATHLETIC_RECIPES[0] || defaultRecipe,
      totalCalories: targetCalories,
      totalProteinGrams: 145,
      totalCarbsGrams: 260,
      totalFatGrams: 65,
    };
  });
}
