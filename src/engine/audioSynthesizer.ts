export class AlgorithmicSoundEngine {
  private ctx: AudioContext | null = null;

  private init(): void {
    if (!this.ctx) {
      const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (Ctx) this.ctx = new Ctx();
    }
  }

  public playTone(frequency: number, durationSeconds: number, type: OscillatorType = 'sine', volume = 0.2): void {
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(frequency, now);

    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + durationSeconds);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + durationSeconds + 0.05);
  }

  public playSpeedBoostChord(): void {
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.3, 'triangle', 0.15), i * 50);
    });
  }
}

export const algorithmicAudio = new AlgorithmicSoundEngine();
