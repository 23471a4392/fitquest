export interface FuelingProtocol {
  phase: 'pre_event' | 'intra_event' | 'post_event' | 'daily_maintenance';
  timeframe: string;
  carbTargetGramsPerKg: number;
  proteinTargetGramsPerKg: number;
  hydrationMlPerHour: number;
  electrolyteSodiumMgPerHour: number;
  suggestedFoods: string[];
  scientificRationale: string;
}

export const SPORTS_FUELING_PROTOCOLS: Record<string, FuelingProtocol> = {
  short_tempo_5k: {
    phase: 'pre_event',
    timeframe: '60-90 mins before',
    carbTargetGramsPerKg: 0.5,
    proteinTargetGramsPerKg: 0.1,
    hydrationMlPerHour: 400,
    electrolyteSodiumMgPerHour: 150,
    suggestedFoods: ['1 Cavendish Banana', '1 Slice Sourdough with Honey', 'Water'],
    scientificRationale: 'Short fast running relies primarily on liver and muscle glycogen. Minimal fat and fiber prevents GI distress under high-intensity anaerobic threshold work.'
  },
  endurance_half_marathon: {
    phase: 'intra_event',
    timeframe: 'Every 35-45 mins during',
    carbTargetGramsPerKg: 0.8,
    proteinTargetGramsPerKg: 0.0,
    hydrationMlPerHour: 650,
    electrolyteSodiumMgPerHour: 450,
    suggestedFoods: ['Electrolyte Energy Gel (2:1 Glucose:Fructose)', 'Isotonic sports drink'],
    scientificRationale: 'Dual-transporter carbohydrate blend (SGLT1 and GLUT5) bypasses intestinal saturation, oxidizing up to 90g of exogenous carbs per hour.'
  },
  post_run_anabolic_window: {
    phase: 'post_event',
    timeframe: 'Within 45 mins post-run',
    carbTargetGramsPerKg: 1.0,
    proteinTargetGramsPerKg: 0.35,
    hydrationMlPerHour: 800,
    electrolyteSodiumMgPerHour: 500,
    suggestedFoods: ['Whey Isolate Shake with Blueberries and Tart Cherry', 'Chicken Rice Bowl'],
    scientificRationale: 'Insulin-independent GLUT4 translocation peaks within 45 minutes of exercise cessation. High-glycemic carbs paired with fast leucine-rich protein rapidly restore glycogen and halt muscle proteolysis.'
  }
};

export function getFuelingRecommendation(distanceKm: number, userWeightKg: number): { carbsNeededGrams: number; waterMl: number; sodiumMg: number; strategy: string } {
  if (distanceKm <= 5) {
    return {
      carbsNeededGrams: Math.round(userWeightKg * 0.5),
      waterMl: 450,
      sodiumMg: 200,
      strategy: 'Light fast-acting pre-run fuel. No in-run calories required. Focus on post-run hydration.'
    };
  } else if (distanceKm <= 10) {
    return {
      carbsNeededGrams: Math.round(userWeightKg * 0.8),
      waterMl: 650,
      sodiumMg: 350,
      strategy: 'Pre-run complex carbs 2 hours prior. Optional mid-run electrolyte hydration at 5km marker.'
    };
  } else {
    return {
      carbsNeededGrams: Math.round(userWeightKg * 1.5),
      waterMl: 1200,
      sodiumMg: 750,
      strategy: 'High carbohydrate loading protocol. Take 30-60g carbs per hour during the run with consistent sodium intake.'
    };
  }
}
