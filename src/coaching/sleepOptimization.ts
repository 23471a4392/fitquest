export interface SleepProtocol {
  optimalBedtime: string;
  targetDurationHours: number;
  sleepHygieneChecklist: { rule: string; rationale: string }[];
  supplementsForSleep: string[];
}

export function generateSleepProtocol(trainingLoadHigh = true): SleepProtocol {
  return {
    optimalBedtime: '22:15 - 22:45',
    targetDurationHours: trainingLoadHigh ? 8.5 : 7.5,
    sleepHygieneChecklist: [
      { rule: 'Darkness: 100% Blackout curtains or sleep mask', rationale: 'Suppresses pineal gland light leakage, maximizing endogenous melatonin secretion.' },
      { rule: 'Room Temperature: 18°C (65°F)', rationale: 'Core body temperature must drop by ~1°C to initiate deep slow-wave stage 3 sleep.' },
      { rule: 'Caffeine Curfew: 10 hours before bed', rationale: 'Adenosine receptor blockade has a 5-7 hour half-life, fragmenting REM architecture.' },
      { rule: 'Blue Light Filter: No screens 60 mins before sleep', rationale: 'Short-wavelength blue light suppresses melatonin release for up to 3 hours.' },
    ],
    supplementsForSleep: [
      'Magnesium Bisglycinate (300mg)',
      'L-Theanine (200mg)',
      'Tart Cherry Juice Extract (500mg)',
    ],
  };
}
