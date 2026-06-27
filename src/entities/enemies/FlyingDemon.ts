import Phaser from 'phaser';
import { EnemyBase } from './EnemyBase';

export class FlyingDemon extends EnemyBase {
  private baseY: number;
  private baseX: number;
  private patrol: number;
  private t = 0;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    patrol: number,
    group: Phaser.Physics.Arcade.Group,
  ) {
    super(scene, x, y, 'flying_demon', 'fd_0', 1, group);
    this.baseX = x;
    this.baseY = y;
    this.patrol = patrol;
    (this.sprite.body as Phaser.Physics.Arcade.Body).allowGravity = false;
    this.sprite.setSize(12, 12);
    this.sprite.setOffset(2, 2);
  }

  update(dt: number, _playerX: number, _playerY: number): void {
    if (this.dead) return;
    this.t += dt * 0.003;
    this.sprite.x = this.baseX + Math.sin(this.t) * this.patrol;
    this.sprite.y = this.baseY + Math.sin(this.t * 2) * 12;

    const frame = Math.floor(this.scene.time.now / 300) % 2;
    this.sprite.setTexture('flying_demon', frame === 0 ? 'fd_0' : 'fd_1');
  }
}
