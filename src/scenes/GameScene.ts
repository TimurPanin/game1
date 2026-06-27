import Phaser from 'phaser';
import {
  GAME_HEIGHT,
  TILE_SIZE,
  DEPTH,
  SCORE,
} from '../game/constants';
import { level1, tileKey, LEVEL_PIXEL_WIDTH, LEVEL_HEIGHT_TILES, type SpawnEntry } from '../levels/level1';
import { Monk } from '../entities/Monk';
import { FlyingDemon } from '../entities/enemies/FlyingDemon';
import { Hellhound } from '../entities/enemies/Hellhound';
import { Imp } from '../entities/enemies/Imp';
import { BossStub } from '../entities/BossStub';
import { ParallaxBackground } from '../systems/ParallaxBackground';
import { JuiceManager } from '../systems/JuiceManager';
import { CombatManager } from '../systems/CombatManager';
import { sfx } from '../utils/SfxManager';
import type { EnemyBase } from '../entities/enemies/EnemyBase';

export class GameScene extends Phaser.Scene {
  private monk!: Monk;
  private juice!: JuiceManager;
  private combat!: CombatManager;
  private parallax!: ParallaxBackground;
  private walls!: Phaser.Physics.Arcade.StaticGroup;
  private spikes!: Phaser.Physics.Arcade.StaticGroup;
  private enemies!: Phaser.Physics.Arcade.Group;
  private collectibles!: Phaser.Physics.Arcade.Group;
  private enemyInstances: EnemyBase[] = [];
  private boss: BossStub | null = null;
  private score = 0;
  private bossTriggered = false;
  private bossDefeated = false;
  private collapsingPlatforms: Phaser.Physics.Arcade.Sprite[] = [];
  private emberEmitters: Phaser.GameObjects.Particles.ParticleEmitter[] = [];
  private gameOver = false;

  constructor() {
    super({ key: 'GameScene' });
  }

  create(): void {
    this.score = 0;
    this.bossTriggered = false;
    this.bossDefeated = false;
    this.gameOver = false;
    this.enemyInstances = [];
    this.collapsingPlatforms = [];
    this.emberEmitters = [];
    this.boss = null;

    this.physics.world.setBounds(0, 0, LEVEL_PIXEL_WIDTH, LEVEL_HEIGHT_TILES * TILE_SIZE);

    this.parallax = new ParallaxBackground(this, LEVEL_PIXEL_WIDTH);
    this.juice = new JuiceManager(this);

    this.walls = this.physics.add.staticGroup();
    this.spikes = this.physics.add.staticGroup();
    this.enemies = this.physics.add.group();
    this.collectibles = this.physics.add.group();

    this.buildLevel();
    this.spawnEntities();

    this.monk = new Monk(
      this,
      48,
      160,
      this.juice,
      () => this.emitHUD(),
      () => this.handleMonkDeath(),
    );

    this.physics.add.collider(this.monk.sprite, this.walls);
    this.physics.add.collider(this.enemies, this.walls);

    this.combat = new CombatManager(
      this,
      this.monk,
      this.juice,
      this.enemies,
      (pts) => this.addScore(pts),
      () => {},
    );
    this.combat.checkProjectileWallCollision(this.walls);

    this.physics.add.overlap(
      this.monk.sprite,
      this.enemies,
      () => this.monk.takeDamage(this.monk.sprite.flipX ? 80 : -80),
    );

    this.physics.add.overlap(
      this.monk.sprite,
      this.spikes,
      () => this.monk.takeDamage(0),
    );

    this.physics.add.overlap(
      this.monk.sprite,
      this.collectibles,
      (_player, item) => this.collectItem(item as Phaser.Physics.Arcade.Sprite),
    );

    this.events.on('monkAttackStart', () => {
      this.combat.setAttackActive(true);
      this.time.delayedCall(150, () => this.combat.setAttackActive(false));
    });

    this.events.on('monkSpiritBlast', () => {
      this.combat.fireProjectile();
    });

    this.cameras.main.setBounds(0, 0, LEVEL_PIXEL_WIDTH, GAME_HEIGHT);
    this.cameras.main.startFollow(this.monk.sprite, true, 0.1, 0.1);
    this.cameras.main.setDeadzone(60, 40);

    this.input.keyboard!.on('keydown-M', () => {
      const muted = sfx.toggleMute();
      this.events.emit('muteChanged', muted);
    });

    this.emitHUD();
  }

