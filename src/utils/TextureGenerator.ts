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

// ─── MONK ────────────────────────────────────────────────────────────────────
// 16×16 per frame, 4 frames: walk0, walk1, attack, jump
function drawMonkFrame(ctx: CanvasRenderingContext2D, frame: number): void {
  const robe      = PALETTE.ORANGE;     // 0xe07830
  const robeShadow = 0xa04800;          // darker orange for robe shadow
  const skin      = PALETTE.CREAM;      // face/hands
  const skinShadow = 0xc0906a;          // cheek/chin shadow
  const staff     = PALETTE.WHITE;
  const staffGlow = PALETTE.MOON;       // yellow glow on staff tip
  const dark      = PALETTE.DARK_GRAY;
  const belt      = PALETTE.GOLD;       // gold belt
  const eyeColor  = 0x1a0a00;          // dark eye pupils

  // ── Head (oval 5×4) ──────────────────────
  const headPixels: [number, number][] = [
    [6,1],[7,1],[8,1],[9,1],
    [5,2],[6,2],[7,2],[8,2],[9,2],[10,2],
    [5,3],[6,3],[7,3],[8,3],[9,3],[10,3],
    [6,4],[7,4],[8,4],[9,4],
  ];
  for (const [x, y] of headPixels) px(ctx, x, y, skin);

  // Chin shadow
  px(ctx, 6, 4, skinShadow);
  px(ctx, 9, 4, skinShadow);

  // Eyes (2 dots)
  if (frame !== 3) { // open during walk/attack
    px(ctx, 6, 2, eyeColor);
    px(ctx, 9, 2, eyeColor);
  } else { // closed during jump (squint)
    px(ctx, 6, 2, skinShadow);
    px(ctx, 9, 2, skinShadow);
  }

  // Mouth (tiny smirk)
  px(ctx, 7, 3, skinShadow);
  px(ctx, 8, 3, skinShadow);

  // ── Robe body ─────────────────────────────
  for (let y = 5; y <= 12; y++) {
    for (let x = 4; x <= 11; x++) {
      px(ctx, x, y, robe);
    }
  }
  // Side sleeve pixels
  px(ctx, 3, 7, robe);  px(ctx, 3, 8, robe);  px(ctx, 3, 9, robe);
  px(ctx, 12, 7, robe); px(ctx, 12, 8, robe); px(ctx, 12, 9, robe);

  // Robe fold / shadow at lower half
  for (let x = 4; x <= 11; x++) {
    px(ctx, x, 10, robeShadow);
    px(ctx, x, 11, robeShadow);
    px(ctx, x, 12, robeShadow);
  }

  // Center line detail
  px(ctx, 7, 6, robeShadow);
  px(ctx, 8, 6, robeShadow);
  px(ctx, 7, 7, robeShadow);
  px(ctx, 8, 7, robeShadow);

  // Gold belt
  for (let x = 4; x <= 11; x++) px(ctx, x, 9, belt);

  // ── Feet / legs ───────────────────────────
  const legOffset = frame === 1 ? 1 : (frame === 3 ? -1 : 0);
  px(ctx, 5 + legOffset, 13, dark);
  px(ctx, 6 + legOffset, 13, dark);
  px(ctx, 9 - legOffset, 13, dark);
  px(ctx, 10 - legOffset, 13, dark);
  // Foot highlight
  px(ctx, 5 + legOffset, 14, 0x555555);
  px(ctx, 9 - legOffset, 14, 0x555555);

  // ── Staff ─────────────────────────────────
  const staffX = frame === 2 ? 13 : 12;
  for (let y = 0; y <= 14; y++) px(ctx, staffX, y, staff);

  // Staff top glow orb
  px(ctx, staffX,     0, staffGlow);
  px(ctx, staffX - 1, 0, staffGlow);
  px(ctx, staffX,     1, staffGlow);

  // Attack pose: staff swung forward + energy burst
  if (frame === 2) {
    px(ctx, 11, 5, staff);
    px(ctx, 12, 5, staff);
    px(ctx, 13, 5, staff);
    // Energy sparks
    px(ctx, 14, 4, staffGlow);
    px(ctx, 15, 3, staffGlow);
    px(ctx, 14, 3, staffGlow);
    px(ctx, 15, 4, staffGlow);
    px(ctx, 15, 5, 0xffffff);
  }

  // Jump pose: legs bent
  if (frame === 3) {
    px(ctx, 5, 12, dark);
    px(ctx, 10, 12, dark);
  }
}

