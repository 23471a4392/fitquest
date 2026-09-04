export interface CoachPrompt {
  id: string;
  triggerCondition: string;
  category: 'pacing' | 'nutrition' | 'biomechanics' | 'motivation' | 'recovery';
  message: string;
  urgency: 'info' | 'warning' | 'critical';
  actionableStep: string;
}

export const COACH_TRIGGERS: CoachPrompt[] = [
  {
    id: 'trig_high_junk',
    triggerCondition: 'junkCount > 4',
    category: 'nutrition',
    message: 'High sodium and refined sugars are bogging down your digestive tract. Look for crisp apples or hydrating water bottles in the upcoming lanes!',
    urgency: 'warning',
    actionableStep: 'Switch lanes immediately to bypass ultra-processed food traps.'
  },
  {
    id: 'trig_low_energy',
    triggerCondition: 'energy < 25',
    category: 'pacing',
    message: 'Your muscular glycogen reserves are running dangerously low. You are entering the metabolic bonking zone!',
    urgency: 'critical',
    actionableStep: 'Grab the next Water Boost or Super Salad power-up to restore cellular ATP.'
  },
  {
    id: 'trig_good_streak',
    triggerCondition: 'healthyCount >= 8 && junkCount === 0',
    category: 'motivation',
    message: 'Phenomenal nutritional discipline! Your metabolic efficiency is peaking, maximizing speed multiplier bonuses.',
    urgency: 'info',
    actionableStep: 'Maintain this clean fueling streak all the way across the finish line arch.'
  },
  {
    id: 'trig_shield_lost',
    triggerCondition: 'shieldBroken',
    category: 'biomechanics',
    message: 'Your Immune Shield absorbed a heavy obstacle collision. Exercise heightened vigilance for upcoming road hazards!',
    urgency: 'warning',
    actionableStep: 'Prepare your spacebar jump for low hurdles and soda spills.'
  }
];

export function getRealtimeCoachMessage(
  healthyCount: number,
  junkCount: number,
  energy: number,
  _health: number
): CoachPrompt {
  if (energy < 25) return COACH_TRIGGERS[1];
  if (junkCount >= 4) return COACH_TRIGGERS[0];
  if (healthyCount >= 8 && junkCount === 0) return COACH_TRIGGERS[2];
  return {
    id: 'trig_default',
    triggerCondition: 'normal',
    category: 'biomechanics',
    message: 'Maintain an upright posture, drive with the knees, and breathe in rhythmic 3:3 cadence.',
    urgency: 'info',
    actionableStep: 'Keep eyes focused 20 meters ahead down the running track.'
  };
}
