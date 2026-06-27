export class SfxManager {
  private ctx: AudioContext | null = null;
  private muted = false;

  private getContext(): AudioContext {
    if (!this.ctx) {
      this.ctx = new AudioContext();
    }
    return this.ctx;
  }

  toggleMute(): boolean {
    this.muted = !this.muted;
    return this.muted;
  }

  isMuted(): boolean {
    return this.muted;
  }

  resume(): void {
    if (this.ctx?.state === 'suspended') {
      void this.ctx.resume();
    }
  }

  private playTone(
    freq: number,
    duration: number,
    type: OscillatorType = 'square',
    volume = 0.08,
    freqEnd?: number,
  ): void {
    if (this.muted) return;
    const ctx = this.getContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    if (freqEnd) {
      osc.frequency.exponentialRampToValueAtTime(freqEnd, ctx.currentTime + duration);
    }
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  }

  private playNoise(duration: number, volume = 0.06): void {
    if (this.muted) return;
    const ctx = this.getContext();
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    }
    const source = ctx.createBufferSource();
    const gain = ctx.createGain();
    source.buffer = buffer;
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    source.connect(gain);
    gain.connect(ctx.destination);
    source.start();
  }

  jump(): void {
    this.playTone(300, 0.1, 'square', 0.06, 500);
  }

  land(): void {
    this.playTone(150, 0.08, 'triangle', 0.04, 80);
  }

  attack(): void {
    this.playTone(200, 0.06, 'square', 0.05, 100);
  }

  spiritBlast(): void {
    this.playTone(600, 0.15, 'sawtooth', 0.05, 200);
  }

  hit(): void {
    this.playTone(120, 0.1, 'square', 0.07, 60);
  }

  enemyDeath(): void {
    this.playTone(400, 0.12, 'square', 0.06, 80);
    this.playTone(200, 0.15, 'triangle', 0.04, 50);
  }

  pickup(): void {
    this.playTone(800, 0.08, 'square', 0.05);
    this.playTone(1000, 0.1, 'square', 0.04);
  }

  damage(): void {
    this.playTone(100, 0.2, 'sawtooth', 0.08, 50);
  }

  bossRoar(): void {
    this.playNoise(0.4, 0.1);
    this.playTone(80, 0.4, 'sawtooth', 0.08, 40);
  }

  menuConfirm(): void {
    this.playTone(523, 0.08, 'square', 0.06);
    this.playTone(784, 0.12, 'square', 0.06);
  }

  victory(): void {
    const notes = [523, 659, 784, 1047];
    notes.forEach((n, i) => {
      setTimeout(() => this.playTone(n, 0.2, 'square', 0.06), i * 150);
    });
  }

  gameOver(): void {
    const notes = [392, 349, 330, 262];
    notes.forEach((n, i) => {
      setTimeout(() => this.playTone(n, 0.25, 'triangle', 0.06), i * 200);
    });
  }
}

export const sfx = new SfxManager();
