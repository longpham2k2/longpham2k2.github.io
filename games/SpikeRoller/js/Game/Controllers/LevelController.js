import { CollisionHandler } from "../Handlers/CollisionHandler.js";
import { Player } from "../Objects/Player.js";
import { buildLevel1 } from "../Levels/level1.js";
import { PHYSICS } from "../config.js";

/**
 * Owns the player and the level, runs the physics + collisions, and reports
 * back to Game ("WON" when the flag is reached). This is the platformer's
 * analog of Earth Defense's ObjectController.
 */
export class LevelController {
  constructor(gameContext, inputHandler, commonController) {
    this.context = gameContext;
    this.gameWidth = gameContext.canvas.clientWidth;
    this.gameHeight = gameContext.canvas.clientHeight;
    this.input = inputHandler;
    this.common = commonController;

    this.collision = new CollisionHandler();
    this.cameraX = 0;
    this.reset();
  }

  reset() {
    this.level = buildLevel1(this.context);
    this.player = new Player(this.context, this.level.spawn.x, this.level.spawn.y);
    this.won = false;
    this.cameraX = 0;
  }

  respawn() {
    this.player.position.x = this.level.spawn.x;
    this.player.position.y = this.level.spawn.y;
    this.player.velocity.x = 0;
    this.player.velocity.y = 0;
    this.player.angle = 0;
  }

  getCameraX() {
    return this.cameraX;
  }

  update(deltaTime) {
    const p = this.player;
    // Normalize to 60fps units and clamp so a lag spike can't tunnel the ball.
    const dt = Math.min(deltaTime / (1000 / 60), 2) || 0;

    // --- Horizontal input → target speed (accel gives the ball weight) ---
    const dir = (this.input.isPressed("RIGHT") ? 1 : 0) - (this.input.isPressed("LEFT") ? 1 : 0);
    const accel = p.onGround ? PHYSICS.GROUND_ACCEL : PHYSICS.AIR_ACCEL;
    if (dir !== 0) {
      p.velocity.x += dir * accel * PHYSICS.MOVE_SPEED * dt;
      p.velocity.x = clamp(p.velocity.x, -PHYSICS.MOVE_SPEED, PHYSICS.MOVE_SPEED);
    } else if (p.onGround) {
      p.velocity.x *= Math.pow(PHYSICS.FRICTION, dt);
    }

    // --- Jump with coyote time + input buffering ---
    if (this.input.isTriggered("JUMP")) p.jumpBuffer = PHYSICS.JUMP_BUFFER;
    p.jumpBuffer = Math.max(0, p.jumpBuffer - dt);
    p.coyote = Math.max(0, p.coyote - dt);
    if (p.jumpBuffer > 0 && p.coyote > 0) {
      p.velocity.y = -PHYSICS.JUMP_STRENGTH;
      p.jumpBuffer = 0;
      p.coyote = 0;
      p.onGround = false;
    }

    // --- Integrate, then resolve against platforms ---
    p.update(dt);

    const wasAir = !p.onGround;
    p.onGround = false;
    for (let pass = 0; pass < 2; pass++) {
      for (const plat of this.level.platforms) {
        if (this.collision.resolveRect(p, plat)) p.onGround = true;
      }
    }
    if (p.onGround) {
      p.coyote = PHYSICS.COYOTE_FRAMES;
      if (wasAir) p.squash = 0.6; // just landed → squash
    }

    // Keep the ball inside the world horizontally.
    p.position.x = clamp(p.position.x, p.r, this.level.width - p.r);

    // --- Death: spike touch or falling into a pit ---
    for (const spike of this.level.spikes) {
      if (this.collision.hitsTriangle(p, spike)) {
        this.common.addDeath();
        this.respawn();
        this.updateCamera();
        return;
      }
    }
    if (p.position.y - p.r > this.gameHeight) {
      this.common.addDeath();
      this.respawn();
      this.updateCamera();
      return;
    }

    this.updateCamera();

    // --- Win: reached the flag ---
    const g = this.level.goal;
    if (rectsOverlap(p.position.x - p.r, p.position.y - p.r, p.r * 2, p.r * 2, g.x, g.y, g.w, g.h)) {
      this.won = true;
      return "WON";
    }
  }

  updateCamera() {
    this.cameraX = clamp(
      this.player.position.x - this.gameWidth * 0.4,
      0,
      Math.max(0, this.level.width - this.gameWidth)
    );
  }

  draw() {
    const ctx = this.context;
    ctx.save();
    ctx.translate(-this.cameraX, 0); // world → screen
    for (const plat of this.level.platforms) plat.draw();
    for (const spike of this.level.spikes) spike.draw();
    this.level.goal.draw(this.won);
    this.player.draw();
    ctx.restore();
  }
}

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const rectsOverlap = (ax, ay, aw, ah, bx, by, bw, bh) =>
  ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
