export interface MobilityFlow {
  id: string;
  name: string;
  timing: 'pre_run_dynamic' | 'post_run_static';
  durationMinutes: number;
  movements: { name: string; duration: string; focus: string }[];
}

export const RUNNING_MOBILITY_FLOWS: MobilityFlow[] = [
  {
    id: 'dynamic_warmup',
    name: '5-Minute Dynamic Neural Activation Flow',
    timing: 'pre_run_dynamic',
    durationMinutes: 5,
    movements: [
      { name: 'Forward & Lateral Leg Swings', duration: '15 swings/leg', focus: 'Hip capsule active range' },
      { name: 'Walking Lunges with Thoracic Twist', duration: '10 reps/side', focus: 'Hip flexors & spine rotation' },
      { name: 'Ankle Circles & Heel-Toe Walks', duration: '30 seconds', focus: 'Ankle joint synovia lubrication' },
      { name: 'A-Skips & Butt Kicks', duration: '30 seconds', focus: 'Neuromuscular cadence activation' },
    ],
  },
  {
    id: 'post_run_recovery',
    name: '10-Minute Post-Run Myofascial Release Flow',
    timing: 'post_run_static',
    durationMinutes: 10,
    movements: [
      { name: 'Couch Stretch (Hip Flexor & Quad)', duration: '2 mins/side', focus: 'Psoas and rectus femoris elongation' },
      { name: 'Pigeon Pose (Glute & Piriformis)', duration: '90 secs/side', focus: 'Deep hip external rotators' },
      { name: 'Downward Dog with Calf Pedals', duration: '90 seconds', focus: 'Achilles and plantar fascia stretch' },
      { name: 'Childs Pose with Lat Reach', duration: '2 minutes', focus: 'Parasympathetic down-regulation' },
    ],
  },
];

export function getMobilityFlow(type: 'pre_run_dynamic' | 'post_run_static'): MobilityFlow {
  return RUNNING_MOBILITY_FLOWS.find(f => f.timing === type) || RUNNING_MOBILITY_FLOWS[0];
}
