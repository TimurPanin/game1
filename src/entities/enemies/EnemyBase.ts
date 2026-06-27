import Phaser from 'phaser';
import { DEPTH } from '../../game/constants';
import type { Damageable } from '../../systems/CombatManager';

export abstract class EnemyBase implements Damageable {
  sprite: Phaser.Physics.Arcade.Sprite;
  protected scene: Phaser.Scene;
  protected hp: number;
  protected dead = false;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    frame: string,
    hp: number,
    group: Phaser.Physics.Arcade.Group,
  ) {
    this.scene = scene;
    this.hp = hp;

    this.sprite = group.create(x, y, texture, frame) as Phaser.Physics.Arcade.Sprite;
    this.sprite.setDepth(DEPTH.ENEMIES);
    this.sprite.setData('damageable', this);
    this.sprite.setCollideWorldBounds(true);
    this.sprite.setBounce(0);
  }

  takeDamage(amount: number, knockbackX = 0): void {
    if (this.dead) return;
    this.hp -= amount;
    this.sprite.setVelocityX(knockbackX);
    if (this.hp <= 0) this.die();
  }

  isDead(): boolean {
    return this.dead;
  }

  protected die(): void {
    this.dead = true;
    this.sprite.setVelocity(0, 0);
    this.sprite.body!.enable = false;
    this.scene.tweens.add({
      targets: this.sprite,
      alpha: 0,
      scaleX: 1.5,
      scaleY: 1.5,
      duration: 200,
      onComplete: () => this.sprite.destroy(),
    });
  }

  abstract update(dt: number, playerX: number, playerY: number): void;
}
