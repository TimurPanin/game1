import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, DEPTH } from '../game/constants';

export class UIScene extends Phaser.Scene {
  private livesIcons: Phaser.GameObjects.Image[] = [];
  private scoreText!: Phaser.GameObjects.Text;
  private hitText!: Phaser.GameObjects.Text;
  private muteText!: Phaser.GameObjects.Text;

  constructor() {
    super({ key: 'UIScene' });
  }

  create(): void {
    this.cameras.main.setScroll(0, 0);

    for (let i = 0; i < 3; i++) {
      const icon = this.add
        .image(8 + i * 10, 8, 'monk_icon')
        .setScrollFactor(0)
        .setDepth(DEPTH.UI);
      this.livesIcons.push(icon);
    }

    this.scoreText = this.add
      .text(GAME_WIDTH - 8, 8, '000000', {
        fontFamily: 'monospace',
        fontSize: '8px',
        color: '#d4a017',
      })
      .setOrigin(1, 0)
      .setScrollFactor(0)
      .setDepth(DEPTH.UI);

    this.hitText = this.add
      .text(GAME_WIDTH / 2, 20, '', {
        fontFamily: 'monospace',
        fontSize: '7px',
        color: '#f5e6c8',
      })
      .setOrigin(0.5, 0)
      .setScrollFactor(0)
      .setDepth(DEPTH.UI)
      .setAlpha(0);

    this.muteText = this.add
      .text(GAME_WIDTH - 8, GAME_HEIGHT - 12, '', {
        fontFamily: 'monospace',
        fontSize: '5px',
        color: '#8b1a1a',
      })
      .setOrigin(1, 0)
      .setScrollFactor(0)
      .setDepth(DEPTH.UI);

    const gameScene = this.scene.get('GameScene');
    gameScene.events.on('updateHUD', this.onUpdateHUD, this);
    gameScene.events.on('showHit', this.onShowHit, this);
    gameScene.events.on('muteChanged', this.onMuteChanged, this);

    this.events.on('shutdown', () => {
      gameScene.events.off('updateHUD', this.onUpdateHUD, this);
      gameScene.events.off('showHit', this.onShowHit, this);
      gameScene.events.off('muteChanged', this.onMuteChanged, this);
    });
  }

  private onUpdateHUD(data: { lives: number; score: number }): void {
    this.livesIcons.forEach((icon, i) => {
      icon.setAlpha(i < data.lives ? 1 : 0.2);
    });
    this.scoreText.setText(data.score.toString().padStart(6, '0'));
  }

  private onShowHit(count: number): void {
    if (count < 2) {
      this.hitText.setAlpha(0);
      return;
    }
    this.hitText.setText(`${count} HIT COMBO`);
    this.hitText.setAlpha(1);
    this.tweens.add({
      targets: this.hitText,
      alpha: 0,
      duration: 800,
      delay: 400,
    });
  }

  private onMuteChanged(muted: boolean): void {
    this.muteText.setText(muted ? 'MUTED' : '');
  }
}
