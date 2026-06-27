export const GAME_WIDTH = 256;
export const GAME_HEIGHT = 240;
export const PIXEL_SCALE = 3;
export const TILE_SIZE = 16;

export const PALETTE = {
  BLACK: 0x0a0a0a,
  DARK_RED: 0x8b1a1a,
  GOLD: 0xd4a017,
  CREAM: 0xf5e6c8,
  ORANGE: 0xe85d04,
  MOON: 0xffe566,
  WHITE: 0xffffff,
  DARK_GRAY: 0x2a2a2a,
  BROWN: 0x5c3d2e,
} as const;

export const DEPTH = {
  PARALLAX_BACK: 0,
  PARALLAX_MID: 1,
  PARALLAX_FRONT: 2,
  TILES: 10,
  PICKUPS: 20,
  ENEMIES: 30,
  PLAYER: 40,
  PROJECTILES: 45,
  EFFECTS: 50,
  UI: 100,
  OVERLAY: 200,
} as const;

export const PHYSICS = {
  GRAVITY: 600,
  MONK_SPEED: 90,
  MONK_JUMP: -220,
  COYOTE_MS: 100,
  JUMP_BUFFER_MS: 80,
  IFRAME_MS: 1500,
  SPIRIT_COOLDOWN_MS: 1000,
  SPIRIT_CHARGE_MS: 500,
  COMBO_WINDOW_MS: 300,
} as const;

export const SCORE = {
  SCROLL: 50,
  COIN: 200,
  ENEMY: 100,
  BOSS: 500,
} as const;

/** HP-based health system: each "life" has MONK_HP_PER_LIFE hit points */
export const MONK_MAX_LIVES = 3;
export const MONK_HP_PER_LIFE = 3;

/** localStorage key for high score persistence */
export const HIGH_SCORE_KEY = 'lotrd_hi';
