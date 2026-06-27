import Phaser from 'phaser';
import { DEPTH } from '../game/constants';
import { JuiceManager } from '../systems/JuiceManager';
import { sfx } from '../utils/SfxManager';
import type { Damageable } from '../systems/CombatManager';

export class BossStub implements Damageable {
  sprite: Phaser.Physics.Arcade.Sprite;
  private scene: Phaser.Scene;
  private juice: JuiceManager;
  private hp = 8;
  private dead = false;
  private slamTimer = 2000;
  private direction = -1;
  private onDefeated: () => void;
  private shockwave!: Phaser.GameObjects.Zone;
  private shockwaveActive = false;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    group: Phaser.Physics.Arcade.Group,
    juice: JuiceManager,
    onDefeated: () => void,
  ) {
    this.scene = scene;
    this.juice = juice;
    this.onDefeated = onDefeated;

    this.sprite = group.create(x, y, 'boss', 'boss_0') as Phaser.Physics.Arcade.Sprite;
    this.sprite.setDepth(DEPTH.ENEMIES);
    this.sprite.setData('damageable', this);
    this.sprite.setCollideWorldBounds(true);
    this.sprite.setSize(24, 28);
    this.sprite.setOffset(4, 4);
    this.sprite.setFlipX(true);

    this.shockwave = scene.add.zone(x, y + 16, 80, 16).setDepth(DEPTH.EFFECTS);
    scene.physics.add.existing(this.shockwave, false);
    const swBody = this.shockwave.body as Phaser.Physics.Arcade.Body;
    swBody.setAllowGravity(false);
    swBody.enable = false;
  }

  takeDamage(amount: number, knockbackX = 0): void {
    if (this.dead) return;
    this.hp -= amount;
    this.sprite.setVelocityX(knockbackX * 0.3);
    if (this.hp <= 0) this.die();
  }

  isDead(): boolean {
    return this.dead;
  }

  private die(): void {
    this.dead = true;
    this.juice.deathSparks(this.sprite.x, this.sprite.y);
    this.juice.screenShake(0.015, 400);
    sfx.enemyDeath();
    this.scene.tweens.add({
      targets: this.sprite,
      alpha: 0,
      y: this.sprite.y - 20,
      duration: 500,
      onComplete: () => {
        this.sprite.destroy();
        this.shockwave.destroy();
        this.onDefeated();
      },
    });
  }

  update(dt: number, playerX: number): void {
    if (this.dead) return;

    this.sprite.setVelocityX(this.direction * 30);
    if (this.sprite.x < playerX - 60) this.direction = 1;
    if (this.sprite.x > playerX + 60) this.direction = -1;
    this.sprite.setFlipX(this.direction < 0);

    const frame = Math.floor(this.scene.time.now / 400) % 2;
    this.sprite.setTexture('boss', frame === 0 ? 'boss_0' : 'boss_1');

    this.slamTimer -= dt;
    if (this.slamTimer <= 0) {
      this.performSlam();
      this.slamTimer = 3000;
    }

    this.shockwave.setPosition(this.sprite.x, this.sprite.y + 14);
  }

  private performSlam(): void {
    sfx.bossRoar();
    this.juice.screenShake(0.012, 250);
    this.shockwaveActive = true;
    (this.shockwave.body as Phaser.Physics.Arcade.Body).enable = true;
    this.scene.time.delayedCall(300, () => {
      this.shockwaveActive = false;
      (this.shockwave.body as Phaser.Physics.Arcade.Body).enable = false;
    });
  }

  isShockwaveActive(): boolean {
    return this.shockwaveActive;
  }

  getShockwaveZone(): Phaser.GameObjects.Zone {
    return this.shockwave;
  }
}
