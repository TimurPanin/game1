import Phaser from 'phaser';
import { BootScene } from '../scenes/BootScene';
import { MenuScene } from '../scenes/MenuScene';
import { GameScene } from '../scenes/GameScene';
import { UIScene } from '../scenes/UIScene';
import { GameOverScene } from '../scenes/GameOverScene';
import { VictoryScene } from '../scenes/VictoryScene';
import { GAME_WIDTH, GAME_HEIGHT, PIXEL_SCALE, PHYSICS } from './constants';

export function createGameConfig(parent: string): Phaser.Types.Core.GameConfig {
  return {
    type: Phaser.AUTO,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    parent,
    backgroundColor: '#0a0a0a',
    pixelArt: true,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      zoom: PIXEL_SCALE,
    },
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { x: 0, y: PHYSICS.GRAVITY },
        debug: false,
      },
    },
    scene: [BootScene, MenuScene, GameScene, UIScene, GameOverScene, VictoryScene],
    input: {
      keyboard: true,
    },
  };
}
