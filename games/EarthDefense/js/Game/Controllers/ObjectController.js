import { ObjectSpawner } from "../Controllers/ObjectSpawner.js";
import { CollisionHandler } from "../Handlers/CollisionHandler.js";
import { Base } from "../Objects/Base.js";
import { Ship } from "../Objects/Ship.js";
import { Missile } from "../Objects/Missile.js";
import { Meteor } from "../Objects/Meteor.js";
import { Asteroid } from "../Objects/Asteroid.js";
import { Explosion } from "../Objects/Explosion.js";

export class ObjectController {
  constructor(gameContext, spriteHandler, inputHandler, commonController) {
    this.context = gameContext;
    this.gameWidth = gameContext.canvas.clientWidth;
    this.gameHeight = gameContext.canvas.clientHeight;
    this.spriteHandler = spriteHandler;
    this.inputHandler = inputHandler;
    this.commonController = commonController;

    this.collisionHandler = new CollisionHandler(this.context);
    this.spawner = new ObjectSpawner(gameContext, spriteHandler);
  }

  init() { 
    this.base = new Base(this.context, this.spriteHandler.character.sprites[0], 0.5);
    this.ship = new Ship(this.context, this.spriteHandler.character.sprites[1], 0.5);
    this.missiles = [];
    this.meteors = [];
    this.asteroids = [];
    this.explosions = [];

    this.missileCooldown = 0;
    this._missilesNumChange = 0;
    this._missilesSpdChange = 0;
    this._missilesDmgChange = 0;
    this._asteroidsNumChange = 0;
    this._asteroidsSpdChange = 0;
    this._asteroidsHPChange = 0;
    this.isOver = false;
    
    this.refresh();
  }

  refresh() {
    this.objects = [this.base, this.ship, ...this.missiles, ...this.meteors, ...this.asteroids, ...this.explosions];
  }
  
  isGameOver() {
    return this.isOver;
  }

  checkGameOver() {
    for (let i = 0; i < this.meteors.length; i++) {
      let meteor = this.meteors[i];
      if (this.collisionHandler.rect_rect(this.base, meteor)) {
        return true;
      }
    }

    for (let i = 0; i < this.asteroids.length; i++) {
      let asteroid = this.asteroids[i];
      if (this.collisionHandler.rect_rect(this.base, asteroid)) {
        return true;
      }
    }
    
    return false;
  }

