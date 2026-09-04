export interface SplitAnalysis {
  isNegativeSplit: boolean;
  firstHalfPaceSec: number;
  secondHalfPaceSec: number;
  paceVarianceIndex: number;
  pacingGrade: 'Masterful (Negative Split)' | 'Even Paced' | 'Positive Split (Started Too Fast)';
}

export function analyzeRunningSplits(splitsSec: number[]): SplitAnalysis {
  if (splitsSec.length < 2) {
    return { isNegativeSplit: false, firstHalfPaceSec: splitsSec[0] || 300, secondHalfPaceSec: splitsSec[0] || 300, paceVarianceIndex: 0, pacingGrade: 'Even Paced' };
  }

  const mid = Math.floor(splitsSec.length / 2);
  const firstHalf = splitsSec.slice(0, mid).reduce((a, b) => a + b, 0) / mid;
  const secondHalf = splitsSec.slice(mid).reduce((a, b) => a + b, 0) / (splitsSec.length - mid);

  const isNeg = secondHalf < firstHalf;
  let grade: 'Masterful (Negative Split)' | 'Even Paced' | 'Positive Split (Started Too Fast)' = 'Even Paced';

  if (secondHalf < firstHalf - 5) grade = 'Masterful (Negative Split)';
  else if (secondHalf > firstHalf + 10) grade = 'Positive Split (Started Too Fast)';

  return {
    isNegativeSplit: isNeg,
    firstHalfPaceSec: Math.round(firstHalf),
    secondHalfPaceSec: Math.round(secondHalf),
    paceVarianceIndex: Math.round(Math.abs(firstHalf - secondHalf)),
    pacingGrade: grade,
  };
}
