import Phaser from 'phaser';
import { EnemyBase } from './EnemyBase';

export class Imp extends EnemyBase {
  private hopTimer = 0;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    group: Phaser.Physics.Arcade.Group,
  ) {
    super(scene, x, y, 'imp', 'imp_0', 1, group);
    this.sprite.setSize(10, 12);
    this.sprite.setOffset(3, 2);
    this.hopTimer = 800;
  }

  update(dt: number, playerX: number, _playerY: number): void {
    if (this.dead) return;
    const body = this.sprite.body as Phaser.Physics.Arcade.Body;
    const onGround = body.blocked.down;

    this.hopTimer -= dt;
    if (onGround && this.hopTimer <= 0) {
      const dir = playerX > this.sprite.x ? 1 : -1;
      this.sprite.setVelocity(dir * 60, -200);
      this.hopTimer = 1200;
    }

    this.sprite.setFlipX(playerX < this.sprite.x);
    const frame = body.velocity.y < 0 ? 1 : 0;
    this.sprite.setTexture('imp', frame === 0 ? 'imp_0' : 'imp_1');
  }
}
