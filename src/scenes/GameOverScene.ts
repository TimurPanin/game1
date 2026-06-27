import Phaser from 'phaser';
import { GAME_WIDTH, PALETTE } from '../game/constants';
import { sfx } from '../utils/SfxManager';

export class GameOverScene extends Phaser.Scene {
  private score = 0;

  constructor() {
    super({ key: 'GameOverScene' });
  }

  init(data: { score: number }): void {
    this.score = data.score ?? 0;
  }

  create(): void {
    this.cameras.main.setBackgroundColor(PALETTE.BLACK);
    sfx.gameOver();

    const g = this.add.graphics();
    g.lineStyle(2, PALETTE.GOLD);
    g.strokeRect(20, 20, GAME_WIDTH - 40, 180);

    this.add
      .text(GAME_WIDTH / 2, 70, 'GAME OVER', {
        fontFamily: 'monospace',
        fontSize: '16px',
        color: '#8b1a1a',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    this.add
      .text(GAME_WIDTH / 2, 100, `SCORE: ${this.score}`, {
        fontFamily: 'monospace',
        fontSize: '10px',
        color: '#f5e6c8',
      })
      .setOrigin(0.5);

    const retry = this.add
      .text(GAME_WIDTH / 2, 140, 'ENTER: RETRY', {
        fontFamily: 'monospace',
        fontSize: '8px',
        color: '#d4a017',
      })
      .setOrigin(0.5);

    this.tweens.add({ targets: retry, alpha: 0.3, duration: 500, yoyo: true, repeat: -1 });

    this.add
      .text(GAME_WIDTH / 2, 165, 'ESC: MENU', {
        fontFamily: 'monospace',
        fontSize: '7px',
        color: '#5c3d2e',
      })
      .setOrigin(0.5);

    this.input.keyboard!.once('keydown-ENTER', () => {
      sfx.menuConfirm();
      this.scene.stop('UIScene');
      this.scene.start('GameScene');
      this.scene.launch('UIScene');
    });

    this.input.keyboard!.once('keydown-ESC', () => {
      this.scene.stop('UIScene');
      this.scene.start('MenuScene');
    });
  }
}
