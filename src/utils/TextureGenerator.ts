import Phaser from 'phaser';
import { PALETTE } from '../game/constants';

function hex(c: number): string {
  return `#${c.toString(16).padStart(6, '0')}`;
}

function createCanvas(w: number, h: number): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return c;
}

function px(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  color: number,
  size = 1,
): void {
  ctx.fillStyle = hex(color);
  ctx.fillRect(x, y, size, size);
}

function drawMonkFrame(ctx: CanvasRenderingContext2D, frame: number): void {
  const robe = PALETTE.ORANGE;
  const skin = PALETTE.CREAM;
  const staff = PALETTE.WHITE;
  const dark = PALETTE.DARK_GRAY;

  // Head
  px(ctx, 6, 2, skin);
  px(ctx, 7, 2, skin);
  px(ctx, 8, 2, skin);
  px(ctx, 9, 2, skin);
  px(ctx, 5, 3, skin);
  px(ctx, 10, 3, skin);
  px(ctx, 5, 4, skin);
  px(ctx, 10, 4, skin);
  px(ctx, 6, 5, skin);
  px(ctx, 7, 5, skin);
  px(ctx, 8, 5, skin);
  px(ctx, 9, 5, skin);

  // Robe body
  for (let y = 6; y <= 12; y++) {
    for (let x = 4; x <= 11; x++) {
      px(ctx, x, y, robe);
    }
  }
  px(ctx, 3, 8, robe);
  px(ctx, 12, 8, robe);
  px(ctx, 3, 9, robe);
  px(ctx, 12, 9, robe);

  // Feet
  const legOffset = frame === 1 ? 1 : 0;
  px(ctx, 5 + legOffset, 13, dark);
  px(ctx, 6 + legOffset, 13, dark);
  px(ctx, 9 - legOffset, 13, dark);
  px(ctx, 10 - legOffset, 13, dark);

  // Staff
  const staffX = frame === 2 ? 12 : 11;
  for (let y = 1; y <= 14; y++) {
    px(ctx, staffX, y, staff);
  }
  if (frame === 2) {
    px(ctx, 10, 6, staff);
    px(ctx, 11, 6, staff);
    px(ctx, 12, 6, staff);
  }
}

function drawFlyingDemon(ctx: CanvasRenderingContext2D, frame: number): void {
  const body = PALETTE.DARK_RED;
  const horn = PALETTE.GOLD;
  const wing = 0x5c1010;

  // Horns
  px(ctx, 4, 2, horn);
  px(ctx, 11, 2, horn);
  px(ctx, 3, 3, horn);
  px(ctx, 12, 3, horn);

  // Body
  for (let y = 4; y <= 10; y++) {
    for (let x = 4; x <= 11; x++) {
      px(ctx, x, y, body);
    }
  }

  // Eyes
  px(ctx, 5, 6, PALETTE.MOON);
  px(ctx, 10, 6, PALETTE.MOON);

  // Wings
  const wingY = frame === 0 ? 5 : 7;
  for (let i = 0; i < 3; i++) {
    px(ctx, 1, wingY + i, wing);
    px(ctx, 2, wingY + i, wing);
    px(ctx, 14 - i, wingY + i, wing);
    px(ctx, 15 - i, wingY + i, wing);
  }

  // Tail
  px(ctx, 7, 11, body);
  px(ctx, 8, 12, body);
  px(ctx, 7, 13, body);
}

function drawHellhound(ctx: CanvasRenderingContext2D, frame: number): void {
  const body = PALETTE.DARK_RED;
  const eye = PALETTE.MOON;

  // Head
  for (let x = 2; x <= 6; x++) px(ctx, x, 5, body);
  px(ctx, 1, 6, body);
  px(ctx, 2, 6, body);
  px(ctx, 3, 6, eye);

  // Body
  for (let y = 7; y <= 10; y++) {
    for (let x = 3; x <= 12; x++) px(ctx, x, y, body);
  }

  // Legs
  const off = frame === 0 ? 0 : 1;
  px(ctx, 4 + off, 11, body);
  px(ctx, 5 + off, 12, body);
  px(ctx, 9 - off, 11, body);
  px(ctx, 10 - off, 12, body);
  px(ctx, 4, 12, body);
  px(ctx, 10, 12, body);
}

