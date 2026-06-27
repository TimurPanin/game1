import Phaser from 'phaser';
import { GAME_WIDTH, PALETTE, HIGH_SCORE_KEY } from '../game/constants';
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

    // Persist high score
    let hi = 0;
    try { hi = parseInt(localStorage.getItem(HIGH_SCORE_KEY) ?? '0', 10) || 0; } catch { /* noop */ }
    const isNewRecord = this.score > hi;
    if (isNewRecord) {
      try { localStorage.setItem(HIGH_SCORE_KEY, String(this.score)); } catch { /* noop */ }
      hi = this.score;
    }

    const g = this.add.graphics();
    g.lineStyle(2, PALETTE.GOLD);
    g.strokeRect(20, 20, GAME_WIDTH - 40, 185);

    this.add
      .text(GAME_WIDTH / 2, 65, 'GAME OVER', {
        fontFamily: 'monospace',
        fontSize: '16px',
        color: '#8b1a1a',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    this.add
      .text(GAME_WIDTH / 2, 98, `SCORE: ${this.score}`, {
        fontFamily: 'monospace',
        fontSize: '10px',
        color: '#f5e6c8',
      })
      .setOrigin(0.5);

    const hiColor = isNewRecord ? '#ffe566' : '#d4a017';
    const hiLabel = isNewRecord ? `NEW RECORD: ${hi}` : `BEST: ${hi}`;
    this.add
      .text(GAME_WIDTH / 2, 114, hiLabel, {
        fontFamily: 'monospace',
        fontSize: '8px',
        color: hiColor,
      })
      .setOrigin(0.5);

    if (isNewRecord) {
      // Blink effect for new record
      const rec = this.add
        .text(GAME_WIDTH / 2, 128, '★ NEW RECORD! ★', {
          fontFamily: 'monospace',
          fontSize: '7px',
          color: '#ffe566',
        })
        .setOrigin(0.5);
      this.tweens.add({ targets: rec, alpha: 0.2, duration: 250, yoyo: true, repeat: -1 });
    }

    const retry = this.add
      .text(GAME_WIDTH / 2, isNewRecord ? 150 : 140, 'ENTER: RETRY', {
        fontFamily: 'monospace',
        fontSize: '8px',
        color: '#d4a017',
      })
      .setOrigin(0.5);

    this.tweens.add({ targets: retry, alpha: 0.3, duration: 500, yoyo: true, repeat: -1 });

    this.add
      .text(GAME_WIDTH / 2, isNewRecord ? 165 : 155, 'ESC: MENU', {
        fontFamily: 'monospace',
        fontSize: '7px',
        color: '#5c3d2e',
      })
      .setOrigin(0.5);

    this.input.keyboard!.once('keydown-ENTER', () => {
      sfx.menuConfirm();
      this.scene.start('GameScene');
      this.scene.launch('UIScene');
    });

    this.input.keyboard!.once('keydown-ESC', () => {
      sfx.menuConfirm();
      this.scene.start('MenuScene');
    });
  }
}
