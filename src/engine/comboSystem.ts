export interface ComboState {
  currentStreak: number;
  multiplier: number;
  maxCombo: number;
  lastCollectTimestamp: number;
}

export function updateCombo(state: ComboState, isHealthyPick: boolean): ComboState {
  if (isHealthyPick) {
    const streak = state.currentStreak + 1;
    const mult = 1.0 + Math.floor(streak / 5) * 0.25;
    return {
      currentStreak: streak,
      multiplier: Math.min(3.0, mult),
      maxCombo: Math.max(state.maxCombo, streak),
      lastCollectTimestamp: Date.now(),
    };
  } else {
    // Combo reset on junk food or obstacle collision
    return {
      currentStreak: 0,
      multiplier: 1.0,
      maxCombo: state.maxCombo,
      lastCollectTimestamp: Date.now(),
    };
  }
}