// ─── FLYING DEMON ────────────────────────────────────────────────────────────
function drawFlyingDemon(ctx: CanvasRenderingContext2D, frame: number): void {
  const body     = PALETTE.DARK_RED;   // 0x8b0000
  const bodyMid  = 0xb01010;           // brighter belly
  const horn     = PALETTE.GOLD;
  const hornTip  = 0xffe080;
  const wing     = 0x5c1010;
  const wingTip  = 0x3a0808;
  const eyeWhite = PALETTE.MOON;
  const pupil    = 0x000000;
  const fang     = PALETTE.CREAM;

  // ── Horns ──────────────────────────────────
  px(ctx, 5, 0, hornTip);
  px(ctx, 10, 0, hornTip);
  px(ctx, 5, 1, horn);
  px(ctx, 10, 1, horn);
  px(ctx, 4, 2, horn);
  px(ctx, 11, 2, horn);
  px(ctx, 4, 3, horn);
  px(ctx, 11, 3, horn);

  // ── Body (oval) ────────────────────────────
  for (let y = 4; y <= 10; y++) {
    for (let x = 4; x <= 11; x++) {
      px(ctx, x, y, body);
    }
  }
  // Belly highlight
  px(ctx, 7, 6, bodyMid); px(ctx, 8, 6, bodyMid);
  px(ctx, 7, 7, bodyMid); px(ctx, 8, 7, bodyMid);
  px(ctx, 6, 8, bodyMid); px(ctx, 7, 8, bodyMid); px(ctx, 8, 8, bodyMid);

  // ── Eyes ───────────────────────────────────
  px(ctx, 5, 5, eyeWhite); px(ctx, 6, 5, eyeWhite);
  px(ctx, 9, 5, eyeWhite); px(ctx, 10, 5, eyeWhite);
  px(ctx, 5, 6, eyeWhite); px(ctx, 6, 6, eyeWhite);
  px(ctx, 9, 6, eyeWhite); px(ctx, 10, 6, eyeWhite);
  // Pupils
  px(ctx, 6, 6, pupil);
  px(ctx, 10, 6, pupil);

  // ── Fangs ──────────────────────────────────
  px(ctx, 6, 10, fang);
  px(ctx, 9, 10, fang);
  px(ctx, 6, 11, fang);
  px(ctx, 9, 11, fang);

  // ── Wings (animated: up / down) ────────────
  // Wing up  = frame 0: wingY=4; Wing down = frame 1: wingY=7
  const wingY = frame === 0 ? 4 : 7;
  const wSpread = frame === 0 ? 4 : 3;
  for (let i = 0; i < wSpread; i++) {
    const shade = i < 2 ? wing : wingTip;
    px(ctx, 3 - i, wingY + i, shade);
    px(ctx, 3 - i, wingY + i + 1, shade);
    px(ctx, 12 + i, wingY + i, shade);
    px(ctx, 12 + i, wingY + i + 1, shade);
  }

  // ── Tail ──────────────────────────────────
  px(ctx, 7, 11, body);
  px(ctx, 8, 11, body);
  px(ctx, 8, 12, body);
  px(ctx, 7, 13, body);
  px(ctx, 8, 13, wingTip); // tail spike
}

// ─── HELLHOUND ───────────────────────────────────────────────────────────────
function drawHellhound(ctx: CanvasRenderingContext2D, frame: number): void {
  const body    = PALETTE.DARK_RED;
  const fur     = 0xb01515;      // brighter fur accent
  const eyeW    = PALETTE.MOON;
  const pupil   = 0x000000;
  const fang    = PALETTE.CREAM;
  const flame   = 0xff6600;      // fire glow from mouth
  const flameT  = PALETTE.GOLD;

  // ── Snout / head ──────────────────────────
  for (let x = 1; x <= 6; x++) px(ctx, x, 4, body);
  for (let x = 1; x <= 7; x++) px(ctx, x, 5, body);
  px(ctx, 0, 6, body); px(ctx, 1, 6, body); px(ctx, 2, 6, body);
  px(ctx, 3, 6, body); px(ctx, 4, 6, body); px(ctx, 5, 6, body);

  // Snout tip detail
  px(ctx, 1, 5, fur); px(ctx, 2, 5, fur);

  // Ear
  px(ctx, 6, 3, body); px(ctx, 7, 2, body); px(ctx, 8, 3, body);

  // ── Eye ──────────────────────────────────
  px(ctx, 4, 5, eyeW); px(ctx, 5, 5, eyeW);
  px(ctx, 4, 4, eyeW);
  px(ctx, 4, 4, pupil); // pupil

  // ── Fangs ────────────────────────────────
  px(ctx, 1, 7, fang);
  px(ctx, 3, 7, fang);

  // ── Flame from mouth ─────────────────────
  const flameOff = frame === 0 ? 0 : 1;
  px(ctx, 0, 7 + flameOff, flame);
  px(ctx, 1, 8 + flameOff, flame);
  px(ctx, 0, 8 + flameOff, flameT);

  // ── Body ─────────────────────────────────
  for (let y = 7; y <= 10; y++) {
    for (let x = 4; x <= 13; x++) px(ctx, x, y, body);
  }
  // Fur ridge on back
  px(ctx, 7, 6, fur); px(ctx, 8, 6, fur); px(ctx, 9, 6, fur);
  px(ctx, 10, 6, fur); px(ctx, 11, 6, fur);
  px(ctx, 6, 7, fur); px(ctx, 12, 7, fur);

  // ── Tail ─────────────────────────────────
  px(ctx, 14, 7, body);
  px(ctx, 15, 6, body);
  px(ctx, 15, 7, fur);

  // ── Legs ─────────────────────────────────
  const off = frame === 0 ? 0 : 1;
  // Front legs
  px(ctx, 5 + off, 11, body); px(ctx, 5 + off, 12, body);
  px(ctx, 6 + off, 11, body); px(ctx, 6 + off, 12, body);
  // Back legs
  px(ctx, 10 - off, 11, body); px(ctx, 10 - off, 12, body);
  px(ctx, 11 - off, 11, body); px(ctx, 11 - off, 12, body);
  // Claws
  px(ctx, 5 + off, 13, 0x440000);
  px(ctx, 10 - off, 13, 0x440000);
}

