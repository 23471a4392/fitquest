export interface MentalStrategy {
  strategyName: string;
  technique: string;
  whenToUse: string;
  psychologicalMechanism: string;
}

export const MENTAL_TOUGHNESS_STRATEGIES: MentalStrategy[] = [
  {
    strategyName: 'Segmenting (Chunking)',
    technique: 'Break the remaining 5K race into five distinct 1-kilometer milestones. Focus only on the current 1,000 meters.',
    whenToUse: 'When the full race distance feels overwhelming at mid-point.',
    psychologicalMechanism: 'Reduces cognitive load and perceived effort by contracting attentional focus.',
  },
  {
    strategyName: 'Cognitive Reframing of Discomfort',
    technique: 'Label burning quads not as pain, but as "lactate supercompensation and aerobic adaptation taking place right now".',
    whenToUse: 'During high-intensity hill climbs and tempo surges.',
    psychologicalMechanism: 'Shifts threat perception to challenge perception, lowering autonomic stress reactivity.',
  },
  {
    strategyName: 'Associative Sensory Monitoring',
    technique: 'Systematically scan form: Relax jaw -> Drop shoulders -> Check footstrike cadence -> Regulate 2:2 breathing.',
    whenToUse: 'When fatigue begins causing form breakdown in the final 2 kilometers.',
    psychologicalMechanism: 'Diverts focus from fatigue signals to biomechanical efficiency cues.',
  },
];

export function getMentalStrategy(index = 0): MentalStrategy {
  return MENTAL_TOUGHNESS_STRATEGIES[index % MENTAL_TOUGHNESS_STRATEGIES.length];
}
