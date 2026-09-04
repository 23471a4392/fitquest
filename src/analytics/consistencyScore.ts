export function calculateWeeklyConsistencyScore(runDaysCountInWeek: number, targetDays = 4): number {
  const pct = (runDaysCountInWeek / targetDays) * 100;
  return Math.min(100, Math.round(pct));
}
