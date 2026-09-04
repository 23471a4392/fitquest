export interface HealthInsight {
  title: string;
  type: 'positive' | 'warning' | 'tip';
  detail: string;
}

export function generateHealthInsights(
  healthyFoodsTotal: number,
  junkFoodsTotal: number,
  distanceCompletedKm: number
): HealthInsight[] {
  const insights: HealthInsight[] = [];
  if (healthyFoodsTotal > junkFoodsTotal * 3) {
    insights.push({
      title: 'High Antioxidant Anti-Inflammatory Buffer',
      type: 'positive',
      detail: 'Your whole-food selections provide ample polyphenol reserves, speeding up muscular glycogen synthesis.'
    });
  }
  if (distanceCompletedKm >= 5.0) {
    insights.push({
      title: 'Cardiovascular Endurance Milestone',
      type: 'positive',
      detail: 'Sustained aerobic volume stimulates capillary angiogenesis around Type I slow-twitch muscle fibers.'
    });
  }
  return insights;
}
