export interface AthleticHabit {
  id: string;
  name: string;
  category: 'hydration' | 'nutrition' | 'sleep' | 'mobility';
  streakDays: number;
  cue: string;
  routine: string;
  reward: string;
}

export const DEFAULT_ATHLETIC_HABITS: AthleticHabit[] = [
  {
    id: 'hab_morning_water',
    name: '500ml Morning Hydration Glass',
    category: 'hydration',
    streakDays: 7,
    cue: 'Immediately upon standing up out of bed',
    routine: 'Drink 500ml room-temperature water with a pinch of mineral salt',
    reward: 'Immediate cognitive clarity and optimal blood plasma volume',
  },
  {
    id: 'hab_post_run_protein',
    name: '30g Post-Run Recovery Protein',
    category: 'nutrition',
    streakDays: 5,
    cue: 'Untying running shoes after a workout',
    routine: 'Blend whey or plant isolate with berries and water',
    reward: 'Halts muscle breakdown and jumpstarts glycogen synthesis',
  },
  {
    id: 'hab_evening_stretch',
    name: '10-Minute Couch Stretch & Foam Roll',
    category: 'mobility',
    streakDays: 12,
    cue: 'Starting evening wind-down routine',
    routine: '2 minutes per hip flexor followed by calf foam rolling',
    reward: 'Pain-free knee joints and deep restorative sleep',
  },
];

export function calculateHabitScore(habits: AthleticHabit[]): number {
  if (habits.length === 0) return 0;
  const totalDays = habits.reduce((acc, h) => acc + h.streakDays, 0);
  return Math.min(100, Math.round((totalDays / (habits.length * 14)) * 100));
}