  private buildLevel(): void {
    const { tiles, collapsingTiles } = level1;

    for (let y = 0; y < tiles.length; y++) {
      for (let x = 0; x < tiles[y]!.length; x++) {
        const type = tiles[y]![x]!;
        if (type === 0) continue;

        const key = tileKey(type);
        if (!key) continue;

        const px = x * TILE_SIZE + TILE_SIZE / 2;
        const py = y * TILE_SIZE + TILE_SIZE / 2;

        if (type === 3) {
          const spike = this.spikes.create(px, py, key) as Phaser.Physics.Arcade.Sprite;
          spike.setDepth(DEPTH.TILES);
          spike.refreshBody();
        } else if (type === 4) {
          const isCollapsing = collapsingTiles.some((c) => c.x === x && c.y === y);
          if (isCollapsing && y === 11) {
            const plat = this.walls.create(px, py, key) as Phaser.Physics.Arcade.Sprite;
            plat.setDepth(DEPTH.TILES);
            plat.setData('collapsing', true);
            plat.setData('triggered', false);
            plat.refreshBody();
            this.collapsingPlatforms.push(plat);
          } else if (!isCollapsing || y === 12) {
            const tile = this.walls.create(px, py, key) as Phaser.Physics.Arcade.Sprite;
            tile.setDepth(DEPTH.TILES);
            tile.refreshBody();
          }
        } else {
          const tile = this.walls.create(px, py, key) as Phaser.Physics.Arcade.Sprite;
          tile.setDepth(DEPTH.TILES);
          tile.refreshBody();
        }
      }
    }
  }

  private spawnEntities(): void {
    for (const spawn of level1.spawns) {
      if (spawn.type === 'boss') continue;
      this.spawnEntry(spawn);
    }
  }

  private spawnEntry(spawn: SpawnEntry): void {
    switch (spawn.type) {
      case 'flying_demon':
        this.enemyInstances.push(
          new FlyingDemon(this, spawn.x, spawn.y, spawn.patrol ?? 60, this.enemies),
        );
        break;
      case 'hellhound':
        this.enemyInstances.push(
          new Hellhound(this, spawn.x, spawn.y, spawn.patrol ?? 80, this.enemies),
        );
        break;
      case 'imp':
        this.enemyInstances.push(new Imp(this, spawn.x, spawn.y, this.enemies));
        break;
      case 'scroll': {
        const scroll = this.collectibles.create(spawn.x, spawn.y, 'scroll') as Phaser.Physics.Arcade.Sprite;
        scroll.setDepth(DEPTH.PICKUPS);
        scroll.setData('type', 'scroll');
        (scroll.body as Phaser.Physics.Arcade.Body).allowGravity = false;
        const emitter = this.juice.attachEmbers(scroll);
        this.emberEmitters.push(emitter);
        this.tweens.add({
          targets: scroll,
          y: spawn.y - 4,
          duration: 800,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut',
        });
        break;
      }
      case 'coin': {
        const coin = this.collectibles.create(spawn.x, spawn.y, 'coin') as Phaser.Physics.Arcade.Sprite;
        coin.setDepth(DEPTH.PICKUPS);
        coin.setData('type', 'coin');
        (coin.body as Phaser.Physics.Arcade.Body).allowGravity = false;
        this.tweens.add({
          targets: coin,
          angle: 360,
          duration: 2000,
          repeat: -1,
        });
        break;
      }
    }
  }