  update(deltaTime) {
    this.objects.forEach((object) => object.update());

    // Ship Control
    let mousePos = Object.assign({}, this.inputHandler.getMousePosition());
    let shipPos = Object.assign({}, this.ship.getPosition());
    let diffX = mousePos.x - shipPos.x;
    let diffY = mousePos.y - shipPos.y;
    let angle = Math.atan2(diffY, diffX);
    this.ship.setAngle(angle * 180 / Math.PI);
    
    // Missile Spawn
    let dist = Math.sqrt(diffX * diffX + diffY * diffY);
    let shipSize = Object.assign({}, this.ship.getSize());
    if (this.inputHandler.isMouseDown() && !this.missileCooldown) {
      let a = angle;
      let x = shipPos.x + Math.cos(-a) * shipSize.w;
      let y = shipPos.y - Math.sin(-a) * shipSize.h;
      let vStr = 2;
      let vx = Math.cos(-a) * vStr * dist * 0.02;
      let vy = Math.sin(-a) * vStr * dist * 0.02;

      let m = new Missile(this.context, this.spriteHandler.character.sprites[2], x, y, vx, -vy, a * 180 / Math.PI, 0.5);
      this.missiles.push(m);
      this.missileCooldown = 20;
    }
    if (this.missileCooldown) this.missileCooldown--;

    // Meteor Spawn
    if (this.meteors.length <= 0) {
      let meteorNum = 1 + Math.floor(Math.random() * 4)
      for (let i = 0; i < meteorNum; i++) {
        let m = this.spawner.spawnMeteor();
        this.meteors.push(m);
      }
    }

    // Asteroid Spawn
    if (this.asteroids.length <= 0) {
      this.commonController.setLevel(this.commonController.getLevel() + 1);
      this._asteroidsNumChange = Math.floor(this.commonController.getLevel());
      this._asteroidsHPChange = 100 * Math.floor(this.commonController.getLevel() / 5);
      for (let i = 0; i < this._asteroidsNumChange; i++) {
        let maxScale = (100 + this._asteroidsHPChange) / 100;
        let a = this.spawner.spawnAsteroid(maxScale);
        this.asteroids.push(a);
      }
    }

    
    // Missile Destroy
    this.missiles.forEach((missile, missileIndex) => {
      if (isOutBound(missile, this.gameWidth, this.gameHeight)) {
        let explosion = new Explosion(this.context, missile, deltaTime);
        this.explosions.push(explosion);
        this.missiles.splice(missileIndex, 1);
      }
    });

    // Meteor Disappear
    this.meteors.forEach((meteor, meteorIndex) => {
      if (isOutBound(meteor, this.gameWidth, this.gameHeight)) {
        this.meteors.splice(meteorIndex, 1);
      }
    });

    // Asteroid Respawn
    this.asteroids.forEach((asteroid, asteroidIndex) => {
      if (isOutBound(asteroid, this.gameWidth, this.gameHeight)) {
          this.spawner.respawnAsteroid(asteroid);
      }
    });
    
    // Clean explosion
    this.explosions.forEach((explosion, explosionIndex) => {
      if (explosion.isExpired()) this.explosions.splice(explosionIndex, 1);
    })

    // Missiles vs. Meteors and Asteroids
    this.missiles.every((missile, missileIndex) => {
      for (let meteorIndex = 0; meteorIndex < this.meteors.length; meteorIndex++) {
        let meteor = this.meteors[meteorIndex];
        if (this.collisionHandler.rect_rect(missile, meteor)) {
          let explosion = new Explosion(this.context, meteor, deltaTime);
          this.explosions.push(explosion);
          this.missiles.splice(missileIndex, 1);
          this.meteors.splice(meteorIndex, 1);
          this.commonController.setScore(this.commonController.getScore() + this.commonController.getLevel());

          return true;
        }
      } 
      
      for (let asteroidIndex = 0; asteroidIndex < this.asteroids.length; asteroidIndex++) {
        let asteroid = this.asteroids[asteroidIndex];
        if (this.collisionHandler.rect_rect(missile, asteroid)) {
          let explosion = new Explosion(this.context, asteroid, deltaTime);
          this.explosions.push(explosion);
          let dmgDealt = 0.1;
          dmgDealt *= (100 + this._missilesDmgChange) / 100;
          asteroid.setScale(asteroid.getScale() - dmgDealt);
          
          if (asteroid.getScale() <= 0.1) {
            this.asteroids.splice(asteroidIndex, 1);
            this.commonController.setScore(this.commonController.getScore() + this.commonController.getLevel() * 5); 
          } else { 
            if (asteroid.getScale() > 0.2) {
              let parentPosition = Object.assign({}, asteroid.getPosition());
              let parentScale = asteroid.getScale();
              let x;
              let y;
              let a = Math.random() * 360 * Math.PI / 180;
              let vStr = 2;
              let vx = Math.cos(-a) * vStr;
              let vy = Math.sin(-a) * vStr;
              let scale = 0.15;
              x = parentPosition.x + vx * 5;
              y = parentPosition.y + vy * 5;
              scale += (parentScale - scale) * Math.random();
              let asteroidJr = new Asteroid(this.context, asteroid.getSprite(), x, y, vx, -vy, a * 180 / Math.PI, scale);
              this.asteroids.push(asteroidJr);
            }      
          }
          this.missiles.splice(missileIndex, 1);

          return true;
        }
      }

      return true;
    });

    this.refresh();
  }

  draw() {
    this.objects.forEach((object) => object.draw());
  }
}

/**
 * Check if an object is out of bound
 * @param {Object} object 
 */
function isOutBound (object, width, height) {
  let pos = object.getPosition();
  
  return (
    pos.x < 0 || 
    pos.x > width ||
    pos.y < 0 || 
    pos.y > height
  );
}