import Phaser from 'phaser';
import { GAME_HEIGHT, DEPTH, PALETTE } from '../game/constants';

export class ParallaxBackground {
  private scene: Phaser.Scene;
  private moon!: Phaser.GameObjects.Image;
  private mountains!: Phaser.GameObjects.TileSprite;
  private wall!: Phaser.GameObjects.TileSprite;
  private fogRects: Phaser.GameObjects.Rectangle[] = [];

  constructor(scene: Phaser.Scene, levelWidth: number) {
    this.scene = scene;
    this.build(levelWidth);
  }

  private build(levelWidth: number): void {
    const sky = this.scene.add
      .rectangle(levelWidth / 2, GAME_HEIGHT / 2, levelWidth, GAME_HEIGHT, PALETTE.BLACK)
      .setDepth(DEPTH.PARALLAX_BACK)
      .setScrollFactor(0);

    this.moon = this.scene.add
      .image(200, 40, 'moon_glow')
      .setDepth(DEPTH.PARALLAX_BACK + 1)
      .setScrollFactor(0.05)
      .setBlendMode(Phaser.BlendModes.ADD);

    this.mountains = this.scene.add
      .tileSprite(0, GAME_HEIGHT - 80, levelWidth, 80, 'parallax_mountains')
      .setOrigin(0, 0)
      .setDepth(DEPTH.PARALLAX_MID)
      .setScrollFactor(0);

    this.wall = this.scene.add
      .tileSprite(0, GAME_HEIGHT - 60, levelWidth, 60, 'parallax_wall')
      .setOrigin(0, 0)
      .setDepth(DEPTH.PARALLAX_FRONT)
      .setScrollFactor(0);

    for (let i = 0; i < 4; i++) {
      const fog = this.scene.add
        .rectangle(
          Phaser.Math.Between(0, levelWidth),
          GAME_HEIGHT - Phaser.Math.Between(40, 100),
          Phaser.Math.Between(40, 80),
          8,
          PALETTE.CREAM,
          0.06,
        )
        .setDepth(DEPTH.PARALLAX_MID + 1)
        .setScrollFactor(0.15 + i * 0.05);

      this.fogRects.push(fog);

      this.scene.tweens.add({
        targets: fog,
        x: fog.x + Phaser.Math.Between(30, 80),
        duration: Phaser.Math.Between(4000, 8000),
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });
    }

    void sky;
  }

  update(cameraScrollX: number): void {
    this.mountains.tilePositionX = cameraScrollX * 0.3;
    this.wall.tilePositionX = cameraScrollX * 0.6;
    this.moon.x = 200 + cameraScrollX * 0.1;
  }
}
