export interface FuelingTimeline {
  hoursBeforeRun: number;
  targetCarbsGrams: number;
  recommendedMeal: string;
  foodsToAvoid: string[];
}

export function getPreRunFuelingTimeline(): FuelingTimeline[] {
  return [
    {
      hoursBeforeRun: 3.0,
      targetCarbsGrams: 80,
      recommendedMeal: 'Oatmeal bowl with banana, honey, and 1 scoop protein powder',
      foodsToAvoid: ['High-fat fried foods', 'Raw cruciferous vegetables (broccoli/cabbage)', 'Heavy cheeses'],
    },
    {
      hoursBeforeRun: 1.0,
      targetCarbsGrams: 30,
      recommendedMeal: '1 Cavendish Banana or 1 slice sourdough with berry jam',
      foodsToAvoid: ['Nuts & seeds (fat delays gastric emptying)', 'Spicy hot sauces'],
    },
    {
      hoursBeforeRun: 0.25,
      targetCarbsGrams: 15,
      recommendedMeal: '150ml Isotonic sports drink or 1 energy chew',
      foodsToAvoid: ['Large volumes of plain cold water (causes sloshing)'],
    },
  ];
}
