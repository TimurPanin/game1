import Phaser from 'phaser';
import { EnemyBase } from './EnemyBase';

export class Hellhound extends EnemyBase {
  private patrol: number;
  private baseX: number;
  private direction = 1;
  private charging = false;
  private chargeTimer = 0;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    patrol: number,
    group: Phaser.Physics.Arcade.Group,
  ) {
    super(scene, x, y, 'hellhound', 'hh_0', 2, group);
    this.baseX = x;
    this.patrol = patrol;
    this.sprite.setSize(14, 10);
    this.sprite.setOffset(1, 4);
  }

  update(dt: number, playerX: number, playerY: number): void {
    if (this.dead) return;
    const body = this.sprite.body as Phaser.Physics.Arcade.Body;
    const onGround = body.blocked.down;

    if (!this.charging) {
      const dist = Math.abs(playerX - this.sprite.x);
      const sameLevel = Math.abs(playerY - this.sprite.y) < 32;

      if (dist < 120 && sameLevel && onGround) {
        this.charging = true;
        this.chargeTimer = 1500;
        this.direction = playerX > this.sprite.x ? 1 : -1;
      } else {
        this.sprite.setVelocityX(this.direction * 40);
        if (Math.abs(this.sprite.x - this.baseX) > this.patrol) {
          this.direction *= -1;
        }
      }
    } else {
      this.sprite.setVelocityX(this.direction * 120);
      this.chargeTimer -= dt;
      if (this.chargeTimer <= 0) this.charging = false;
    }

    this.sprite.setFlipX(this.direction < 0);
    const frame = Math.floor(this.scene.time.now / 150) % 2;
    this.sprite.setTexture('hellhound', frame === 0 ? 'hh_0' : 'hh_1');
  }
}
