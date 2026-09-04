export interface WorkoutStep {
  name: string;
  durationMinutes: number;
  distanceMeters?: number;
  targetHeartRateZone: 1 | 2 | 3 | 4 | 5;
  targetPaceDescription: string;
  instructions: string;
}

export type WorkoutCategory = 'recovery' | 'base' | 'tempo' | 'intervals' | 'long_run' | 'hills';

export interface GeneratedWorkout {
  id: string;
  title: string;
  category: WorkoutCategory;
  totalDurationMinutes: number;
  estimatedDistanceKm: number;
  difficultyScore: number;
  description: string;
  warmup: WorkoutStep[];
  mainSet: WorkoutStep[];
  cooldown: WorkoutStep[];
  coachingTips: string[];
}

export function generatePersonalizedWorkout(
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced',
  goalDistanceKm: number,
  targetType: 'endurance' | 'speed' | 'fat_burn' | 'recovery'
): GeneratedWorkout {
  let title = 'Aerobic Base Run';
  let cat: WorkoutCategory = 'base';
  let duration = 40;
  let dist = 5.0;

  if (targetType === 'recovery') {
    title = 'Gentle Recovery Flush Jog';
    cat = 'recovery';
    duration = 30;
    dist = 3.5;
  } else if (targetType === 'speed') {
    title = 'VO2 Max 800m Track Repeats';
    cat = 'intervals';
    duration = 50;
    dist = 7.0;
  } else if (targetType === 'fat_burn') {
    title = 'Lactate Threshold Tempo Run';
    cat = 'tempo';
    duration = 45;
    dist = 6.0;
  } else if (goalDistanceKm >= 10) {
    title = 'Progressive Long Run';
    cat = 'long_run';
    duration = 75;
    dist = 12.0;
  }

  let targetHRZone: 1 | 2 | 3 | 4 | 5 = 2;
  if (cat === 'intervals') targetHRZone = 4;
  else if (cat === 'tempo') targetHRZone = 3;

  return {
    id: 'wo_' + Date.now(),
    title,
    category: cat,
    totalDurationMinutes: duration,
    estimatedDistanceKm: dist,
    difficultyScore: fitnessLevel === 'advanced' ? 8 : fitnessLevel === 'intermediate' ? 6 : 4,
    description: 'Scientifically structured running session targeting optimal cardiovascular adaptations.',
    warmup: [
      {
        name: 'Dynamic Leg Swings & High Knees',
        durationMinutes: 5,
        targetHeartRateZone: 1,
        targetPaceDescription: 'Brisk Walk',
        instructions: 'Activate glutes, hamstrings, and calves through progressive range of motion.',
      },
      {
        name: 'Easy Aerobic Shuffle',
        durationMinutes: 10,
        targetHeartRateZone: 2,
        targetPaceDescription: 'Conversational Pace',
        instructions: 'Gradually raise core body temperature and prime muscle elasticity.',
      },
    ],
    mainSet: [
      {
        name: 'Target Pace Running Block',
        durationMinutes: duration - 20,
        distanceMeters: dist * 1000 * 0.7,
        targetHeartRateZone: targetHRZone,
        targetPaceDescription: cat === 'intervals' ? '5K Race Pace' : 'Aerobic Endurance Pace',
        instructions: 'Maintain upright posture, quick 175-180 spm cadence, and relaxed shoulders.',
      },
    ],
    cooldown: [
      {
        name: 'Easy Jog to Walk',
        durationMinutes: 5,
        targetHeartRateZone: 1,
        targetPaceDescription: 'Very Slow Walk',
        instructions: 'Facilitate venous blood return and metabolize residual lactate.',
      },
    ],
    coachingTips: [
      'Focus on midfoot landing underneath your center of gravity.',
      'Breathe rhythmically with a 3:3 or 2:2 footstrike pattern.',
      'Sip 150ml water immediately following cooldown.',
    ],
  };
}
