import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, DEPTH, MONK_HP_PER_LIFE, MONK_MAX_LIVES, PHYSICS } from '../game/constants';

export class UIScene extends Phaser.Scene {
  private livesIcons: Phaser.GameObjects.Image[] = [];
  private scoreText!: Phaser.GameObjects.Text;
  private hitText!: Phaser.GameObjects.Text;
  private muteText!: Phaser.GameObjects.Text;
  private fpsText!: Phaser.GameObjects.Text;

  // HP bar
  private hpBarBg!: Phaser.GameObjects.Graphics;
  private hpBarFill!: Phaser.GameObjects.Graphics;
  private currentHpRatio = 1;
  private targetHpRatio = 1;
  private currentLives = MONK_MAX_LIVES;

  // Spirit cooldown gauge
  private spiritGaugeBg!: Phaser.GameObjects.Graphics;
  private spiritGaugeFill!: Phaser.GameObjects.Graphics;
  private spiritGaugeLabel!: Phaser.GameObjects.Text;

  constructor() {
    super({ key: 'UIScene' });
  }

  create(): void {
    this.cameras.main.setScroll(0, 0);

    // Lives icons
    for (let i = 0; i < MONK_MAX_LIVES; i++) {
      const icon = this.add
        .image(8 + i * 10, 8, 'monk_icon')
        .setScrollFactor(0)
        .setDepth(DEPTH.UI);
      this.livesIcons.push(icon);
    }

    // HP bar — sits right below the life icons
    const HP_BAR_X = 6;
    const HP_BAR_Y = 17;
    const HP_BAR_W = 30;
    const HP_BAR_H = 3;

    this.hpBarBg = this.add.graphics().setScrollFactor(0).setDepth(DEPTH.UI);
    this.hpBarBg.fillStyle(0x2a2a2a, 1);
    this.hpBarBg.fillRect(HP_BAR_X, HP_BAR_Y, HP_BAR_W, HP_BAR_H);

    this.hpBarFill = this.add.graphics().setScrollFactor(0).setDepth(DEPTH.UI);
    this._drawHpBar(HP_BAR_X, HP_BAR_Y, HP_BAR_W, HP_BAR_H, 1);

    // Spirit gauge — bottom-left corner
    const SG_X = 6;
    const SG_Y = GAME_HEIGHT - 10;
    const SG_W = 28;
    const SG_H = 3;

    this.spiritGaugeBg = this.add.graphics().setScrollFactor(0).setDepth(DEPTH.UI);
    this.spiritGaugeBg.fillStyle(0x2a2a2a, 1);
    this.spiritGaugeBg.fillRect(SG_X, SG_Y, SG_W, SG_H);

    this.spiritGaugeFill = this.add.graphics().setScrollFactor(0).setDepth(DEPTH.UI);

    this.spiritGaugeLabel = this.add
      .text(SG_X, SG_Y - 7, 'SP', {
        fontFamily: 'monospace',
        fontSize: '5px',
        color: '#ffe566',
      })
      .setScrollFactor(0)
      .setDepth(DEPTH.UI);

    // Score
    this.scoreText = this.add
      .text(GAME_WIDTH - 8, 8, '000000', {
        fontFamily: 'monospace',
        fontSize: '8px',
        color: '#d4a017',
      })
      .setOrigin(1, 0)
      .setScrollFactor(0)
      .setDepth(DEPTH.UI);

    // Combo hit text
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

    // Mute indicator
    this.muteText = this.add
      .text(GAME_WIDTH - 8, GAME_HEIGHT - 12, '', {
        fontFamily: 'monospace',
        fontSize: '5px',
        color: '#8b1a1a',
      })
      .setOrigin(1, 0)
      .setScrollFactor(0)
      .setDepth(DEPTH.UI);

    // FPS counter (top-right, below score)
    this.fpsText = this.add
      .text(GAME_WIDTH - 8, 18, '', {
        fontFamily: 'monospace',
        fontSize: '5px',
        color: '#5c3d2e',
      })
      .setOrigin(1, 0)
      .setScrollFactor(0)
      .setDepth(DEPTH.UI);

    const gameScene = this.scene.get('GameScene');
    gameScene.events.on('updateHUD', this.onUpdateHUD, this);
    gameScene.events.on('showHit', this.onShowHit, this);
    gameScene.events.on('muteChanged', this.onMuteChanged, this);
    gameScene.events.on('updateSpirit', this.onUpdateSpirit, this);

    this.events.on('shutdown', () => {
      gameScene.events.off('updateHUD', this.onUpdateHUD, this);
      gameScene.events.off('showHit', this.onShowHit, this);
      gameScene.events.off('muteChanged', this.onMuteChanged, this);
      gameScene.events.off('updateSpirit', this.onUpdateSpirit, this);
    });
  }

  private _drawHpBar(x: number, y: number, w: number, h: number, ratio: number): void {
    this.hpBarFill.clear();
    // Color transitions: green -> yellow -> red
    let color: number;
    if (ratio > 0.6) color = 0x43aa22;
    else if (ratio > 0.3) color = 0xd4a017;
    else color = 0x8b1a1a;
    this.hpBarFill.fillStyle(color, 1);
    this.hpBarFill.fillRect(x, y, Math.max(1, Math.round(w * ratio)), h);
  }

  update(): void {
    // Smooth HP bar drain animation
    const HP_BAR_X = 6;
    const HP_BAR_Y = 17;
    const HP_BAR_W = 30;
    const HP_BAR_H = 3;

    if (Math.abs(this.currentHpRatio - this.targetHpRatio) > 0.005) {
      this.currentHpRatio += (this.targetHpRatio - this.currentHpRatio) * 0.12;
      this._drawHpBar(HP_BAR_X, HP_BAR_Y, HP_BAR_W, HP_BAR_H, this.currentHpRatio);
    }

    // FPS
    const fps = Math.round(this.game.loop.actualFps);
    this.fpsText.setText(`${fps}fps`);
  }

  private onUpdateHUD(data: { lives: number; score: number; hp: number; maxHp: number }): void {
    this.currentLives = data.lives;
    this.livesIcons.forEach((icon, i) => {
      icon.setAlpha(i < data.lives ? 1 : 0.2);
    });
    this.scoreText.setText(data.score.toString().padStart(6, '0'));

    // Target HP ratio across all lives: (lives-1)*maxHp + hp) / (maxLives*maxHp)
    const totalMax = MONK_MAX_LIVES * (data.maxHp ?? MONK_HP_PER_LIFE);
    const totalCurrent = (data.lives - 1) * (data.maxHp ?? MONK_HP_PER_LIFE) + (data.hp ?? data.maxHp ?? MONK_HP_PER_LIFE);
    this.targetHpRatio = Math.max(0, Math.min(1, totalCurrent / totalMax));
  }

  private onUpdateSpirit(data: { cooldownRatio: number }): void {
    const SG_X = 6;
    const SG_Y = GAME_HEIGHT - 10;
    const SG_W = 28;
    const SG_H = 3;
    const readyRatio = 1 - data.cooldownRatio;
    this.spiritGaugeFill.clear();
    const color = data.cooldownRatio > 0 ? 0x5c3d2e : 0xffe566;
    this.spiritGaugeFill.fillStyle(color, 1);
    this.spiritGaugeFill.fillRect(SG_X, SG_Y, Math.round(SG_W * readyRatio), SG_H);
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
