export interface EnergyBiteRecipe {
  name: string;
  makesCount: number;
  caloriesPerBite: number;
  carbsPerBite: number;
  proteinPerBite: number;
  shelfLifeDays: number;
  ingredients: string[];
}

export const HOMEMADE_ENERGY_BITES: EnergyBiteRecipe = {
  name: 'No-Bake Medjool Date & Chia Running Power Bites',
  makesCount: 12,
  caloriesPerBite: 95,
  carbsPerBite: 16,
  proteinPerBite: 3.5,
  shelfLifeDays: 14,
  ingredients: [
    '10 Pitted Medjool Dates',
    '1/2 cup Rolled Oats',
    '2 tbsp Chia Seeds',
    '2 tbsp Natural Almond Butter',
    '1 tbsp Raw Cacao Powder',
    'Pinch of Himalayan Pink Salt'
  ]
};

export function getEnergyBiteRecipe(): EnergyBiteRecipe {
  return HOMEMADE_ENERGY_BITES;
}
