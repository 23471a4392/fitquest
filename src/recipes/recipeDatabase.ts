export interface Recipe {
  id: string;
  title: string;
  category: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'smoothie';
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  fiberGrams: number;
  idealTiming: 'pre_run' | 'post_run' | 'recovery' | 'anytime';
  ingredients: string[];
  instructions: string[];
  athleticBenefits: string[];
}

export const ATHLETIC_RECIPES: Recipe[] = [
  {
    id: 'rec_1',
    title: 'High-Performance Power Oatmeal Bowl',
    category: 'breakfast',
    prepTimeMinutes: 5,
    cookTimeMinutes: 5,
    servings: 1,
    calories: 420,
    proteinGrams: 22,
    carbsGrams: 64,
    fatGrams: 9,
    fiberGrams: 11,
    idealTiming: 'pre_run',
    ingredients: [
      '1 cup Rolled Whole Oats',
      '1 scoop Vanilla Whey or Plant Protein Isolate',
      '1/2 cup Fresh Wild Blueberries',
      '1 tbsp Chia Seeds',
      '1 tbsp Pure Raw Honey',
      '1 cup Unsweetened Almond Milk'
    ],
    instructions: [
      'Simmer rolled oats in almond milk over medium heat for 4-5 minutes.',
      'Remove from heat and vigorously whisk in protein powder until silky.',
      'Top with wild blueberries, chia seeds, and a drizzle of honey.',
      'Serve warm 90 minutes before prolonged tempo runs.'
    ],
    athleticBenefits: [
      'Beta-glucan soluble fiber delivers stable glucose for 3+ hours.',
      'Chia seeds hold 10x their weight in water, supporting hydration.',
      'Blueberry anthocyanins suppress running exercise oxidative damage.'
    ]
  },
  {
    id: 'rec_2',
    title: 'Post-Run Wild Salmon Quinoa Recovery Bowl',
    category: 'dinner',
    prepTimeMinutes: 10,
    cookTimeMinutes: 15,
    servings: 1,
    calories: 580,
    proteinGrams: 42,
    carbsGrams: 52,
    fatGrams: 22,
    fiberGrams: 8,
    idealTiming: 'post_run',
    ingredients: [
      '180g Wild Sockeye Salmon Fillet',
      '1 cup Cooked Tri-Color Quinoa',
      '2 cups Steamed Baby Spinach & Broccoli',
      '1/2 Hass Avocado sliced',
      '1 tbsp Extra Virgin Olive Oil & Lemon Dressing',
      'Pinch of Flaky Sea Salt & Black Pepper'
    ],
    instructions: [
      'Pan-sear salmon in olive oil for 4 minutes per side until flaky.',
      'Warm cooked quinoa and toss with steamed greens.',
      'Plate quinoa base, place salmon on top, and garnish with sliced avocado.',
      'Drizzle with fresh lemon juice and sea salt.'
    ],
    athleticBenefits: [
      'High EPA/DHA Omega-3s accelerate muscle membrane repair.',
      'Quinoa provides complete amino acid profile for tissue reconstruction.',
      'Spinach nitrates facilitate post-workout blood flow and lactate clearance.'
    ]
  },
  {
    id: 'rec_3',
    title: 'Grilled Herb Chicken with Sweet Potato Mash',
    category: 'lunch',
    prepTimeMinutes: 10,
    cookTimeMinutes: 20,
    servings: 1,
    calories: 520,
    proteinGrams: 46,
    carbsGrams: 58,
    fatGrams: 10,
    fiberGrams: 7,
    idealTiming: 'post_run',
    ingredients: [
      '200g Lean Chicken Breast',
      '1 Large Roasted Sweet Potato (mashed)',
      '1 cup Steamed Green Asparagus',
      '1 tsp Rosemary, Thyme, & Minced Garlic',
      '1 tsp Olive Oil'
    ],
    instructions: [
      'Marinate chicken breast with herbs, garlic, and olive oil.',
      'Grill or bake at 200°C (400°F) for 18 minutes until juicy.',
      'Mash roasted sweet potato with a pinch of salt.',
      'Serve chicken sliced over sweet potato with tender asparagus spears.'
    ],
    athleticBenefits: [
      '31g bioavailable leucine-dense protein triggers muscle synthesis.',
      'Complex sweet potato starches reload depleted liver & muscle glycogen.',
      'Asparagine supports renal fluid balance and electrolyte equilibrium.'
    ]
  }
];

export function getRecipeById(id: string): Recipe | undefined {
  return ATHLETIC_RECIPES.find(r => r.id === id);
}

export function filterRecipesByTiming(timing: 'pre_run' | 'post_run' | 'recovery' | 'anytime'): Recipe[] {
  return ATHLETIC_RECIPES.filter(r => r.idealTiming === timing);
}
