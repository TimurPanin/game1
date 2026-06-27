import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, DEPTH, PALETTE } from '../game/constants';

/**
 * Parallax background — fixed to screen coordinates (scrollFactor 0),
 * manually scrolled in update() using tilePositionX.
 *
 * Layer order (depth):
 *   PARALLAX_BACK     — solid sky rect
 *   PARALLAX_BACK+1   — stars tiled layer
 *   PARALLAX_BACK+2   — moon disc (small, correct size)
 *   PARALLAX_MID      — distant mountains (slow)
 *   PARALLAX_FRONT    — near wall strip (fast)
 *
 * All layers are fixed to the viewport (scrollFactor 0) and
 * only their tilePositionX changes, so they never overlap the
 * playfield tiles.
 */
export class ParallaxBackground {
  private scene: Phaser.Scene;
  private moon!: Phaser.GameObjects.Image;
  private mountains!: Phaser.GameObjects.TileSprite;
  private wall!: Phaser.GameObjects.TileSprite;

  constructor(scene: Phaser.Scene, _levelWidth: number) {
    this.scene = scene;
    this.build();
  }

  private build(): void {
    const W = GAME_WIDTH;   // 256
    const H = GAME_HEIGHT;  // 240

    // ── 1. Sky fill (full viewport, fixed) ──────────────────────────
    this.scene.add
      .rectangle(W / 2, H / 2, W, H, PALETTE.BLACK)
      .setDepth(DEPTH.PARALLAX_BACK)
      .setScrollFactor(0);

    // ── 2. Mountains tile-sprite (bottom 80px of viewport) ──────────
    //   Height = 80px  → sits just behind the wall layer, does NOT
    //   cover the playfield because the camera starts at y=0 and tiles
    //   occupy rows below y=160 in world-space; the parallax strips
    //   are drawn in SCREEN-space at fixed y.
    this.mountains = this.scene.add
      .tileSprite(0, H - 80, W, 80, 'parallax_mountains')
      .setOrigin(0, 0)
      .setDepth(DEPTH.PARALLAX_MID)
      .setScrollFactor(0);

    // ── 3. Wall tile-sprite (bottom 56px of viewport) ───────────────
    this.wall = this.scene.add
      .tileSprite(0, H - 56, W, 56, 'parallax_wall')
      .setOrigin(0, 0)
      .setDepth(DEPTH.PARALLAX_FRONT)
      .setScrollFactor(0);

    // ── 4. Moon (small disc, top-right quadrant) ─────────────────────
    //   DisplaySize is set explicitly so it never blows up regardless
    //   of the underlying canvas size.
    this.moon = this.scene.add
      .image(W - 48, 28, 'moon_glow')
      .setDisplaySize(40, 40)           // always 40×40 screen-pixels
      .setDepth(DEPTH.PARALLAX_BACK + 2)
      .setScrollFactor(0)              // fixed to screen, moves only with camera
      .setBlendMode(Phaser.BlendModes.ADD);
  }

  update(cameraScrollX: number): void {
    // Mountains scroll at 30% camera speed
    this.mountains.tilePositionX = cameraScrollX * 0.3;
    // Wall scrolls at 60% camera speed
    this.wall.tilePositionX = cameraScrollX * 0.6;
    // Moon drifts very slowly (purely cosmetic)
    this.moon.x = (GAME_WIDTH - 48) + cameraScrollX * 0.05;
  }
}
