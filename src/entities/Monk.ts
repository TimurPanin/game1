import Phaser from 'phaser';
import { DEPTH, PHYSICS } from '../game/constants';
import { JuiceManager } from '../systems/JuiceManager';
import { sfx } from '../utils/SfxManager';

export class Monk {
  sprite: Phaser.Physics.Arcade.Sprite;
  lives = 3;
  private scene: Phaser.Scene;
  private juice: JuiceManager;
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private keyZ: Phaser.Input.Keyboard.Key;
  private keyX: Phaser.Input.Keyboard.Key;
  private keySpace: Phaser.Input.Keyboard.Key;
  private keyW: Phaser.Input.Keyboard.Key;
  private keyA: Phaser.Input.Keyboard.Key;
  private keyD: Phaser.Input.Keyboard.Key;
  private keyK: Phaser.Input.Keyboard.Key;
  private wasOnGround = false;
  private coyoteTimer = 0;
  private jumpBufferTimer = 0;
  private invincible = false;
  private comboStep = 0;
  private comboTimer = 0;
  private attacking = false;
  private attackTimer = 0;
  private spiritCooldown = 0;
  private spiritCharge = 0;
  private chargingSpirit = false;
  private frozen = false;
  private onDamage: () => void;
  private onDeath: () => void;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    juice: JuiceManager,
    onDamage: () => void,
    onDeath: () => void,
  ) {
    this.scene = scene;
    this.juice = juice;
    this.onDamage = onDamage;
    this.onDeath = onDeath;

    this.sprite = scene.physics.add
      .sprite(x, y, 'monk', 'monk_0')
      .setDepth(DEPTH.PLAYER)
      .setCollideWorldBounds(true);

    this.sprite.setSize(12, 14);
    this.sprite.setOffset(2, 2);

    this.cursors = scene.input.keyboard!.createCursorKeys();
    this.keyZ = scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
    this.keyX = scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.X);
    this.keySpace = scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    this.keyW = scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.keyA = scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.keyD = scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.keyK = scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.K);

    this.keyW.on('down', () => this.tryJump());
    this.keyK.on('down', () => this.handleAttackKey());
    this.keyK.on('up', () => this.releaseSpiritCharge());

    this.keyZ.on('down', () => this.tryJump());
    this.keySpace.on('down', () => this.tryJump());
    this.keyX.on('down', () => this.handleAttackKey());
    this.keyX.on('up', () => this.releaseSpiritCharge());
  }

  private handleAttackKey(): void {
    if (this.chargingSpirit) return;
    this.chargingSpirit = true;
    this.spiritCharge = 0;
  }

  private releaseSpiritCharge(): void {
    if (!this.chargingSpirit) return;
    this.chargingSpirit = false;
    if (this.spiritCharge >= PHYSICS.SPIRIT_CHARGE_MS && this.spiritCooldown <= 0) {
      this.scene.events.emit('monkSpiritBlast');
    } else if (this.spiritCharge < PHYSICS.SPIRIT_CHARGE_MS) {
      this.startAttack();
    }
  }

  private startAttack(): void {
    if (this.attacking || this.frozen) return;
    this.attacking = true;
    this.attackTimer = 200;
    this.sprite.setTexture('monk', 'monk_2');
    this.scene.events.emit('monkAttackStart');

    if (this.comboTimer > 0) {
      this.comboStep = (this.comboStep + 1) % 3;
    } else {
      this.comboStep = 0;
    }
    this.comboTimer = PHYSICS.COMBO_WINDOW_MS;
  }

  private tryJump(): void {
    if (this.frozen) return;
    this.jumpBufferTimer = PHYSICS.JUMP_BUFFER_MS;
  }

  private doJump(): void {
    this.sprite.setVelocityY(PHYSICS.MONK_JUMP);
    this.sprite.setTexture('monk', 'monk_3');
    sfx.jump();
    this.coyoteTimer = 0;
    this.jumpBufferTimer = 0;
  }

  canFireSpirit(): boolean {
    return this.spiritCooldown <= 0 && !this.frozen;
  }

  onSpiritFired(): void {
    this.spiritCooldown = PHYSICS.SPIRIT_COOLDOWN_MS;
  }

  takeDamage(knockbackX = 0): void {
    if (this.invincible || this.frozen) return;
    this.lives--;
    this.invincible = true;
    sfx.damage();
    this.onDamage();

    this.sprite.setVelocityX(knockbackX);
    this.sprite.setVelocityY(-100);

    this.scene.tweens.add({
      targets: this.sprite,
      alpha: 0.3,
      duration: 100,
      yoyo: true,
      repeat: 7,
      onComplete: () => {
        this.sprite.setAlpha(1);
        this.invincible = false;
      },
    });

    this.scene.time.delayedCall(PHYSICS.IFRAME_MS, () => {
      this.invincible = false;
      this.sprite.setAlpha(1);
    });

    if (this.lives <= 0) {
      this.onDeath();
    }
  }

  setFrozen(frozen: boolean): void {
    this.frozen = frozen;
    if (frozen) {
      this.sprite.setVelocity(0, 0);
    }
  }

  isAttacking(): boolean {
    return this.attacking;
  }

  update(dt: number, onAttackEnd: () => void): void {
    if (this.frozen) return;

    const body = this.sprite.body as Phaser.Physics.Arcade.Body;
    const onGround = body.blocked.down || body.touching.down;

    if (onGround) {
      this.coyoteTimer = PHYSICS.COYOTE_MS;
      if (!this.wasOnGround && body.velocity.y >= 0) {
        this.juice.landingDust(this.sprite.x, this.sprite.y + 7);
        sfx.land();
      }
    } else {
      this.coyoteTimer = Math.max(0, this.coyoteTimer - dt);
    }
    this.wasOnGround = onGround;

    if (this.jumpBufferTimer > 0) {
      this.jumpBufferTimer -= dt;
      if (this.coyoteTimer > 0) this.doJump();
    }

    // Movement
    let moveX = 0;
    if (this.cursors.left.isDown || this.keyA.isDown) {
      moveX = -PHYSICS.MONK_SPEED;
      this.sprite.setFlipX(true);
    } else if (this.cursors.right.isDown || this.keyD.isDown) {
      moveX = PHYSICS.MONK_SPEED;
      this.sprite.setFlipX(false);
    }

    if (!this.attacking) {
      this.sprite.setVelocityX(moveX);
    } else {
      this.sprite.setVelocityX(moveX * 0.3);
    }

    // Animation
    if (!this.attacking) {
      if (!onGround) {
        this.sprite.setTexture('monk', 'monk_3');
      } else if (moveX !== 0) {
        const frame = Math.floor(this.scene.time.now / 200) % 2;
        this.sprite.setTexture('monk', frame === 0 ? 'monk_0' : 'monk_1');
      } else {
        this.sprite.setTexture('monk', 'monk_0');
      }
    }

    // Attack timer
    if (this.attacking) {
      this.attackTimer -= dt;
      if (this.attackTimer <= 0) {
        this.attacking = false;
        onAttackEnd();
      }
    }

    if (this.comboTimer > 0) this.comboTimer -= dt;

    if (this.chargingSpirit) {
      this.spiritCharge += dt;
      if (this.spiritCharge >= PHYSICS.SPIRIT_CHARGE_MS) {
        this.sprite.setTint(0xffe566);
      }
    } else {
      this.sprite.clearTint();
    }

    if (this.spiritCooldown > 0) this.spiritCooldown -= dt;
  }
}
