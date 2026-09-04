export interface AllergenProfile {
  id: string;
  name: string;
  commonSources: string[];
  safeAthleticSubstitutes: string[];
  crossContaminationRisks: string[];
  digestiveImpact: string;
}

export const ALLERGEN_CATALOG: AllergenProfile[] = [
  {
    id: 'gluten',
    name: 'Gluten (Celiac / Non-Celiac Gluten Sensitivity)',
    commonSources: ['Wheat', 'Barley', 'Rye', 'Standard Pasta', 'Pastries'],
    safeAthleticSubstitutes: ['Rolled Oats (Certified GF)', 'Quinoa', 'Brown & White Rice', 'Sweet Potatoes'],
    crossContaminationRisks: ['Shared processing mills', 'Commercial bakery ovens'],
    digestiveImpact: 'Triggers villous atrophy and mucosal inflammation, leading to malabsorption of iron, calcium, and carbohydrates.'
  },
  {
    id: 'lactose',
    name: 'Lactose (Lactase Enzyme Deficiency)',
    commonSources: ['Cow milk', 'Ice cream', 'Soft unaged cheeses', 'Whey concentrate'],
    safeAthleticSubstitutes: ['Almond milk', 'Oat milk', 'Whey Protein Isolate (99% lactose-free)', 'Aged Cheddar'],
    crossContaminationRisks: ['Processed protein snack bars'],
    digestiveImpact: 'Fermentation of undigested disaccharides by colonic bacteria causing bloating, osmotic diarrhea, and abdominal cramping.'
  },
  {
    id: 'soy',
    name: 'Soy (Soybean Proteins)',
    commonSources: ['Soy protein isolate', 'Tofu', 'Soy sauce', 'Processed snack fillers'],
    safeAthleticSubstitutes: ['Pea protein isolate', 'Hemp protein', 'Coconut aminos', 'Pastured poultry'],
    crossContaminationRisks: ['Protein bars', 'Commercial vegetable oil blends'],
    digestiveImpact: 'Allergic IgE-mediated histamine reactions or eosinophilic gastroenteritis in sensitized runners.'
  }
];

export function isItemSafeForDiet(itemName: string, restrictions: string[]): boolean {
  for (const r of restrictions) {
    if (r.toLowerCase() === 'gluten-free' && (itemName.includes('Wheat') || itemName.includes('Barley') || itemName.includes('Rye'))) return false;
    if (r.toLowerCase() === 'dairy-free' && (itemName.includes('Milk') || itemName.includes('Cheese') || itemName.includes('Yogurt'))) return false;
    if (r.toLowerCase() === 'vegan' && (itemName.includes('Chicken') || itemName.includes('Salmon') || itemName.includes('Beef') || itemName.includes('Egg'))) return false;
  }
  return true;
}