function drawImp(ctx: CanvasRenderingContext2D, frame: number): void {
  const body = PALETTE.DARK_RED;
  const eye = PALETTE.MOON;

  px(ctx, 6, 3, body);
  px(ctx, 7, 3, body);
  px(ctx, 8, 3, body);
  px(ctx, 9, 3, body);
  px(ctx, 5, 4, body);
  px(ctx, 10, 4, body);
  px(ctx, 7, 5, eye);
  px(ctx, 8, 5, eye);

  for (let y = 6; y <= 10; y++) {
    for (let x = 5; x <= 10; x++) px(ctx, x, y, body);
  }

  const legOff = frame === 0 ? 0 : 2;
  px(ctx, 5, 11 + legOff, body);
  px(ctx, 9, 11 - legOff, body);
  px(ctx, 5, 12 + legOff, body);
  px(ctx, 9, 12 - legOff, body);
}

function drawBoss(ctx: CanvasRenderingContext2D, frame: number): void {
  const armor = PALETTE.DARK_GRAY;
  const trim = PALETTE.GOLD;
  const eye = PALETTE.MOON;

  // Helmet
  for (let x = 10; x <= 21; x++) px(ctx, x, 4, armor);
  for (let y = 5; y <= 10; y++) {
    for (let x = 9; x <= 22; x++) px(ctx, x, y, armor);
  }
  px(ctx, 12, 8, eye);
  px(ctx, 19, 8, eye);
  px(ctx, 10, 6, trim);
  px(ctx, 21, 6, trim);

  // Body
  for (let y = 11; y <= 24; y++) {
    for (let x = 8; x <= 23; x++) px(ctx, x, y, armor);
  }
  px(ctx, 7, 14, armor);
  px(ctx, 24, 14, armor);

  // Chest trim
  for (let x = 12; x <= 19; x++) px(ctx, x, 14, trim);

  // Legs
  const off = frame === 0 ? 0 : 1;
  for (let y = 25; y <= 30; y++) {
    px(ctx, 11 + off, y, armor);
    px(ctx, 12 + off, y, armor);
    px(ctx, 19 - off, y, armor);
    px(ctx, 20 - off, y, armor);
  }
}

function drawTile(
  ctx: CanvasRenderingContext2D,
  type: 'top' | 'fill' | 'spike' | 'brick',
): void {
  const stone = PALETTE.DARK_GRAY;
  const highlight = 0x3a3a3a;
  const gold = PALETTE.GOLD;

  if (type === 'top') {
    for (let x = 0; x < 16; x++) px(ctx, x, 0, highlight);
    for (let x = 0; x < 16; x++) px(ctx, x, 1, stone);
    for (let y = 2; y < 16; y++) {
      for (let x = 0; x < 16; x++) px(ctx, x, y, stone);
    }
    // Crenellations
    for (let x = 0; x < 16; x += 4) {
      px(ctx, x, 0, highlight);
      px(ctx, x + 1, 0, highlight);
    }
  } else if (type === 'fill') {
    for (let y = 0; y < 16; y++) {
      for (let x = 0; x < 16; x++) px(ctx, x, y, stone);
    }
    px(ctx, 0, 0, highlight);
    px(ctx, 8, 8, highlight);
  } else if (type === 'spike') {
    for (let y = 8; y < 16; y++) {
      for (let x = 0; x < 16; x++) px(ctx, x, y, stone);
    }
    for (let i = 0; i < 4; i++) {
      const bx = i * 4 + 1;
      px(ctx, bx + 1, 7, PALETTE.CREAM);
      px(ctx, bx + 2, 6, PALETTE.CREAM);
      px(ctx, bx + 1, 5, PALETTE.CREAM);
    }
  } else {
    for (let y = 0; y < 16; y++) {
      for (let x = 0; x < 16; x++) px(ctx, x, y, stone);
    }
    px(ctx, 2, 2, gold);
    px(ctx, 13, 13, gold);
  }
}

function drawScroll(ctx: CanvasRenderingContext2D): void {
  px(ctx, 4, 3, PALETTE.CREAM);
  px(ctx, 5, 3, PALETTE.CREAM);
  px(ctx, 10, 3, PALETTE.CREAM);
  px(ctx, 11, 3, PALETTE.CREAM);
  for (let y = 4; y <= 11; y++) {
    for (let x = 4; x <= 11; x++) px(ctx, x, y, PALETTE.CREAM);
  }
  px(ctx, 6, 6, PALETTE.GOLD);
  px(ctx, 7, 6, PALETTE.GOLD);
  px(ctx, 8, 6, PALETTE.GOLD);
  px(ctx, 6, 8, PALETTE.GOLD);
  px(ctx, 7, 8, PALETTE.GOLD);
}

function drawCoin(ctx: CanvasRenderingContext2D): void {
  for (let y = 4; y <= 11; y++) {
    for (let x = 4; x <= 11; x++) {
      const dx = x - 7.5;
      const dy = y - 7.5;
      if (dx * dx + dy * dy < 16) px(ctx, x, y, PALETTE.GOLD);
    }
  }
  px(ctx, 7, 7, PALETTE.CREAM);
  px(ctx, 8, 7, PALETTE.CREAM);
}

