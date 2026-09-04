import { COMPREHENSIVE_FRUITS } from './fruits';
import { COMPREHENSIVE_VEGETABLES } from './vegetables';
import { COMPREHENSIVE_PROTEINS } from './proteins';
import { COMPREHENSIVE_GRAINS } from './grains';
import { COMPREHENSIVE_JUNK_FOODS } from './junkFoods';
import { COMPREHENSIVE_BEVERAGES } from './beverages';

export * from './fruits';
export * from './vegetables';
export * from './proteins';
export * from './grains';
export * from './junkFoods';
export * from './beverages';
export * from './supplements';
export * from './micronutrients';
export * from './foodInteractions';
export * from './sportsFueling';
export * from './allergens';

export interface UniversalFoodItem {
  id: string;
  name: string;
  category: string;
  emoji: string;
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  fiberGrams: number;
  sodiumMg: number;
  potassiumMg: number;
  sportsNutritionScore: number;
  recommendedTiming: string;
  isHealthy: boolean;
}

export const ALL_NUTRITION_ITEMS: UniversalFoodItem[] = [
  ...COMPREHENSIVE_FRUITS.map(f => ({ id: f.id, name: f.name, category: 'Fruits', emoji: f.emoji, calories: f.calories, proteinGrams: f.proteinGrams, carbsGrams: f.carbsGrams, fatGrams: f.fatGrams, fiberGrams: f.fiberGrams, sodiumMg: f.sodiumMg, potassiumMg: f.potassiumMg, sportsNutritionScore: f.sportsNutritionScore, recommendedTiming: f.recommendedTiming, isHealthy: true })),
  ...COMPREHENSIVE_VEGETABLES.map(v => ({ id: v.id, name: v.name, category: 'Vegetables', emoji: v.emoji, calories: v.calories, proteinGrams: v.proteinGrams, carbsGrams: v.carbsGrams, fatGrams: v.fatGrams, fiberGrams: v.fiberGrams, sodiumMg: v.sodiumMg, potassiumMg: v.potassiumMg, sportsNutritionScore: v.sportsNutritionScore, recommendedTiming: v.recommendedTiming, isHealthy: true })),
  ...COMPREHENSIVE_PROTEINS.map(p => ({ id: p.id, name: p.name, category: 'Proteins', emoji: p.emoji, calories: p.calories, proteinGrams: p.proteinGrams, carbsGrams: p.carbsGrams, fatGrams: p.fatGrams, fiberGrams: p.fiberGrams, sodiumMg: p.sodiumMg, potassiumMg: p.potassiumMg, sportsNutritionScore: p.sportsNutritionScore, recommendedTiming: p.recommendedTiming, isHealthy: true })),
  ...COMPREHENSIVE_GRAINS.map(g => ({ id: g.id, name: g.name, category: 'Grains', emoji: g.emoji, calories: g.calories, proteinGrams: g.proteinGrams, carbsGrams: g.carbsGrams, fatGrams: g.fatGrams, fiberGrams: g.fiberGrams, sodiumMg: g.sodiumMg, potassiumMg: g.potassiumMg, sportsNutritionScore: g.sportsNutritionScore, recommendedTiming: g.recommendedTiming, isHealthy: true })),
  ...COMPREHENSIVE_JUNK_FOODS.map(j => ({ id: j.id, name: j.name, category: 'Junk Food', emoji: j.emoji, calories: j.calories, proteinGrams: j.proteinGrams, carbsGrams: j.carbsGrams, fatGrams: j.fatGrams, fiberGrams: j.fiberGrams, sodiumMg: j.sodiumMg, potassiumMg: j.potassiumMg, sportsNutritionScore: j.sportsNutritionScore, recommendedTiming: 'avoid', isHealthy: false })),
  ...COMPREHENSIVE_BEVERAGES.map(b => ({ id: b.id, name: b.name, category: 'Beverages', emoji: b.emoji, calories: b.calories, proteinGrams: b.proteinGrams, carbsGrams: b.carbsGrams, fatGrams: b.fatGrams, fiberGrams: b.fiberGrams, sodiumMg: b.sodiumMg, potassiumMg: b.potassiumMg, sportsNutritionScore: b.sportsNutritionScore, recommendedTiming: b.recommendedTiming, isHealthy: true }))
];

export function searchFoods(query: string, maxResults = 20): UniversalFoodItem[] {
  const q = query.toLowerCase().trim();
  if (!q) return ALL_NUTRITION_ITEMS.slice(0, maxResults);
  return ALL_NUTRITION_ITEMS.filter(item => item.name.toLowerCase().includes(q) || item.category.toLowerCase().includes(q)).slice(0, maxResults);
}

export function getFoodsByCategory(category: string): UniversalFoodItem[] {
  return ALL_NUTRITION_ITEMS.filter(item => item.category.toLowerCase() === category.toLowerCase());
}
