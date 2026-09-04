export interface FoodSwapItem {
  unhealthyName: string;
  unhealthyCalories: number;
  healthyAlternative: string;
  healthyCalories: number;
  calorieSavings: number;
  healthUpgradeReason: string;
}

export const HEALTHY_SWAP_DATABASE: FoodSwapItem[] = [
  {
    unhealthyName: 'Deep Fried French Fries (Large)',
    unhealthyCalories: 480,
    healthyAlternative: 'Air-Fried Paprika Sweet Potato Wedges',
    healthyCalories: 160,
    calorieSavings: 320,
    healthUpgradeReason: 'Swaps toxic oxidized cooking oils for beta-carotene and slow-burning complex carbs.'
  },
  {
    unhealthyName: 'Fast Food Bacon Cheeseburger',
    unhealthyCalories: 680,
    healthyAlternative: 'Grilled Turkey & Avocado Sourdough Burger',
    healthyCalories: 380,
    calorieSavings: 300,
    healthUpgradeReason: 'Eliminates 22g saturated fat while delivering lean poultry protein and heart-healthy oleic acid.'
  },
  {
    unhealthyName: 'Commercial Ice Cream Sundae',
    unhealthyCalories: 450,
    healthyAlternative: 'Blended Frozen Banana "Nice Cream" with Berries',
    healthyCalories: 140,
    calorieSavings: 310,
    healthUpgradeReason: 'Zero refined sugars; delivers 400mg potassium and dietary fiber.'
  }
];

export function getSmartSwaps(): FoodSwapItem[] {
  return HEALTHY_SWAP_DATABASE;
}