function drawProjectile(ctx: CanvasRenderingContext2D): void {
  for (let y = 1; y <= 6; y++) {
    for (let x = 1; x <= 6; x++) {
      const dx = x - 3.5;
      const dy = y - 3.5;
      if (dx * dx + dy * dy < 9) px(ctx, x, y, PALETTE.MOON);
    }
  }
  px(ctx, 3, 3, PALETTE.WHITE);
}

function drawMonkIcon(ctx: CanvasRenderingContext2D): void {
  px(ctx, 3, 2, PALETTE.CREAM);
  px(ctx, 4, 2, PALETTE.CREAM);
  px(ctx, 2, 3, PALETTE.CREAM);
  px(ctx, 5, 3, PALETTE.CREAM);
  for (let y = 4; y <= 7; y++) {
    for (let x = 2; x <= 5; x++) px(ctx, x, y, PALETTE.ORANGE);
  }
}

function drawParticle(ctx: CanvasRenderingContext2D, color: number): void {
  px(ctx, 0, 0, color);
  px(ctx, 1, 0, color);
  px(ctx, 0, 1, color);
  px(ctx, 1, 1, color);
}

function drawMountain(w: number, h: number): HTMLCanvasElement {
  const c = createCanvas(w, h);
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = hex(PALETTE.BLACK);
  ctx.fillRect(0, 0, w, h);

  const peaks = [
    { x: 0, w: 80, h: 60 },
    { x: 60, w: 100, h: 80 },
    { x: 140, w: 90, h: 50 },
    { x: 200, w: 120, h: 70 },
  ];

  ctx.fillStyle = hex(0x1a1010);
  for (const p of peaks) {
    ctx.beginPath();
    ctx.moveTo(p.x, h);
    ctx.lineTo(p.x + p.w / 2, h - p.h);
    ctx.lineTo(p.x + p.w, h);
    ctx.closePath();
    ctx.fill();
  }
  return c;
}

function drawWallParallax(w: number, h: number): HTMLCanvasElement {
  const c = createCanvas(w, h);
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = hex(PALETTE.BLACK);
  ctx.fillRect(0, 0, w, h);

  const stone = hex(PALETTE.DARK_GRAY);
  for (let x = 0; x < w; x += 16) {
    for (let y = h - 48; y < h; y += 16) {
      ctx.fillStyle = stone;
      ctx.fillRect(x, y, 16, 16);
      if (y === h - 48) {
        ctx.fillStyle = hex(0x3a3a3a);
        ctx.fillRect(x, y, 16, 4);
        if (x % 32 === 0) ctx.fillRect(x, y - 8, 8, 8);
      }
    }
  }
  return c;
}

function addCanvasTexture(
  scene: Phaser.Scene,
  key: string,
  canvas: HTMLCanvasElement,
): void {
  if (scene.textures.exists(key)) scene.textures.remove(key);
  scene.textures.addCanvas(key, canvas);
}

