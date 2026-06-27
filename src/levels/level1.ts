import { TILE_SIZE } from '../game/constants';

export type TileType = 0 | 1 | 2 | 3 | 4;

// 0=empty, 1=top, 2=fill, 3=spike, 4=brick(collapsing)
export const LEVEL_WIDTH_TILES = 130;
export const LEVEL_HEIGHT_TILES = 15;
export const LEVEL_PIXEL_WIDTH = LEVEL_WIDTH_TILES * TILE_SIZE;

export interface SpawnEntry {
  type: 'flying_demon' | 'hellhound' | 'imp' | 'scroll' | 'coin' | 'boss';
  x: number;
  y: number;
  patrol?: number;
}

export interface LevelData {
  tiles: TileType[][];
  spawns: SpawnEntry[];
  bossArenaX: number;
  collapsingTiles: { x: number; y: number }[];
}

function emptyRow(): TileType[] {
  return new Array(LEVEL_WIDTH_TILES).fill(0) as TileType[];
}

function buildLevel(): LevelData {
  const tiles: TileType[][] = [];
  for (let y = 0; y < LEVEL_HEIGHT_TILES; y++) {
    tiles.push(emptyRow());
  }

  // Ground floor rows 13-14
  for (let x = 0; x < 40; x++) {
    tiles[13]![x] = 1;
    tiles[14]![x] = 2;
  }

  // Pit section (tiles 40-55) — gap with spikes at bottom
  for (let x = 56; x < 75; x++) {
    tiles[13]![x] = 1;
    tiles[14]![x] = 2;
  }
  for (let x = 40; x < 56; x++) {
    tiles[14]![x] = 3;
  }

  // Elevated platforms section
  for (let x = 75; x < 90; x++) {
    tiles[11]![x] = 1;
    tiles[12]![x] = 2;
  }
  // Collapsing platform
  tiles[11]![85] = 4;
  tiles[12]![85] = 4;

  for (let x = 90; x < 100; x++) {
    tiles[9]![x] = 1;
    tiles[10]![x] = 2;
  }

  // Coin alcove (elevated path)
  for (let x = 100; x < 108; x++) {
    tiles[7]![x] = 1;
    tiles[8]![x] = 2;
  }
  for (let x = 100; x < 115; x++) {
    tiles[13]![x] = 1;
    tiles[14]![x] = 2;
  }

  // Boss arena
  for (let x = 115; x < LEVEL_WIDTH_TILES; x++) {
    tiles[13]![x] = 1;
    tiles[14]![x] = 2;
  }

  // Some wall pillars
  for (let y = 10; y <= 14; y++) tiles[y]![30] = 2;
  tiles[10]![30] = 1;

  const spawns: SpawnEntry[] = [
    { type: 'flying_demon', x: 200, y: 140, patrol: 80 },
    { type: 'flying_demon', x: 350, y: 120, patrol: 60 },
    { type: 'scroll', x: 280, y: 176 },
    { type: 'imp', x: 480, y: 176 },
    { type: 'hellhound', x: 720, y: 160, patrol: 100 },
    { type: 'scroll', x: 600, y: 144 },
    { type: 'coin', x: 1050, y: 96 },
    { type: 'boss', x: 1900, y: 160 },
  ];

  return {
    tiles,
    spawns,
    bossArenaX: 115 * TILE_SIZE,
    collapsingTiles: [{ x: 85, y: 11 }, { x: 85, y: 12 }],
  };
}

export const level1 = buildLevel();

export function tileKey(type: TileType): string | null {
  switch (type) {
    case 1:
      return 'tile_top';
    case 2:
      return 'tile_fill';
    case 3:
      return 'tile_spike';
    case 4:
      return 'tile_brick';
    default:
      return null;
  }
}