// ─── IMP ─────────────────────────────────────────────────────────────────────
function drawImp(ctx: CanvasRenderingContext2D, frame: number): void {
  const body    = PALETTE.DARK_RED;
  const skin    = 0xb03030;      // lighter red for face
  const eyeW    = PALETTE.MOON;
  const pupil   = 0x000000;
  const horn    = PALETTE.GOLD;
  const wing    = 0x3a0808;
  const fang    = PALETTE.CREAM;

  // ── Horns ─────────────────────────────────
  px(ctx, 5, 1, horn); px(ctx, 10, 1, horn);
  px(ctx, 6, 2, horn); px(ctx, 9, 2, horn);

  // ── Head ──────────────────────────────────
  for (let x = 5; x <= 10; x++) px(ctx, x, 3, skin);
  px(ctx, 4, 4, skin);
  for (let x = 5; x <= 10; x++) px(ctx, x, 4, skin);
  px(ctx, 11, 4, skin);

  // Eyes
  px(ctx, 6, 3, eyeW); px(ctx, 7, 3, eyeW);
  px(ctx, 8, 3, eyeW); px(ctx, 9, 3, eyeW);
  px(ctx, 7, 4, eyeW); px(ctx, 8, 4, eyeW); // lower whites
  px(ctx, 7, 3, pupil); px(ctx, 9, 3, pupil); // pupils

  // Fangs
  px(ctx, 6, 5, fang); px(ctx, 9, 5, fang);

  // ── Body ──────────────────────────────────
  for (let y = 5; y <= 10; y++) {
    for (let x = 5; x <= 10; x++) px(ctx, x, y, body);
  }
  // Belly spot
  px(ctx, 7, 7, skin); px(ctx, 8, 7, skin);
  px(ctx, 7, 8, skin); px(ctx, 8, 8, skin);

  // ── Mini wings ────────────────────────────
  px(ctx, 3, 6, wing); px(ctx, 4, 7, wing);
  px(ctx, 11, 6, wing); px(ctx, 12, 7, wing);
  px(ctx, 3, 7, wing); px(ctx, 12, 8, wing);

  // ── Tail ──────────────────────────────────
  px(ctx, 8, 11, body);
  px(ctx, 9, 12, body);
  px(ctx, 10, 13, horn); // tail spike

  // ── Legs (animated) ───────────────────────
  const legOff = frame === 0 ? 0 : 2;
  px(ctx, 6, 11 + legOff, body);
  px(ctx, 6, 12 + legOff, body);
  px(ctx, 9, 11, body);
  px(ctx, 9, 12, body);
}

