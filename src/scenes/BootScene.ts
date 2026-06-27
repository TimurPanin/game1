import Phaser from 'phaser';
import { generateAllTextures } from '../utils/TextureGenerator';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload(): void {
    generateAllTextures(this);
  }

  create(): void {
    this.scene.start('MenuScene');
  }
}
