export interface AntiInflammatoryComponent {
  ingredient: string;
  bioactiveCompound: string;
  cellularMechanism: string;
}

export const ANTI_INFLAMMATORY_COMPONENTS: AntiInflammatoryComponent[] = [
  { ingredient: 'Wild Turmeric Root', bioactiveCompound: 'Curcumin', cellularMechanism: 'Inhibits NF-kB and COX-2 inflammatory enzymes.' },
  { ingredient: 'Fresh Ginger Root', bioactiveCompound: 'Gingerols & Shogaols', cellularMechanism: 'Suppresses prostaglandin and leukotriene synthesis.' },
  { ingredient: 'Extra Virgin Olive Oil', bioactiveCompound: 'Oleocanthal', cellularMechanism: 'Acts via pharmacological mechanisms similar to ibuprofen.' },
  { ingredient: 'Wild Blueberries', bioactiveCompound: 'Anthocyanins', cellularMechanism: 'Scavenges reactive oxygen species produced in muscle mitochondria.' }
];

export function getAntiInflammatoryScore(ingredients: string[]): number {
  let score = 50;
  for (const ing of ingredients) {
    if (ing.includes('Turmeric') || ing.includes('Ginger') || ing.includes('Blueberries') || ing.includes('Salmon')) {
      score += 15;
    }
  }
  return Math.min(100, score);
}
