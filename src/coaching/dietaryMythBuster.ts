export interface NutritionMyth {
  id: string;
  myth: string;
  truth: string;
  scientificEvidence: string;
}

export const DIETARY_MYTHS: NutritionMyth[] = [
  {
    id: 'myth_1',
    myth: 'Eating carbohydrates after 6:00 PM automatically stores as body fat.',
    truth: 'Total daily energy balance (calories in vs. calories out) and macronutrient quality determine body composition, not clock time.',
    scientificEvidence: 'Glycogen synthase activity remains elevated in endurance athletes in the evening, and nocturnal glycogen storage supports morning workout quality.',
  },
  {
    id: 'myth_2',
    myth: 'Drinking only plain pure water is sufficient for multi-hour marathon runs.',
    truth: 'Excessive plain water during long sweaty runs dilutes plasma sodium, risking life-threatening exercise-associated hyponatremia (EAH).',
    scientificEvidence: 'Athletes sweating >1L/hr require 500-900mg sodium per liter to maintain plasma osmolality and prevent cellular swelling.',
  },
  {
    id: 'myth_3',
    myth: 'Dietary fat makes runners slow and should be eliminated completely.',
    truth: 'Essential fatty acids (Omega-3s and monounsaturated fats) are vital for steroid hormone synthesis, joint lubrication, and cellular membrane integrity.',
    scientificEvidence: 'Low-fat diets (<15% total calories) reduce circulating testosterone and lipophilic vitamin absorption in training runners.',
  },
];

export function getAllDietaryMyths(): NutritionMyth[] {
  return DIETARY_MYTHS;
}
