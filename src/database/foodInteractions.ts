export interface FoodInteractionRule {
  id: string;
  combinationName: string;
  primaryFood: string;
  companionFood: string;
  effectType: 'synergistic' | 'inhibitory' | 'protective';
  metabolicMechanism: string;
  athleticRecommendation: string;
}

export const FOOD_INTERACTIONS: FoodInteractionRule[] = [
  {
    id: 'int_1',
    combinationName: 'Oatmeal + Blueberries + Chia Seeds',
    primaryFood: 'Rolled Oats',
    companionFood: 'Wild Blueberries & Chia Seeds',
    effectType: 'synergistic',
    metabolicMechanism: 'Soluble beta-glucans combine with hydrophilic chia mucilage to slow gastric emptying, while anthocyanins reduce postprandial glycemic excursions.',
    athleticRecommendation: 'Prime pre-long-run breakfast consumed 90 to 120 minutes prior to departure.'
  },
  {
    id: 'int_2',
    combinationName: 'Spinach + Lemon Juice',
    primaryFood: 'Spinach',
    companionFood: 'Lemon / Citrus',
    effectType: 'synergistic',
    metabolicMechanism: 'Citric and ascorbic acids reduce ferric iron (Fe3+) into the absorbable ferrous (Fe2+) state, preventing iron-deficiency anemia in high-mileage runners.',
    athleticRecommendation: 'Dress raw or lightly steamed greens with fresh lemon juice.'
  },
  {
    id: 'int_3',
    combinationName: 'Turmeric + Black Pepper + Olive Oil',
    primaryFood: 'Turmeric',
    companionFood: 'Black Pepper & Healthy Fats',
    effectType: 'synergistic',
    metabolicMechanism: 'Piperine in black pepper inhibits hepatic and intestinal glucuronidation of curcumin, elevating systemic bioavailability by up to 2000%.',
    athleticRecommendation: 'Consume in post-workout anti-inflammatory recovery bowls.'
  },
  {
    id: 'int_4',
    combinationName: 'Coffee + High-Calcium Dairy with Iron Meal',
    primaryFood: 'Steak / Lentil Iron Bowl',
    companionFood: 'Coffee / Dairy Latte',
    effectType: 'inhibitory',
    metabolicMechanism: 'Chlorogenic acid polyphenols and casein-bound calcium bind iron ions in the gut lumen, reducing iron absorption by up to 60%.',
    athleticRecommendation: 'Delay espresso or milky coffee by 60-90 minutes following iron-rich meals.'
  },
  {
    id: 'int_5',
    combinationName: 'Grilled Meats + Rosemary & Garlic Marinade',
    primaryFood: 'Grilled Chicken / Beef',
    companionFood: 'Rosemary / Garlic Extract',
    effectType: 'protective',
    metabolicMechanism: 'Rosmarinic acid and organosulfur compounds block the formation of heterocyclic amines (HCAs) and polycyclic aromatic hydrocarbons during high-heat grilling.',
    athleticRecommendation: 'Always marinate athletic grilling meats with rosemary, thyme, and garlic.'
  }
];

export function checkFoodCombination(foodA: string, foodB: string): FoodInteractionRule | undefined {
  return FOOD_INTERACTIONS.find(
    rule => (rule.primaryFood.toLowerCase().includes(foodA.toLowerCase()) && rule.companionFood.toLowerCase().includes(foodB.toLowerCase())) ||
            (rule.primaryFood.toLowerCase().includes(foodB.toLowerCase()) && rule.companionFood.toLowerCase().includes(foodA.toLowerCase()))
  );
}
