import Phaser from 'phaser';
import { GAME_WIDTH, PALETTE } from '../game/constants';
import { sfx } from '../utils/SfxManager';

export class VictoryScene extends Phaser.Scene {
  private score = 0;

  constructor() {
    super({ key: 'VictoryScene' });
  }

  init(data: { score: number }): void {
    this.score = data.score ?? 0;
  }

  create(): void {
    this.cameras.main.setBackgroundColor(PALETTE.BLACK);
    sfx.victory();

    const g = this.add.graphics();
    g.lineStyle(2, PALETTE.GOLD);
    g.strokeRect(20, 20, GAME_WIDTH - 40, 180);

    this.add
      .text(GAME_WIDTH / 2, 60, 'VICTORY!', {
        fontFamily: 'monospace',
        fontSize: '16px',
        color: '#d4a017',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    this.add
      .text(GAME_WIDTH / 2, 90, 'The Red Dragon is vanquished.\nWisdom prevails.', {
        fontFamily: 'monospace',
        fontSize: '7px',
        color: '#f5e6c8',
        align: 'center',
      })
      .setOrigin(0.5);

    this.add
      .text(GAME_WIDTH / 2, 120, `FINAL SCORE: ${this.score}`, {
        fontFamily: 'monospace',
        fontSize: '10px',
        color: '#f5e6c8',
      })
      .setOrigin(0.5);

    const cont = this.add
      .text(GAME_WIDTH / 2, 155, 'ENTER: MENU', {
        fontFamily: 'monospace',
        fontSize: '8px',
        color: '#d4a017',
      })
      .setOrigin(0.5);

    this.tweens.add({ targets: cont, alpha: 0.3, duration: 500, yoyo: true, repeat: -1 });

    this.input.keyboard!.once('keydown-ENTER', () => {
      sfx.menuConfirm();
      this.scene.stop('UIScene');
      this.scene.start('MenuScene');
    });
  }
}
