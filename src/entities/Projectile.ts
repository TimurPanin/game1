import Phaser from 'phaser';
import { DEPTH } from '../game/constants';

export class Projectile extends Phaser.Physics.Arcade.Sprite {
  private speed = 200;
  private life = 0;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'projectile');
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setDepth(DEPTH.PROJECTILES);
    this.setBlendMode(Phaser.BlendModes.ADD);
    this.body!.setSize(6, 6);
    (this.body as Phaser.Physics.Arcade.Body).allowGravity = false;
    this.setActive(false);
    this.setVisible(false);
  }

  fire(x: number, y: number, direction: number): void {
    this.setActive(true);
    this.setVisible(true);
    this.setPosition(x, y);
    this.setVelocity(direction * this.speed, 0);
    this.life = 1500;
    this.body!.enable = true;
  }

  deactivate(): void {
    this.setActive(false);
    this.setVisible(false);
    this.setVelocity(0, 0);
    this.body!.enable = false;
  }

  update(): void {
    if (!this.active) return;
    this.life -= this.scene.game.loop.delta;
    if (this.life <= 0) this.deactivate();
  }
}
