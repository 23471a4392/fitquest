export interface SmoothieRecipe {
  id: string;
  name: string;
  type: 'pre_workout_fuel' | 'post_workout_anabolic' | 'anti_inflammatory';
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  ingredients: string[];
  benefits: string;
}

export const PERFORMANCE_SMOOTHIES: SmoothieRecipe[] = [
  {
    id: 'sm_1',
    name: 'Endurance Glycogen Super-Charger',
    type: 'pre_workout_fuel',
    calories: 340,
    proteinGrams: 15,
    carbsGrams: 62,
    fatGrams: 4,
    ingredients: ['1 Cavendish Banana', '1/2 cup Rolled Oats', '1 tbsp Raw Honey', '1 cup Coconut Water', '1/2 scoop Vanilla Whey'],
    benefits: 'Fast and medium-chain carbohydrates for instant endurance ATP output without digestive heaviness.'
  },
  {
    id: 'sm_2',
    name: 'Tart Cherry Antioxidant Recovery Elixir',
    type: 'anti_inflammatory',
    calories: 280,
    proteinGrams: 28,
    carbsGrams: 36,
    fatGrams: 3,
    ingredients: ['1/2 cup Tart Cherry Juice', '1 cup Frozen Blueberries', '1 scoop Whey Isolate', '1 cup Cold Water', '1 tsp Chia Seeds'],
    benefits: 'Proanthocyanidins and whey leucine synergistically shut down muscle soreness and accelerate recovery.'
  }
];

export function getSmoothieById(id: string): SmoothieRecipe | undefined {
  return PERFORMANCE_SMOOTHIES.find(s => s.id === id);
}
