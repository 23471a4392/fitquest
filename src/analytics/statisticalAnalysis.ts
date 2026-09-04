export function computePaceStandardDeviation(splitsSeconds: number[]): number {
  if (splitsSeconds.length < 2) return 0;
  const mean = splitsSeconds.reduce((a, b) => a + b, 0) / splitsSeconds.length;
  const variance = splitsSeconds.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / (splitsSeconds.length - 1);
  return Math.round(Math.sqrt(variance) * 10) / 10;
}

export function computePercentileRank(score: number, allScores: number[]): number {
  if (allScores.length === 0) return 100;
  const lowerCount = allScores.filter(s => s < score).length;
  return Math.round((lowerCount / allScores.length) * 100);
}
