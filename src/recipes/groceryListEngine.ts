export interface CategorizedGroceryList {
  produce: string[];
  proteinAndMeat: string[];
  bulkGrainsAndPantry: string[];
  dairyAndAlternatives: string[];
  supplementsAndHydration: string[];
}

export function generateWeeklyGroceryList(): CategorizedGroceryList {
  return {
    produce: ['Bananas (2 bunches)', 'Wild Blueberries (frozen)', 'Baby Spinach (2 tubs)', 'Broccoli Florets', 'Sweet Potatoes (2kg)', 'Hass Avocados (4)', 'Lemons (4)'],
    proteinAndMeat: ['Wild Salmon Fillets (600g)', 'Free-Range Chicken Breast (1kg)', 'Pasture-Raised Eggs (2 dozen)', 'Firm Organic Tofu (2 packs)'],
    bulkGrainsAndPantry: ['Rolled Oats (1kg)', 'Tri-Color Quinoa (500g)', 'Brown Jasmine Rice (1kg)', 'Chia Seeds', 'Raw Honey', 'Extra Virgin Olive Oil'],
    dairyAndAlternatives: ['Unsweetened Almond Milk (2L)', '0% Greek Yogurt (1kg)'],
    supplementsAndHydration: ['Pure Creatine Monohydrate', 'Whey Isolate Powder', 'Electrolyte Hydration Salts', 'Tart Cherry Extract']
  };
}
