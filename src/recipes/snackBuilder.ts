export interface CustomSnack {
  name: string;
  totalCalories: number;
  totalCarbs: number;
  totalProtein: number;
  portableScore: number;
}

export function buildRunningSnack(baseCarb: string, proteinBoost: string): CustomSnack {
  return {
    name: baseCarb + ' with ' + proteinBoost,
    totalCalories: 210,
    totalCarbs: 32,
    totalProtein: 12,
    portableScore: 95,
  };
}
