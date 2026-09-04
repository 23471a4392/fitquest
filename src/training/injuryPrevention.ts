export interface InjuryGuide {
  injuryName: string;
  commonCauses: string[];
  earlyWarningSigns: string[];
  rehabActions: string[];
  returnToRunRule: string;
}

export const INJURY_PREVENTION_GUIDES: InjuryGuide[] = [
  {
    injuryName: 'Patellofemoral Pain Syndrome (Runner Knee)',
    commonCauses: ['Weak gluteus medius', 'Excessive overstriding with low cadence (<160 spm)', 'Sudden mileage ramp >15%/week'],
    earlyWarningSigns: ['Dull ache around patella going down stairs', 'Stiffness after prolonged sitting'],
    rehabActions: ['Increase running cadence by 5-8%', 'Strengthen quadriceps VMO and hip abductors', 'Foam roll IT band & quads'],
    returnToRunRule: 'Run only on flat soft terrain if pain remains below 2 out of 10 during and 24 hours post-run.'
  },
  {
    injuryName: 'Medial Tibial Stress Syndrome (Shin Splints)',
    commonCauses: ['Excessive pronation on hard concrete', 'Worn out running shoes (>600km)', 'Tight soleus and calf complex'],
    earlyWarningSigns: ['Tenderness along lower two-thirds of inner shin bone during early minutes of a run'],
    rehabActions: ['Strengthen tibialis anterior with toe raises', 'Switch to softer trail surfaces', 'Ice massage 10 mins post-run'],
    returnToRunRule: 'Zero focal bone point-tenderness to firm palpation before resuming tempo intervals.'
  },
  {
    injuryName: 'Plantar Fasciitis',
    commonCauses: ['Tight calves pulling on calcaneus', 'Sudden transition to zero-drop minimalist shoes without transition'],
    earlyWarningSigns: ['Sharp stabbing heel pain during first morning steps out of bed'],
    rehabActions: ['Roll arch over frozen water bottle', 'Toe scrunches with towel', 'Eccentric calf drops on step edge'],
    returnToRunRule: 'Morning first-step pain must be completely absent for 3 consecutive days.'
  }
];

export function getInjuryGuide(injuryName: string): InjuryGuide | undefined {
  return INJURY_PREVENTION_GUIDES.find(g => g.injuryName.toLowerCase().includes(injuryName.toLowerCase()));
}