// ─── BOSS ────────────────────────────────────────────────────────────────────
// 32×32 per frame
function drawBoss(ctx: CanvasRenderingContext2D, frame: number): void {
  const armor    = PALETTE.DARK_GRAY;   // 0x3a3a3a
  const armorDark = 0x1e1e1e;           // shadow plates
  const armorMid = 0x505050;            // highlight plates
  const trim     = PALETTE.GOLD;
  const trimGlow = 0xffe080;            // gold highlight
  const eye      = PALETTE.MOON;
  const pupil    = 0x000000;
  const aura     = 0x330000;            // dark red aura pixels
  const cape     = 0x550000;            // deep red cape

  // ── Aura / shadow halo ────────────────────
  const auraPts: [number, number][] = [
    [7,8],[8,6],[9,5],[22,5],[23,6],[24,8],
    [7,20],[24,20],[6,14],[25,14],
  ];
  for (const [x, y] of auraPts) px(ctx, x, y, aura);

  // ── Cape / cloak behind body ──────────────
  for (let y = 12; y <= 28; y++) {
    px(ctx, 7, y, cape);
    px(ctx, 8, y, cape);
    px(ctx, 23, y, cape);
    px(ctx, 24, y, cape);
  }
  for (let y = 20; y <= 30; y++) {
    px(ctx, 6, y, cape);
    px(ctx, 25, y, cape);
  }

  // ── Helmet ────────────────────────────────
  for (let x = 10; x <= 21; x++) px(ctx, x, 4, armorMid); // top highlight
  for (let y = 5; y <= 11; y++) {
    for (let x = 9; x <= 22; x++) px(ctx, x, y, armor);
  }
  // Visor slot
  for (let x = 11; x <= 20; x++) px(ctx, x, 9, armorDark);
  for (let x = 11; x <= 20; x++) px(ctx, x, 10, armorDark);
  // Eye glow through visor
  px(ctx, 12, 9, eye); px(ctx, 13, 9, eye);
  px(ctx, 18, 9, eye); px(ctx, 19, 9, eye);
  px(ctx, 12, 10, eye); px(ctx, 13, 10, eye);
  px(ctx, 18, 10, eye); px(ctx, 19, 10, eye);
  // Pupils
  px(ctx, 13, 10, pupil); px(ctx, 18, 10, pupil);
  // Helmet crest (trim)
  for (let x = 12; x <= 19; x++) px(ctx, x, 4, trim);
  px(ctx, 15, 3, trimGlow); px(ctx, 16, 3, trimGlow);
  px(ctx, 15, 2, trim);     px(ctx, 16, 2, trim);
  // Temple trim bolts
  px(ctx, 10, 6, trim); px(ctx, 21, 6, trim);
  px(ctx, 9,  7, trim); px(ctx, 22, 7, trim);

  // ── Shoulder pauldrons ────────────────────
  for (let y = 11; y <= 14; y++) {
    px(ctx, 7, y, armorMid); px(ctx, 8, y, armorMid);
    px(ctx, 23, y, armorMid); px(ctx, 24, y, armorMid);
  }
  for (let y = 12; y <= 13; y++) {
    px(ctx, 6, y, armor); px(ctx, 25, y, armor);
  }
  px(ctx, 8, 11, trim); px(ctx, 23, 11, trim);

  // ── Body / chest plate ────────────────────
  for (let y = 11; y <= 24; y++) {
    for (let x = 9; x <= 22; x++) px(ctx, x, y, armor);
  }
  // Center chest emblem
  for (let x = 13; x <= 18; x++) px(ctx, x, 14, trim);
  for (let x = 14; x <= 17; x++) px(ctx, x, 15, trim);
  px(ctx, 15, 13, trimGlow); px(ctx, 16, 13, trimGlow);
  // Plate lines (armor panels)
  for (let x = 9; x <= 22; x++) px(ctx, x, 17, armorDark);
  px(ctx, 9, 20, armorDark); px(ctx, 22, 20, armorDark);
  // Side trim strips
  for (let y = 11; y <= 24; y++) {
    px(ctx, 9, y, armorDark);
    px(ctx, 22, y, armorDark);
  }

  // ── Arms ──────────────────────────────────
  const armOff = frame === 0 ? 0 : 1;
  for (let y = 15; y <= 22; y++) {
    px(ctx, 7 + armOff,  y, armor);
    px(ctx, 8 + armOff,  y, armor);
    px(ctx, 23 - armOff, y, armor);
    px(ctx, 24 - armOff, y, armor);
  }
  // Gauntlets
  px(ctx, 7 + armOff, 22, trim);
  px(ctx, 8 + armOff, 22, trim);
  px(ctx, 23 - armOff, 22, trim);
  px(ctx, 24 - armOff, 22, trim);
  for (let y = 23; y <= 25; y++) {
    px(ctx, 6 + armOff, y, armorMid);
    px(ctx, 7 + armOff, y, armorMid);
    px(ctx, 24 - armOff, y, armorMid);
    px(ctx, 25 - armOff, y, armorMid);
  }

  // ── Legs ──────────────────────────────────
  const legOff = frame === 0 ? 0 : 1;
  for (let y = 25; y <= 30; y++) {
    px(ctx, 11 + legOff, y, armor);
    px(ctx, 12 + legOff, y, armor);
    px(ctx, 19 - legOff, y, armor);
    px(ctx, 20 - legOff, y, armor);
  }
  // Knee guards
  px(ctx, 11 + legOff, 25, trim); px(ctx, 12 + legOff, 25, trim);
  px(ctx, 19 - legOff, 25, trim); px(ctx, 20 - legOff, 25, trim);
  // Boots
  for (let x = 10; x <= 13; x++) px(ctx, x + legOff, 30, armorDark);
  for (let x = 18; x <= 21; x++) px(ctx, x - legOff, 30, armorDark);
}

