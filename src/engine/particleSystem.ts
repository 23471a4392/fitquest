export interface EngineParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
}

export class ParticleEmitter {
  private particles: EngineParticle[] = [];

  public emit(x: number, y: number, color: string, count = 15): void {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.5 + Math.random() * 4.5;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.2,
        size: 3 + Math.random() * 3,
        color,
        alpha: 1.0,
        life: 0,
        maxLife: 20 + Math.random() * 15,
      });
    }
  }

  public update(dtSeconds: number): void {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx * dtSeconds * 60;
      p.y += p.vy * dtSeconds * 60;
      p.life++;
      p.alpha = 1 - (p.life / p.maxLife);

      if (p.life >= p.maxLife) {
        this.particles.splice(i, 1);
      }
    }
  }

  public getActiveParticles(): EngineParticle[] {
    return this.particles;
  }

  public clear(): void {
    this.particles = [];
  }
}
