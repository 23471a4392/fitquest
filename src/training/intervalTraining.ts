export interface IntervalProtocol {
  protocolName: string;
  totalIntervals: number;
  workIntervalMinutes: number;
  restIntervalMinutes: number;
  targetIntensityPercentVO2Max: number;
  targetCadenceSpm: number;
  restType: 'active_jog' | 'complete_rest';
}

export const INTERVAL_PROTOCOLS: Record<string, IntervalProtocol> = {
  norwegian_4x4: {
    protocolName: 'Norwegian 4x4 VO2 Max Protocol',
    totalIntervals: 4,
    workIntervalMinutes: 4.0,
    restIntervalMinutes: 3.0,
    targetIntensityPercentVO2Max: 92,
    targetCadenceSpm: 182,
    restType: 'active_jog',
  },
  classic_800s: {
    protocolName: 'Yasso 800m Marathon Predictor Repeats',
    totalIntervals: 8,
    workIntervalMinutes: 3.2,
    restIntervalMinutes: 3.2,
    targetIntensityPercentVO2Max: 88,
    targetCadenceSpm: 180,
    restType: 'active_jog',
  },
  tabata_sprints: {
    protocolName: 'Micro-Burst Anaerobic Tabata',
    totalIntervals: 8,
    workIntervalMinutes: 0.33,
    restIntervalMinutes: 0.17,
    targetIntensityPercentVO2Max: 100,
    targetCadenceSpm: 195,
    restType: 'complete_rest',
  },
};

export function getIntervalDetails(protocolKey: string): IntervalProtocol {
  return INTERVAL_PROTOCOLS[protocolKey] || INTERVAL_PROTOCOLS.norwegian_4x4;
}