// ─── TILES ───────────────────────────────────────────────────────────────────
function drawTile(
  ctx: CanvasRenderingContext2D,
  type: 'top' | 'fill' | 'spike' | 'brick',
): void {
  const stone     = PALETTE.DARK_GRAY;  // 0x3a3a3a
  const stoneLight = 0x505050;
  const stoneDark  = 0x252525;
  const mortar     = 0x1e1e1e;          // grout between bricks
  const grass      = 0x2d7a1a;          // bright green grass
  const grassDark  = 0x1a5010;
  const gold       = PALETTE.GOLD;
  const spike      = PALETTE.CREAM;
  const spikeDark  = 0xa09070;

  if (type === 'top') {
    // ── Grass top ────────────────────────────
    // Grass blades row (top 3 pixels)
    for (let x = 0; x < 16; x++) px(ctx, x, 0, grass);
    px(ctx, 1, 0, grassDark); px(ctx, 4, 0, grassDark); // variation
    px(ctx, 7, 0, grassDark); px(ctx, 11, 0, grassDark);
    for (let x = 0; x < 16; x++) px(ctx, x, 1, grass);
    for (let x = 0; x < 16; x++) px(ctx, x, 2, grassDark);
    // Soil transition
    for (let x = 0; x < 16; x++) px(ctx, x, 3, 0x3a2a10);
    // Stone body with mortar lines
    for (let y = 4; y < 16; y++) {
      for (let x = 0; x < 16; x++) {
        const isMortarH = (y === 4 || y === 8 || y === 12);
        const brickRow  = Math.floor((y - 4) / 4);
        const offset    = brickRow % 2 === 0 ? 0 : 8;
        const isMortarV = (x + offset) % 8 === 0;
        if (isMortarH || isMortarV) {
          px(ctx, x, y, mortar);
        } else {
          const shade = (x + y) % 3 === 0 ? stoneDark : stone;
          px(ctx, x, y, shade);
        }
      }
    }
    // Top edge highlight
    for (let x = 0; x < 16; x++) px(ctx, x, 4, stoneLight);

  } else if (type === 'fill') {
    // ── Fill tile: brick pattern ──────────────
    for (let y = 0; y < 16; y++) {
      for (let x = 0; x < 16; x++) {
        const isMortarH = (y % 4 === 0);
        const brickRow  = Math.floor(y / 4);
        const offset    = brickRow % 2 === 0 ? 0 : 8;
        const isMortarV = (x + offset) % 8 === 0;
        if (isMortarH || isMortarV) {
          px(ctx, x, y, mortar);
        } else {
          const shade = (x + y) % 5 === 0 ? stoneLight : stone;
          px(ctx, x, y, shade);
        }
      }
    }

  } else if (type === 'spike') {
    // ── Spike tile ───────────────────────────
    // Base stone
    for (let y = 9; y < 16; y++) {
      for (let x = 0; x < 16; x++) px(ctx, x, y, stone);
    }
    for (let x = 0; x < 16; x++) px(ctx, x, 9, stoneLight);
    // Three sharp spikes
    const spikeBases = [1, 6, 11];
    for (const bx of spikeBases) {
      // Spike body
      for (let sy = 3; sy <= 9; sy++) {
        const halfW = Math.floor((9 - sy) / 2);
        for (let sx = -halfW; sx <= halfW; sx++) {
          px(ctx, bx + 2 + sx, sy, spike);
        }
      }
      // Spike tip
      px(ctx, bx + 2, 1, spikeDark);
      px(ctx, bx + 2, 2, spike);
      // Spike shadow
      px(ctx, bx + 3, 4, spikeDark);
      px(ctx, bx + 3, 5, spikeDark);
      px(ctx, bx + 3, 6, spikeDark);
    }

  } else {
    // ── Brick tile (decorative) ───────────────
    for (let y = 0; y < 16; y++) {
      for (let x = 0; x < 16; x++) {
        const isMortarH = (y % 4 === 0);
        const brickRow  = Math.floor(y / 4);
        const offset    = brickRow % 2 === 0 ? 0 : 8;
        const isMortarV = (x + offset) % 8 === 0;
        if (isMortarH || isMortarV) {
          px(ctx, x, y, mortar);
        } else {
          px(ctx, x, y, stone);
        }
      }
    }
    // Gold rune accent
    px(ctx, 2, 5, gold); px(ctx, 3, 5, gold);
    px(ctx, 2, 6, gold);
    px(ctx, 13, 10, gold); px(ctx, 13, 11, gold); px(ctx, 14, 11, gold);
  }
}

// ─── PICKUPS ─────────────────────────────────────────────────────────────────
function drawScroll(ctx: CanvasRenderingContext2D): void {
  const parchment = PALETTE.CREAM;
  const shadow    = 0xa08850;
  const gold      = PALETTE.GOLD;
  const ink       = 0x3a2000;

  // Scroll ends (rounded caps)
  px(ctx, 3, 2, shadow); px(ctx, 4, 2, parchment); px(ctx, 5, 2, parchment);
  px(ctx, 10, 2, parchment); px(ctx, 11, 2, parchment); px(ctx, 12, 2, shadow);
  // Body
  for (let y = 3; y <= 12; y++) {
    for (let x = 3; x <= 12; x++) px(ctx, x, y, parchment);
  }
  // Left / right shadow rolls
  for (let y = 3; y <= 12; y++) {
    px(ctx, 3, y, shadow);
    px(ctx, 12, y, shadow);
  }
  // Bottom cap
  px(ctx, 3, 13, shadow); px(ctx, 4, 13, parchment); px(ctx, 5, 13, parchment);
  px(ctx, 10, 13, parchment); px(ctx, 11, 13, parchment); px(ctx, 12, 13, shadow);
  // Gold seal
  px(ctx, 7, 7, gold); px(ctx, 8, 7, gold);
  px(ctx, 6, 8, gold); px(ctx, 7, 8, gold); px(ctx, 8, 8, gold); px(ctx, 9, 8, gold);
  px(ctx, 7, 9, gold); px(ctx, 8, 9, gold);
  // Ink lines (writing)
  px(ctx, 5, 5, ink); px(ctx, 6, 5, ink); px(ctx, 7, 5, ink); px(ctx, 8, 5, ink); px(ctx, 9, 5, ink);
  px(ctx, 5, 11, ink); px(ctx, 6, 11, ink); px(ctx, 7, 11, ink); px(ctx, 8, 11, ink);
}

function drawCoin(ctx: CanvasRenderingContext2D): void {
  const gold     = PALETTE.GOLD;
  const goldEdge = 0xa07000;
  const goldHi   = 0xffe080;
  const shine    = PALETTE.CREAM;

  // Coin body (circle)
  for (let y = 3; y <= 12; y++) {
    for (let x = 3; x <= 12; x++) {
      const dx = x - 7.5;
      const dy = y - 7.5;
      const r2 = dx * dx + dy * dy;
      if (r2 < 20.25) {
        const isEdge = r2 > 12.25;
        px(ctx, x, y, isEdge ? goldEdge : gold);
      }
    }
  }
  // Highlight arc (top-left)
  px(ctx, 5, 4, goldHi); px(ctx, 6, 4, goldHi);
  px(ctx, 4, 5, goldHi); px(ctx, 5, 5, goldHi);
  // Center ¥ / coin symbol
  px(ctx, 7, 6, shine); px(ctx, 8, 6, shine);
  px(ctx, 6, 7, shine); px(ctx, 9, 7, shine);
  px(ctx, 6, 8, shine); px(ctx, 7, 8, shine); px(ctx, 8, 8, shine); px(ctx, 9, 8, shine);
  px(ctx, 7, 9, shine); px(ctx, 8, 9, shine);
}