export function generateAllTextures(scene: Phaser.Scene): void {
  // Monk spritesheet: 4 frames (walk0, walk1, attack, jump)
  const monkCanvas = createCanvas(64, 16);
  const monkCtx = monkCanvas.getContext('2d')!;
  drawMonkFrame(monkCtx, 0);
  monkCtx.save();
  monkCtx.translate(16, 0);
  drawMonkFrame(monkCtx, 1);
  monkCtx.restore();
  monkCtx.save();
  monkCtx.translate(32, 0);
  drawMonkFrame(monkCtx, 2);
  monkCtx.restore();
  monkCtx.save();
  monkCtx.translate(48, 0);
  drawMonkFrame(monkCtx, 0);
  monkCtx.restore();
  addCanvasTexture(scene, 'monk', monkCanvas);
  scene.textures.get('monk').add('monk_0', 0, 0, 0, 16, 16);
  scene.textures.get('monk').add('monk_1', 0, 16, 0, 16, 16);
  scene.textures.get('monk').add('monk_2', 0, 32, 0, 16, 16);
  scene.textures.get('monk').add('monk_3', 0, 48, 0, 16, 16);

  // Flying demon
  const demonCanvas = createCanvas(32, 16);
  const demonCtx = demonCanvas.getContext('2d')!;
  drawFlyingDemon(demonCtx, 0);
  demonCtx.save();
  demonCtx.translate(16, 0);
  drawFlyingDemon(demonCtx, 1);
  demonCtx.restore();
  addCanvasTexture(scene, 'flying_demon', demonCanvas);
  scene.textures.get('flying_demon').add('fd_0', 0, 0, 0, 16, 16);
  scene.textures.get('flying_demon').add('fd_1', 0, 16, 0, 16, 16);

  // Hellhound
  const houndCanvas = createCanvas(32, 16);
  const houndCtx = houndCanvas.getContext('2d')!;
  drawHellhound(houndCtx, 0);
  houndCtx.save();
  houndCtx.translate(16, 0);
  drawHellhound(houndCtx, 1);
  houndCtx.restore();
  addCanvasTexture(scene, 'hellhound', houndCanvas);
  scene.textures.get('hellhound').add('hh_0', 0, 0, 0, 16, 16);
  scene.textures.get('hellhound').add('hh_1', 0, 16, 0, 16, 16);

  // Imp
  const impCanvas = createCanvas(32, 16);
  const impCtx = impCanvas.getContext('2d')!;
  drawImp(impCtx, 0);
  impCtx.save();
  impCtx.translate(16, 0);
  drawImp(impCtx, 1);
  impCtx.restore();
  addCanvasTexture(scene, 'imp', impCanvas);
  scene.textures.get('imp').add('imp_0', 0, 0, 0, 16, 16);
  scene.textures.get('imp').add('imp_1', 0, 16, 0, 16, 16);

  // Boss
  const bossCanvas = createCanvas(64, 32);
  const bossCtx = bossCanvas.getContext('2d')!;
  drawBoss(bossCtx, 0);
  bossCtx.save();
  bossCtx.translate(32, 0);
  drawBoss(bossCtx, 1);
  bossCtx.restore();
  addCanvasTexture(scene, 'boss', bossCanvas);
  scene.textures.get('boss').add('boss_0', 0, 0, 0, 32, 32);
  scene.textures.get('boss').add('boss_1', 0, 32, 0, 32, 32);

  // Tiles
  const tileTypes = ['top', 'fill', 'spike', 'brick'] as const;
  for (const t of tileTypes) {
    const tc = createCanvas(16, 16);
    drawTile(tc.getContext('2d')!, t);
    addCanvasTexture(scene, `tile_${t}`, tc);
  }

  // Pickups
  const scrollC = createCanvas(16, 16);
  drawScroll(scrollC.getContext('2d')!);
  addCanvasTexture(scene, 'scroll', scrollC);

  const coinC = createCanvas(16, 16);
  drawCoin(coinC.getContext('2d')!);
  addCanvasTexture(scene, 'coin', coinC);

  const projC = createCanvas(8, 8);
  drawProjectile(projC.getContext('2d')!);
  addCanvasTexture(scene, 'projectile', projC);

  const iconC = createCanvas(8, 8);
  drawMonkIcon(iconC.getContext('2d')!);
  addCanvasTexture(scene, 'monk_icon', iconC);

  // Particles
  const dustC = createCanvas(2, 2);
  drawParticle(dustC.getContext('2d')!, PALETTE.CREAM);
  addCanvasTexture(scene, 'particle_dust', dustC);

  const sparkC = createCanvas(2, 2);
  drawParticle(sparkC.getContext('2d')!, PALETTE.GOLD);
  addCanvasTexture(scene, 'particle_spark', sparkC);

  const emberC = createCanvas(2, 2);
  drawParticle(emberC.getContext('2d')!, PALETTE.MOON);
  addCanvasTexture(scene, 'particle_ember', emberC);

  // Parallax
  addCanvasTexture(scene, 'parallax_mountains', drawMountain(320, 120));
  addCanvasTexture(scene, 'parallax_wall', drawWallParallax(320, 120));

  // Moon glow (additive circle)
  const moonC = createCanvas(32, 32);
  const mctx = moonC.getContext('2d')!;
  const grad = mctx.createRadialGradient(16, 16, 2, 16, 16, 16);
  grad.addColorStop(0, 'rgba(255, 229, 102, 1)');
  grad.addColorStop(0.4, 'rgba(255, 229, 102, 0.5)');
  grad.addColorStop(1, 'rgba(255, 229, 102, 0)');
  mctx.fillStyle = grad;
  mctx.fillRect(0, 0, 32, 32);
  addCanvasTexture(scene, 'moon_glow', moonC);

  // 1x1 white pixel for effects
  const pixelC = createCanvas(1, 1);
  pixelC.getContext('2d')!.fillStyle = '#ffffff';
  pixelC.getContext('2d')!.fillRect(0, 0, 1, 1);
  addCanvasTexture(scene, 'pixel', pixelC);
}
