export interface RunningFormEvaluation {
  optimalCadenceRangeSpm: string;
  footstrikeRecommendation: string;
  verticalOscillationTargetCm: string;
  keyFormCues: string[];
}

export function getFormCuesForPace(_paceMinKm: number): RunningFormEvaluation {
  return {
    optimalCadenceRangeSpm: '174 - 182 SPM',
    footstrikeRecommendation: 'Midfoot landing with contact point directly below the center of mass',
    verticalOscillationTargetCm: '6.0 - 8.5 cm (minimize wasted vertical bouncing)',
    keyFormCues: [
      'Gaze 15-20 meters ahead, not straight down at your sneakers.',
      'Slight forward lean originating from the ankles, not bent at the waist.',
      'Relaxed jaw and dropped shoulders; hands cupped loosely like holding a potato chip.',
      'Compact 90-degree arm drive with elbows tracking straight back.',
    ],
  };
}