function drawProjectile(ctx: CanvasRenderingContext2D): void {
  const core  = PALETTE.MOON;    // yellow
  const inner = PALETTE.WHITE;
  const glow  = 0xffee66;

  // Outer glow ring
  px(ctx, 2, 1, glow); px(ctx, 3, 0, glow); px(ctx, 4, 0, glow); px(ctx, 5, 1, glow);
  px(ctx, 1, 2, glow); px(ctx, 6, 2, glow);
  px(ctx, 1, 5, glow); px(ctx, 6, 5, glow);
  px(ctx, 2, 6, glow); px(ctx, 3, 7, glow); px(ctx, 4, 7, glow); px(ctx, 5, 6, glow);
  // Core circle
  for (let y = 1; y <= 6; y++) {
    for (let x = 1; x <= 6; x++) {
      const dx = x - 3.5;
      const dy = y - 3.5;
      if (dx * dx + dy * dy < 7.5) px(ctx, x, y, core);
    }
  }
  // Bright center
  px(ctx, 3, 3, inner); px(ctx, 4, 3, inner);
  px(ctx, 3, 4, inner); px(ctx, 4, 4, inner);
}

// ─── MONK ICON (HUD life icon) ───────────────────────────────────────────────
function drawMonkIcon(ctx: CanvasRenderingContext2D): void {
  // Mini monk head + robe (8×8)
  px(ctx, 3, 0, PALETTE.CREAM);
  px(ctx, 4, 0, PALETTE.CREAM);
  px(ctx, 2, 1, PALETTE.CREAM); px(ctx, 3, 1, PALETTE.CREAM);
  px(ctx, 4, 1, PALETTE.CREAM); px(ctx, 5, 1, PALETTE.CREAM);
  // Mini eyes
  px(ctx, 2, 1, 0x1a0a00); px(ctx, 5, 1, 0x1a0a00);
  // Robe
  for (let y = 2; y <= 7; y++) {
    for (let x = 1; x <= 6; x++) px(ctx, x, y, PALETTE.ORANGE);
  }
  // Belt
  for (let x = 1; x <= 6; x++) px(ctx, x, 4, PALETTE.GOLD);
  // Staff
  px(ctx, 7, 0, PALETTE.WHITE); px(ctx, 7, 1, PALETTE.WHITE);
  px(ctx, 7, 2, PALETTE.WHITE); px(ctx, 7, 3, PALETTE.WHITE);
  px(ctx, 7, 0, PALETTE.MOON);
}

// ─── PARTICLES ───────────────────────────────────────────────────────────────
function drawParticle(ctx: CanvasRenderingContext2D, color: number): void {
  px(ctx, 0, 0, color);
  px(ctx, 1, 0, color);
  px(ctx, 0, 1, color);
  px(ctx, 1, 1, color);
}

