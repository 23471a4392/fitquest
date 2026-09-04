export interface HydrationSlot {
  time: string;
  volumeMl: number;
  type: string;
  instructions: string;
}

export function generateDailyHydrationSchedule(_workoutHour = 7): HydrationSlot[] {
  return [
    { time: '06:30 (Wake-up)', volumeMl: 500, type: 'Water + Pinch of Sea Salt', instructions: 'Rehydrate overnight respiratory fluid deficit.' },
    { time: '07:00 - 08:00 (Run)', volumeMl: 500, type: 'Isotonic Electrolyte Drink', instructions: 'Sip 125ml every 15 minutes during training.' },
    { time: '08:30 (Post-Workout)', volumeMl: 500, type: 'Recovery Smoothie / Water', instructions: 'Replace remaining sweat loss.' },
    { time: '11:00 (Mid-Morning)', volumeMl: 400, type: 'Pure Water', instructions: 'Maintain cellular hydration.' },
    { time: '13:00 (Lunch)', volumeMl: 350, type: 'Water with Lemon', instructions: 'Aid digestive enzymatic secretions.' },
    { time: '16:00 (Afternoon)', volumeMl: 400, type: 'Green Tea or Water', instructions: 'Sustain afternoon mental focus.' },
    { time: '19:00 (Dinner)', volumeMl: 350, type: 'Water', instructions: 'Avoid excess fluids right before bed to prevent nocturia.' },
  ];
}