  private triggerBoss(): void {
    if (this.bossTriggered) return;
    this.bossTriggered = true;

    const spawn = level1.spawns.find((s) => s.type === 'boss')!;

    this.monk.setFrozen(true);
    this.juice.showBossIntro('ARMORED BRUTE', () => {
      this.monk.setFrozen(false);
      sfx.bossRoar();
      this.boss = new BossStub(
        this,
        spawn.x,
        spawn.y,
        this.enemies,
        this.juice,
        () => this.handleBossDefeated(),
      );

      this.physics.add.overlap(this.monk.sprite, this.boss.getShockwaveZone(), () => {
        if (this.boss?.isShockwaveActive()) {
          this.monk.takeDamage(this.monk.sprite.x < this.boss.sprite.x ? -120 : 120);
        }
      });
    });
  }

  private handleBossDefeated(): void {
    if (this.bossDefeated) return;
    this.bossDefeated = true;
    this.addScore(SCORE.BOSS);
    this.time.delayedCall(1000, () => {
      this.scene.stop('UIScene');
      this.scene.start('VictoryScene', { score: this.score });
    });
  }

  private collectItem(item: Phaser.Physics.Arcade.Sprite): void {
    const type = item.getData('type') as string;
    if (type === 'scroll') {
      this.addScore(SCORE.SCROLL);
    } else if (type === 'coin') {
      this.addScore(SCORE.COIN);
    }
    sfx.pickup();
    this.juice.deathSparks(item.x, item.y);
    item.destroy();
  }

  private addScore(pts: number): void {
    this.score += pts;
    this.emitHUD();
  }

  private emitHUD(): void {
    this.events.emit('updateHUD', {
      lives: this.monk.lives,
      score: this.score,
      hp: this.monk.hp,
      maxHp: this.monk.maxHp,
    });
  }

  private handleMonkDeath(): void {
    if (this.gameOver) return;
    if (this.monk.lives > 0) {
      this.time.delayedCall(1000, () => {
        this.monk.sprite.setPosition(48, 160);
        this.monk.sprite.setVelocity(0, 0);
      });
      return;
    }
    this.gameOver = true;
    this.time.delayedCall(1500, () => {
      this.scene.stop('UIScene');
      this.scene.start('GameOverScene', { score: this.score });
    });
  }

  private checkCollapsingPlatforms(): void {
    for (const plat of this.collapsingPlatforms) {
      if (!plat.active || plat.getData('triggered')) continue;
      const monk = this.monk.sprite;
      const dist = Phaser.Math.Distance.Between(monk.x, monk.y, plat.x, plat.y);
      if (dist < 20 && monk.body!.touching.down) {
        plat.setData('triggered', true);
        this.time.delayedCall(500, () => {
          this.juice.crumbleParticles(plat.x, plat.y);
          plat.disableBody(true, true);
        });
      }
    }
  }

  update(_time: number, delta: number): void {
    if (this.gameOver) return;

    this.monk.update(delta, () => this.combat.setAttackActive(false));
    this.combat.updateAttackHitbox();
    this.combat.update(delta);

    // Emit spirit cooldown state every frame for the SP gauge in UIScene
    this.events.emit('updateSpirit', {
      cooldownRatio: this.monk.getSpiritCooldownRatio(),
    });

    const px = this.monk.sprite.x;
    const py = this.monk.sprite.y;

    for (const enemy of this.enemyInstances) {
      if (!enemy.isDead()) enemy.update(delta, px, py);
    }

    if (this.boss && !this.boss.isDead()) {
      this.boss.update(delta, px, py);
    }

    // Trigger boss at arena
    if (!this.bossTriggered && px >= level1.bossArenaX) {
      this.triggerBoss();
    }

    this.parallax.update(this.cameras.main.scrollX);
    this.checkCollapsingPlatforms();
  }
}
