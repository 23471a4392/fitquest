export interface MicronutrientDetail {
  id: string;
  name: string;
  category: 'vitamin' | 'mineral' | 'antioxidant' | 'electrolyte';
  dailyRecommendedIntake: string;
  upperTolerableLimit: string;
  athleticFunction: string;
  deficiencySymptoms: string[];
  toxicitySymptoms: string[];
  topFoodSources: string[];
  synergisticNutrients: string[];
  antagonisticNutrients: string[];
}

export const MICRONUTRIENTS_CATALOG: MicronutrientDetail[] = [
  {
    id: 'vit_c',
    name: 'Vitamin C (Ascorbic Acid)',
    category: 'vitamin',
    dailyRecommendedIntake: '90 - 200 mg for athletes',
    upperTolerableLimit: '2,000 mg/day',
    athleticFunction: 'Cofactor for prolyl and lysyl hydroxylase, essential for collagen cross-linking in tendons and ligaments subjected to repetitive running impact.',
    deficiencySymptoms: ['Delayed wound healing', 'Joint stiffness', 'Elevated post-exercise oxidative markers', 'Capillary fragility'],
    toxicitySymptoms: ['Gastrointestinal cramping', 'Osmotic diarrhea'],
    topFoodSources: ['Bell peppers', 'Citrus fruits', 'Strawberries', 'Broccoli', 'Kiwi'],
    synergisticNutrients: ['Non-heme Iron (triples absorption)', 'Vitamin E (regenerates alpha-tocopherol)', 'Flavonoids'],
    antagonisticNutrients: ['High-dose Copper in supplement form']
  },
  {
    id: 'vit_d3',
    name: 'Vitamin D3 (Cholecalciferol)',
    category: 'vitamin',
    dailyRecommendedIntake: '2,000 - 5,000 IU for training individuals',
    upperTolerableLimit: '10,000 IU/day',
    athleticFunction: 'Genomic regulator of Type II fast-twitch muscle fiber protein synthesis, calcium absorption, and innate immune defense against upper respiratory tract infections.',
    deficiencySymptoms: ['Stress fracture susceptibility', 'Skeletal muscle weakness', 'Depressed mood', 'Frequent viral illnesses'],
    toxicitySymptoms: ['Hypercalcemia', 'Arterial calcification if unbalanced with Vitamin K2'],
    topFoodSources: ['Wild salmon', 'Pastured egg yolks', 'Sunlight exposure', 'Fortified dairy'],
    synergisticNutrients: ['Vitamin K2 (MK-7)', 'Magnesium (required for 25-hydroxylase enzyme)', 'Calcium'],
    antagonisticNutrients: ['Excessive unbuffered Vitamin A']
  },
  {
    id: 'magnesium',
    name: 'Magnesium (Elemental Mg)',
    category: 'mineral',
    dailyRecommendedIntake: '400 - 500 mg',
    upperTolerableLimit: '350 mg (from supplements, no limit from food)',
    athleticFunction: 'Essential cofactor for over 300 enzymatic reactions, especially ATP-Mg complex formation, muscle relaxation through calcium antagonism, and protein translation.',
    deficiencySymptoms: ['Nocturnal calf cramps', 'Heart palpitations', 'Restless legs', 'Elevated baseline cortisol', 'Reduced anaerobic power'],
    toxicitySymptoms: ['Loose stools (especially from oxide/citrate salts)'],
    topFoodSources: ['Pumpkin seeds', 'Spinach', 'Dark chocolate (85%+)', 'Almonds', 'Black beans'],
    synergisticNutrients: ['Vitamin B6 (enhances cellular uptake)', 'Vitamin D3', 'Potassium'],
    antagonisticNutrients: ['High-dose Calcium (>1000mg single dose)', 'Phytic acid from unsoaked grains']
  },
  {
    id: 'potassium',
    name: 'Potassium (Electrolyte K+)',
    category: 'electrolyte',
    dailyRecommendedIntake: '3,500 - 4,700 mg',
    upperTolerableLimit: 'No defined UL from whole foods',
    athleticFunction: 'Primary intracellular cation establishing the resting membrane potential across myocardial and skeletal muscle fibers, governing excitation-contraction coupling.',
    deficiencySymptoms: ['Muscle twitching and spasms', 'Generalized fatigue', 'Arrhythmias under high cardiac output', 'Decreased glycogen storage'],
    toxicitySymptoms: ['Hyperkalemia in renal impairment'],
    topFoodSources: ['Avocados', 'Bananas', 'Sweet potatoes', 'Coconut water', 'Spinach'],
    synergisticNutrients: ['Sodium (in 2:1 to 3:1 K:Na dietary ratio)', 'Magnesium', 'Water'],
    antagonisticNutrients: ['Excess refined sodium consumption']
  },
  {
    id: 'iron',
    name: 'Iron (Heme & Non-Heme Fe)',
    category: 'mineral',
    dailyRecommendedIntake: '18 mg (men: 8-10mg, endurance women: 18-25mg)',
    upperTolerableLimit: '45 mg/day',
    athleticFunction: 'Central core of hemoglobin (erythrocyte oxygen transport) and myoglobin (intramuscular oxygen storage), plus cytochromes in the electron transport chain.',
    deficiencySymptoms: ['Severe drop in VO2 max', 'Chronic lethargy', 'Cold intolerance', 'Elevated submaximal running heart rate', 'Foot-strike hemolysis'],
    toxicitySymptoms: ['Hemochromatosis', 'Elevated ferritin-induced hepatic oxidative stress'],
    topFoodSources: ['Grass-fed beef', 'Lentils', 'Spinach', 'Pumpkin seeds', 'Oysters'],
    synergisticNutrients: ['Vitamin C (reduces Fe3+ to Fe2+)', 'Copper', 'Vitamin A'],
    antagonisticNutrients: ['Tannins in coffee/black tea', 'Calcium supplements', 'Egg phosvitin']
  },
  {
    id: 'zinc',
    name: 'Zinc (Elemental Zn)',
    category: 'mineral',
    dailyRecommendedIntake: '11 - 15 mg',
    upperTolerableLimit: '40 mg/day',
    athleticFunction: 'Catalytic component of DNA polymerase, superoxide dismutase (SOD1), and carbon anhydrase. Vital for testosterone synthesis and immune T-cell maturation.',
    deficiencySymptoms: ['Impaired post-run tissue healing', 'Loss of taste acuity', 'Frequent skin breakouts', 'Suppressed anabolic hormones'],
    toxicitySymptoms: ['Copper deficiency (via metallothionein upregulation)', 'Nausea'],
    topFoodSources: ['Pumpkin seeds', 'Oysters', 'Beef sirloin', 'Lentils', 'Cashews'],
    synergisticNutrients: ['Animal proteins (cysteine & methionine aid absorption)'],
    antagonisticNutrients: ['High iron ratios (>3:1 Fe:Zn)', 'Phytates in unsprouted legumes']
  }
];

export function getMicronutrientById(id: string): MicronutrientDetail | undefined {
  return MICRONUTRIENTS_CATALOG.find(m => m.id === id);
}

export function getNutrientPairingAdvice(nutrientA: string, nutrientB: string): string {
  if ((nutrientA === 'iron' && nutrientB === 'vit_c') || (nutrientA === 'vit_c' && nutrientB === 'iron')) {
    return 'EXCELLENT SYNERGY: Vitamin C triples non-heme iron bioavailability when consumed together.';
  }
  if ((nutrientA === 'iron' && nutrientB === 'calcium') || (nutrientA === 'calcium' && nutrientB === 'iron')) {
    return 'COMPETITIVE INHIBITION: Calcium competes for DMT-1 transporters. Separate by 2 hours.';
  }
  return 'Standard nutritional compatibility with no major competitive interactions.';
}