// ─── PARALLAX: MOUNTAINS ─────────────────────────────────────────────────────
function drawMountain(w: number, h: number): HTMLCanvasElement {
  const c   = createCanvas(w, h);
  const ctx = c.getContext('2d')!;

  // Sky gradient (dark blue → black)
  const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
  skyGrad.addColorStop(0, '#050510');
  skyGrad.addColorStop(1, '#100808');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, w, h);

  // Stars (deterministic pseudo-random)
  const stars: [number, number, number][] = [
    [12,4,2],[45,8,1],[80,3,2],[110,12,1],[145,6,2],
    [180,9,1],[210,5,2],[250,7,1],[285,3,2],[300,15,1],
    [30,15,1],[65,18,2],[95,11,1],[130,20,2],[165,14,1],
    [200,16,2],[235,10,1],[270,18,2],[15,22,1],[50,25,2],
  ];
  for (const [sx, sy, br] of stars) {
    ctx.fillStyle = br === 2 ? 'rgba(255,240,200,0.9)' : 'rgba(200,200,255,0.6)';
    ctx.fillRect(sx % w, sy, 1, 1);
    if (br === 2) {
      ctx.fillStyle = 'rgba(255,240,200,0.3)';
      ctx.fillRect((sx - 1) % w, sy, 1, 1);
      ctx.fillRect((sx + 1) % w, sy, 1, 1);
    }
  }

  // Moon
  const moonGrad = ctx.createRadialGradient(260, 18, 2, 260, 18, 10);
  moonGrad.addColorStop(0, 'rgba(255,240,150,1)');
  moonGrad.addColorStop(0.5, 'rgba(255,230,100,0.7)');
  moonGrad.addColorStop(1, 'rgba(255,220,80,0)');
  ctx.fillStyle = moonGrad;
  ctx.fillRect(250, 8, 20, 20);
  // Moon disc
  ctx.fillStyle = hex(PALETTE.MOON);
  ctx.beginPath();
  ctx.arc(260, 18, 7, 0, Math.PI * 2);
  ctx.fill();
  // Moon craters
  ctx.fillStyle = 'rgba(0,0,0,0.15)';
  ctx.beginPath(); ctx.arc(257, 16, 2, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(263, 20, 1.5, 0, Math.PI * 2); ctx.fill();

  // Far mountains (dark navy)
  const farPeaks = [
    { x: 0,   w: 70,  h: 45 },
    { x: 50,  w: 90,  h: 60 },
    { x: 120, w: 70,  h: 38 },
    { x: 170, w: 100, h: 55 },
    { x: 250, w: 80,  h: 48 },
  ];
  ctx.fillStyle = '#0d0d22';
  for (const p of farPeaks) {
    ctx.beginPath();
    ctx.moveTo(p.x, h);
    ctx.lineTo(p.x + p.w / 2, h - p.h);
    ctx.lineTo(p.x + p.w, h);
    ctx.closePath();
    ctx.fill();
  }

  // Near mountains (dark red-black)
  const nearPeaks = [
    { x: -10, w: 90,  h: 75 },
    { x: 60,  w: 110, h: 90 },
    { x: 150, w: 95,  h: 65 },
    { x: 220, w: 120, h: 80 },
  ];
  const nearGrad = ctx.createLinearGradient(0, 0, 0, h);
  nearGrad.addColorStop(0, '#2a0808');
  nearGrad.addColorStop(1, '#150404');
  ctx.fillStyle = nearGrad;
  for (const p of nearPeaks) {
    ctx.beginPath();
    ctx.moveTo(p.x, h);
    ctx.lineTo(p.x + p.w / 2, h - p.h);
    ctx.lineTo(p.x + p.w, h);
    ctx.closePath();
    ctx.fill();
  }

  // Distant castle silhouette
  ctx.fillStyle = '#1a0505';
  ctx.fillRect(130, h - 30, 40, 30);
  ctx.fillRect(128, h - 38, 8, 12);
  ctx.fillRect(162, h - 38, 8, 12);
  ctx.fillRect(144, h - 42, 12, 16);
  // Castle crenellations
  for (let ci = 0; ci < 3; ci++) {
    ctx.fillRect(128 + ci * 6, h - 42, 4, 4);
    ctx.fillRect(145 + ci * 4, h - 46, 3, 5);
  }

  return c;
}

// ─── PARALLAX: WALL ──────────────────────────────────────────────────────────
function drawWallParallax(w: number, h: number): HTMLCanvasElement {
  const c   = createCanvas(w, h);
  const ctx = c.getContext('2d')!;

  // Background: deep dark
  ctx.fillStyle = '#080510';
  ctx.fillRect(0, 0, w, h);

  // Dim stars in upper half
  const wallStars: [number, number][] = [
    [20,5],[55,12],[90,7],[130,3],[165,15],[200,8],[240,11],[280,4],
    [10,18],[70,20],[110,16],[150,22],[190,18],[230,14],[270,20],
  ];
  for (const [sx, sy] of wallStars) {
    ctx.fillStyle = 'rgba(180,180,255,0.4)';
    ctx.fillRect(sx % w, sy, 1, 1);
  }

  // Torches (flickering lights) — static orange glow patches
  const torchPositions = [48, 144, 240];
  for (const tx of torchPositions) {
    // Glow halo
    const tg = ctx.createRadialGradient(tx, h - 52, 2, tx, h - 52, 18);
    tg.addColorStop(0, 'rgba(255,160,30,0.6)');
    tg.addColorStop(1, 'rgba(255,100,0,0)');
    ctx.fillStyle = tg;
    ctx.fillRect(tx - 18, h - 70, 36, 36);
    // Torch bracket
    ctx.fillStyle = hex(PALETTE.DARK_GRAY);
    ctx.fillRect(tx - 2, h - 58, 4, 8);
    // Flame pixels
    ctx.fillStyle = '#ff9900';
    ctx.fillRect(tx - 1, h - 62, 2, 4);
    ctx.fillStyle = '#ffcc00';
    ctx.fillRect(tx, h - 63, 1, 2);
  }

  // Stone wall blocks (lower portion)
  const stoneColor  = hex(PALETTE.DARK_GRAY);
  const mortarColor = '#1e1e1e';
  const stoneLight  = '#505050';
  for (let y = h - 56; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const rowBlock   = Math.floor((y - (h - 56)) / 8);
      const offset     = rowBlock % 2 === 0 ? 0 : 16;
      const isMortarH  = (y - (h - 56)) % 8 === 0;
      const isMortarV  = (x + offset) % 16 === 0;
      if (isMortarH || isMortarV) {
        ctx.fillStyle = mortarColor;
      } else {
        ctx.fillStyle = stoneColor;
      }
      ctx.fillRect(x, y, 1, 1);
    }
  }
  // Top edge highlight
  ctx.fillStyle = stoneLight;
  ctx.fillRect(0, h - 56, w, 1);

  return c;
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function addCanvasTexture(
  scene: Phaser.Scene,
  key: string,
  canvas: HTMLCanvasElement,
): void {
  if (scene.textures.exists(key)) scene.textures.remove(key);
  scene.textures.addCanvas(key, canvas);
}

