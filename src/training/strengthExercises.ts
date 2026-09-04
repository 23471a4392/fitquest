export interface StrengthExercise {
  id: string;
  name: string;
  targetMuscles: string[];
  setsAndReps: string;
  coachingCue: string;
  injuryPreventionTarget: string;
}

export const RUNNER_STRENGTH_CIRCUIT: StrengthExercise[] = [
  {
    id: 'str_1',
    name: 'Bulgarian Split Squats',
    targetMuscles: ['Quadriceps', 'Gluteus Medius', 'Hamstrings'],
    setsAndReps: '3 sets of 8-10 reps per leg',
    coachingCue: 'Keep front shin vertical and drive through the whole foot.',
    injuryPreventionTarget: 'Eliminates asymmetrical pelvic drop and stabilizes patellofemoral tracking.'
  },
  {
    id: 'str_2',
    name: 'Single-Leg Romanian Deadlifts',
    targetMuscles: ['Hamstrings', 'Gluteus Maximus', 'Erector Spinae'],
    setsAndReps: '3 sets of 10 reps per leg',
    coachingCue: 'Hinge at the hip while maintaining neutral lumbar spine.',
    injuryPreventionTarget: 'Strengthens posterior chain to reduce hamstring pull risks during speed surges.'
  },
  {
    id: 'str_3',
    name: 'Bent-Knee & Straight-Knee Calf Raises',
    targetMuscles: ['Gastrocnemius', 'Soleus', 'Achilles Tendon'],
    setsAndReps: '4 sets of 15 reps with slow 3-sec eccentric lowering',
    coachingCue: 'Pause at the bottom stretch before explosive upward drive.',
    injuryPreventionTarget: 'Builds Achilles tendon stiffness and wards off plantar fasciitis.'
  },
  {
    id: 'str_4',
    name: 'Side Plank with Top Leg Abduction',
    targetMuscles: ['Gluteus Medius', 'Quadratus Lumborum', 'Obliques'],
    setsAndReps: '3 sets of 30 seconds per side',
    coachingCue: 'Maintain a straight line from ankle to ear without hip sag.',
    injuryPreventionTarget: 'Prevents Iliotibial (IT) Band friction syndrome and excessive knee valgus.'
  }
];

export function getFullStrengthCircuit(): StrengthExercise[] {
  return RUNNER_STRENGTH_CIRCUIT;
}
