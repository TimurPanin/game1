import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, PALETTE } from '../game/constants';
import { sfx } from '../utils/SfxManager';

export class MenuScene extends Phaser.Scene {
  private blinkText!: Phaser.GameObjects.Text;

  constructor() {
    super({ key: 'MenuScene' });
  }

  create(): void {
    this.cameras.main.setBackgroundColor(PALETTE.BLACK);

    this.drawCartridgeFrame();

    this.add
      .text(GAME_WIDTH / 2, 50, 'LEGEND OF THE', {
        fontFamily: 'monospace',
        fontSize: '10px',
        color: '#d4a017',
      })
      .setOrigin(0.5);

    this.add
      .text(GAME_WIDTH / 2, 68, 'RED DRAGON', {
        fontFamily: 'monospace',
        fontSize: '14px',
        color: '#f5e6c8',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    this.add
      .text(GAME_WIDTH / 2, 100, '© 1994 RED DRAGON SOFTWARE', {
        fontFamily: 'monospace',
        fontSize: '6px',
        color: '#8b1a1a',
      })
      .setOrigin(0.5);

    this.add
      .text(GAME_WIDTH / 2, 130, 'A monk walks the Great Wall...\nDemons await in the dusk.', {
        fontFamily: 'monospace',
        fontSize: '7px',
        color: '#f5e6c8',
        align: 'center',
      })
      .setOrigin(0.5);

    this.blinkText = this.add
      .text(GAME_WIDTH / 2, 175, 'PRESS ENTER TO START', {
        fontFamily: 'monospace',
        fontSize: '8px',
        color: '#d4a017',
      })
      .setOrigin(0.5);

    this.tweens.add({
      targets: this.blinkText,
      alpha: 0.2,
      duration: 600,
      yoyo: true,
      repeat: -1,
    });

    this.add
      .text(GAME_WIDTH / 2, 220, 'ARROWS: MOVE  Z: JUMP  X: ATTACK  M: MUTE', {
        fontFamily: 'monospace',
        fontSize: '5px',
        color: '#5c3d2e',
      })
      .setOrigin(0.5);

    const start = () => {
      sfx.resume();
      sfx.menuConfirm();
      this.scene.start('GameScene');
      this.scene.launch('UIScene');
    };

    this.input.keyboard!.once('keydown-ENTER', start);
    this.input.keyboard!.once('keydown-SPACE', start);

    this.input.keyboard!.on('keydown-M', () => {
      const muted = sfx.toggleMute();
      this.cameras.main.flash(100, muted ? 80 : 0, 0, 0);
    });
  }

  private drawCartridgeFrame(): void {
    const g = this.add.graphics();
    g.lineStyle(2, PALETTE.GOLD);
    g.strokeRect(20, 20, GAME_WIDTH - 40, GAME_HEIGHT - 40);
    g.lineStyle(1, PALETTE.DARK_RED);
    g.strokeRect(24, 24, GAME_WIDTH - 48, GAME_HEIGHT - 48);

    g.fillStyle(PALETTE.DARK_RED, 0.3);
    g.fillRect(30, 30, GAME_WIDTH - 60, 16);
  }
}
