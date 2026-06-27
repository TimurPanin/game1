import Phaser from 'phaser';
import { DEPTH } from '../game/constants';

export class JuiceManager {
  private scene: Phaser.Scene;
  private dustEmitter!: Phaser.GameObjects.Particles.ParticleEmitter;
  private sparkEmitter!: Phaser.GameObjects.Particles.ParticleEmitter;
  private emberEmitter!: Phaser.GameObjects.Particles.ParticleEmitter;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.createEmitters();
  }

  private createEmitters(): void {
    this.dustEmitter = this.scene.add.particles(0, 0, 'particle_dust', {
      speed: { min: 10, max: 40 },
      angle: { min: 200, max: 340 },
      scale: { start: 1, end: 0 },
      lifespan: 400,
      quantity: 4,
      emitting: false,
    });
    this.dustEmitter.setDepth(DEPTH.EFFECTS);

    this.sparkEmitter = this.scene.add.particles(0, 0, 'particle_spark', {
      speed: { min: 30, max: 100 },
      angle: { min: 0, max: 360 },
      scale: { start: 1.5, end: 0 },
      lifespan: 300,
      quantity: 8,
      emitting: false,
      blendMode: Phaser.BlendModes.ADD,
    });
    this.sparkEmitter.setDepth(DEPTH.EFFECTS);

    this.emberEmitter = this.scene.add.particles(0, 0, 'particle_ember', {
      speed: { min: 5, max: 20 },
      angle: { min: 250, max: 290 },
      scale: { start: 1, end: 0 },
      lifespan: 600,
      frequency: 200,
      quantity: 1,
      emitting: false,
      blendMode: Phaser.BlendModes.ADD,
    });
    this.emberEmitter.setDepth(DEPTH.EFFECTS);
  }

  screenShake(intensity = 0.005, duration = 100): void {
    this.scene.cameras.main.shake(duration, intensity);
  }

  hitFlash(target: Phaser.GameObjects.Sprite): void {
    target.setTint(0xffffff);
    this.scene.time.delayedCall(80, () => {
      if (target.active) target.clearTint();
    });
  }

  landingDust(x: number, y: number): void {
    this.dustEmitter.emitParticleAt(x, y, 4);
  }

  deathSparks(x: number, y: number): void {
    this.sparkEmitter.emitParticleAt(x, y, 10);
    this.screenShake(0.008, 120);
  }

  crumbleParticles(x: number, y: number): void {
    this.dustEmitter.emitParticleAt(x, y, 12);
    this.screenShake(0.004, 80);
  }

  attachEmbers(target: Phaser.GameObjects.Sprite): Phaser.GameObjects.Particles.ParticleEmitter {
    const emitter = this.scene.add.particles(0, 0, 'particle_ember', {
      follow: target,
      speed: { min: 5, max: 15 },
      scale: { start: 0.8, end: 0 },
      lifespan: 500,
      frequency: 300,
      quantity: 1,
      blendMode: Phaser.BlendModes.ADD,
    });
    emitter.setDepth(DEPTH.EFFECTS);
    return emitter;
  }

  showBossIntro(name: string, onComplete: () => void): void {
    const cam = this.scene.cameras.main;
    const overlay = this.scene.add
      .rectangle(cam.scrollX + cam.width / 2, cam.scrollY + cam.height / 2, cam.width, cam.height, 0x000000, 0.7)
      .setScrollFactor(0)
      .setDepth(DEPTH.OVERLAY);

    const card = this.scene.add
      .text(cam.width / 2, cam.height / 2 - 20, 'WARNING', {
        fontFamily: 'monospace',
        fontSize: '8px',
        color: '#8b1a1a',
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(DEPTH.OVERLAY + 1);

    const bossName = this.scene.add
      .text(cam.width / 2, cam.height / 2, name, {
        fontFamily: 'monospace',
        fontSize: '12px',
        color: '#d4a017',
        fontStyle: 'bold',
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(DEPTH.OVERLAY + 1);

    this.screenShake(0.01, 300);

    this.scene.time.delayedCall(1500, () => {
      overlay.destroy();
      card.destroy();
      bossName.destroy();
      onComplete();
    });
  }
}
