import Phaser from 'phaser';
import { DEPTH } from '../game/constants';
import { Monk } from '../entities/Monk';
import { Projectile } from '../entities/Projectile';
import { JuiceManager } from './JuiceManager';
import { sfx } from '../utils/SfxManager';

export interface Damageable {
  sprite: Phaser.Physics.Arcade.Sprite;
  takeDamage(amount: number, knockbackX?: number): void;
  isDead(): boolean;
}

export class CombatManager {
  private scene: Phaser.Scene;
  private monk: Monk;
  private juice: JuiceManager;
  private projectiles: Phaser.Physics.Arcade.Group;
  private enemies: Phaser.Physics.Arcade.Group;
  private attackHitbox!: Phaser.GameObjects.Zone;
  private attackActive = false;
  private hitThisSwing = new Set<Phaser.Physics.Arcade.Sprite>();
  private hitCount = 0;
  private hitTimer = 0;
  private onScore: (pts: number) => void;
  private onEnemyKilled: () => void;

  constructor(
    scene: Phaser.Scene,
    monk: Monk,
    juice: JuiceManager,
    enemies: Phaser.Physics.Arcade.Group,
    onScore: (pts: number) => void,
    onEnemyKilled: () => void,
  ) {
    this.scene = scene;
    this.monk = monk;
    this.juice = juice;
    this.enemies = enemies;
    this.onScore = onScore;
    this.onEnemyKilled = onEnemyKilled;

    this.projectiles = scene.physics.add.group({
      classType: Projectile,
      maxSize: 10,
      runChildUpdate: true,
    });

    this.attackHitbox = scene.add.zone(0, 0, 20, 14).setDepth(DEPTH.EFFECTS);
    scene.physics.add.existing(this.attackHitbox, false);
    const hitBody = this.attackHitbox.body as Phaser.Physics.Arcade.Body;
    hitBody.setAllowGravity(false);
    hitBody.enable = false;

    scene.physics.add.overlap(
      this.attackHitbox,
      this.enemies,
      (_zone, enemy) => {
        if (!this.attackActive) return;
        const e = enemy as Phaser.Physics.Arcade.Sprite;
        if (this.hitThisSwing.has(e)) return;
        this.hitThisSwing.add(e);
        this.damageEnemy(e, 1, 80);
      },
    );

    scene.physics.add.overlap(
      this.projectiles,
      this.enemies,
      (_proj, enemy) => {
        const e = enemy as Phaser.Physics.Arcade.Sprite;
        this.damageEnemy(e, 2, 120);
        const proj = _proj as Projectile;
        proj.deactivate();
      },
    );
  }

  getProjectileGroup(): Phaser.Physics.Arcade.Group {
    return this.projectiles;
  }

  updateAttackHitbox(): void {
    const monk = this.monk.sprite;
    const facing = monk.flipX ? -1 : 1;
    this.attackHitbox.setPosition(monk.x + facing * 14, monk.y);
  }

  setAttackActive(active: boolean): void {
    this.attackActive = active;
    const body = this.attackHitbox.body as Phaser.Physics.Arcade.Body;
    body.enable = active;
    if (active) {
      this.hitThisSwing.clear();
      sfx.attack();
      this.updateAttackHitbox();
    }
  }

  fireProjectile(): void {
    if (!this.monk.canFireSpirit()) return;
    sfx.spiritBlast();
    const monk = this.monk.sprite;
    const facing = monk.flipX ? -1 : 1;
    let proj = this.projectiles.getFirstDead(false) as Projectile | null;
    if (!proj) {
      proj = new Projectile(this.scene, monk.x + facing * 10, monk.y - 2);
      this.projectiles.add(proj);
    } else {
      proj.fire(monk.x + facing * 10, monk.y - 2, facing);
    }
    this.monk.onSpiritFired();
  }

  private damageEnemy(
    enemy: Phaser.Physics.Arcade.Sprite,
    amount: number,
    knockback: number,
  ): void {
    const damageable = enemy.getData('damageable') as Damageable | undefined;
    if (!damageable || damageable.isDead()) return;

    const facing = this.monk.sprite.flipX ? -1 : 1;
    damageable.takeDamage(amount, facing * knockback);
    this.juice.hitFlash(enemy);
    this.juice.screenShake(0.004, 60);

    if (damageable.isDead()) {
      this.juice.deathSparks(enemy.x, enemy.y);
      sfx.enemyDeath();
      this.hitCount++;
      this.hitTimer = 2000;
      this.onScore(100);
      this.onEnemyKilled();
      this.scene.events.emit('showHit', this.hitCount);
    } else {
      sfx.hit();
    }
  }

  update(dt: number): void {
    if (this.hitTimer > 0) {
      this.hitTimer -= dt;
      if (this.hitTimer <= 0) this.hitCount = 0;
    }

    this.projectiles.children.each((child) => {
      const p = child as Projectile;
      if (p.active) p.update();
      return false;
    });
  }

  checkProjectileWallCollision(walls: Phaser.Physics.Arcade.StaticGroup): void {
    this.scene.physics.add.overlap(this.projectiles, walls, (proj) => {
      (proj as Projectile).deactivate();
    });
  }
}
