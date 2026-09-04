export class FixedTimestepLoop {
  private isRunning = false;
  private lastTime = 0;
  private accumulatedTime = 0;
  private readonly fixedDt = 1 / 60; // 60 updates per second
  private updateFn: (dt: number) => void;
  private renderFn: (interpolation: number) => void;

  constructor(update: (dt: number) => void, render: (interpolation: number) => void) {
    this.updateFn = update;
    this.renderFn = render;
  }

  public start(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastTime = performance.now();
    this.loop = this.loop.bind(this);
    requestAnimationFrame(this.loop);
  }

  public stop(): void {
    this.isRunning = false;
  }

  private loop(now: number): void {
    if (!this.isRunning) return;

    let delta = (now - this.lastTime) / 1000;
    this.lastTime = now;
    if (delta > 0.25) delta = 0.25; // prevent spiral of death

    this.accumulatedTime += delta;
    while (this.accumulatedTime >= this.fixedDt) {
      this.updateFn(this.fixedDt);
      this.accumulatedTime -= this.fixedDt;
    }

    const interpolation = this.accumulatedTime / this.fixedDt;
    this.renderFn(interpolation);

    requestAnimationFrame(this.loop);
  }
}
