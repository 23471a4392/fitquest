export interface CalorieLogItem {
  timestamp: number;
  distanceKm: number;
  caloriesBurned: number;
  healthyFoodsCount: number;
  junkFoodsCount: number;
  netCalorieSurplusDeficit: number;
}

export function generateCalorieAudit(logs: CalorieLogItem[]): { totalBurned: number; totalDeficit: number } {
  return logs.reduce((acc, l) => {
    acc.totalBurned += l.caloriesBurned;
    acc.totalDeficit += l.netCalorieSurplusDeficit;
    return acc;
  }, { totalBurned: 0, totalDeficit: 0 });
}