// ─── MAIN EXPORT ─────────────────────────────────────────────────────────────
export function generateAllTextures(scene: Phaser.Scene): void {
  // ── Monk spritesheet (4 frames × 16px wide = 64px) ──
  const monkCanvas = createCanvas(64, 16);
  const monkCtx    = monkCanvas.getContext('2d')!;
  for (let f = 0; f < 4; f++) {
    monkCtx.save();
    monkCtx.translate(f * 16, 0);
    drawMonkFrame(monkCtx, f);
    monkCtx.restore();
  }
  addCanvasTexture(scene, 'monk', monkCanvas);
  for (let f = 0; f < 4; f++) {
    scene.textures.get('monk').add(`monk_${f}`, 0, f * 16, 0, 16, 16);
  }

  // ── Flying demon (2 frames) ──
  const demonCanvas = createCanvas(32, 16);
  const demonCtx    = demonCanvas.getContext('2d')!;
  for (let f = 0; f < 2; f++) {
    demonCtx.save();
    demonCtx.translate(f * 16, 0);
    drawFlyingDemon(demonCtx, f);
    demonCtx.restore();
  }
  addCanvasTexture(scene, 'flying_demon', demonCanvas);
  scene.textures.get('flying_demon').add('fd_0', 0, 0,  0, 16, 16);
  scene.textures.get('flying_demon').add('fd_1', 0, 16, 0, 16, 16);

  // ── Hellhound (2 frames) ──
  const houndCanvas = createCanvas(32, 16);
  const houndCtx    = houndCanvas.getContext('2d')!;
  for (let f = 0; f < 2; f++) {
    houndCtx.save();
    houndCtx.translate(f * 16, 0);
    drawHellhound(houndCtx, f);
    houndCtx.restore();
  }
  addCanvasTexture(scene, 'hellhound', houndCanvas);
  scene.textures.get('hellhound').add('hh_0', 0, 0,  0, 16, 16);
  scene.textures.get('hellhound').add('hh_1', 0, 16, 0, 16, 16);

  // ── Imp (2 frames) ──
  const impCanvas = createCanvas(32, 16);
  const impCtx    = impCanvas.getContext('2d')!;
  for (let f = 0; f < 2; f++) {
    impCtx.save();
    impCtx.translate(f * 16, 0);
    drawImp(impCtx, f);
    impCtx.restore();
  }
  addCanvasTexture(scene, 'imp', impCanvas);
  scene.textures.get('imp').add('imp_0', 0, 0,  0, 16, 16);
  scene.textures.get('imp').add('imp_1', 0, 16, 0, 16, 16);

  // ── Boss (2 frames × 32px) ──
  const bossCanvas = createCanvas(64, 32);
  const bossCtx    = bossCanvas.getContext('2d')!;
  for (let f = 0; f < 2; f++) {
    bossCtx.save();
    bossCtx.translate(f * 32, 0);
    drawBoss(bossCtx, f);
    bossCtx.restore();
  }
  addCanvasTexture(scene, 'boss', bossCanvas);
  scene.textures.get('boss').add('boss_0', 0, 0,  0, 32, 32);
  scene.textures.get('boss').add('boss_1', 0, 32, 0, 32, 32);

  // ── Tiles ──
  const tileTypes = ['top', 'fill', 'spike', 'brick'] as const;
  for (const t of tileTypes) {
    const tc = createCanvas(16, 16);
    drawTile(tc.getContext('2d')!, t);
    addCanvasTexture(scene, `tile_${t}`, tc);
  }

  // ── Pickups ──
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

  // ── Particles ──
  const dustC = createCanvas(2, 2);
  drawParticle(dustC.getContext('2d')!, PALETTE.CREAM);
  addCanvasTexture(scene, 'particle_dust', dustC);

  const sparkC = createCanvas(2, 2);
  drawParticle(sparkC.getContext('2d')!, PALETTE.GOLD);
  addCanvasTexture(scene, 'particle_spark', sparkC);

  const emberC = createCanvas(2, 2);
  drawParticle(emberC.getContext('2d')!, PALETTE.MOON);
  addCanvasTexture(scene, 'particle_ember', emberC);

  // ── Parallax backgrounds ──
  addCanvasTexture(scene, 'parallax_mountains', drawMountain(320, 120));
  addCanvasTexture(scene, 'parallax_wall',      drawWallParallax(320, 120));

  // ── Moon glow (additive overlay) ──
  const moonC = createCanvas(48, 48);
  const mctx  = moonC.getContext('2d')!;
  const grad  = mctx.createRadialGradient(24, 24, 3, 24, 24, 24);
  grad.addColorStop(0,   'rgba(255, 240, 120, 1)');
  grad.addColorStop(0.3, 'rgba(255, 220, 80,  0.7)');
  grad.addColorStop(0.7, 'rgba(255, 180, 40,  0.2)');
  grad.addColorStop(1,   'rgba(255, 140, 0,   0)');
  mctx.fillStyle = grad;
  mctx.fillRect(0, 0, 48, 48);
  addCanvasTexture(scene, 'moon_glow', moonC);

  // ── 1×1 white pixel ──
  const pixelC = createCanvas(1, 1);
  pixelC.getContext('2d')!.fillStyle = '#ffffff';
  pixelC.getContext('2d')!.fillRect(0, 0, 1, 1);
  addCanvasTexture(scene, 'pixel', pixelC);
}
