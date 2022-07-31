import { Base } from "../Objects/Base.js";
import { Ship } from "../Objects/Ship.js";
import { Missile } from "../Objects/Missile.js";
import { Meteor } from "../Objects/Meteor.js";
import { Asteroid } from "../Objects/Asteroid.js";
import { Explosion } from "../Objects/Explosion.js";

export class ObjectSpawner {
  constructor(context, spriteHandler) {
    this.context = context;
    this.gameWidth = this.context.canvas.clientWidth;
    this.gameHeight = this.context.canvas.clientHeight;
    this.spriteHandler = spriteHandler;
  }
  
  spawnMeteor() {
    let x;
    let y;
    let a;
    let vStr = Math.random() * 4;
    if (Math.random() < 0.5) {
      if (Math.random() < 0.5) {
        x = 0.05 * this.gameWidth;
        a = (Math.random() * 90) * Math.PI / 180;
      } else {
        x = 0.95 * this.gameWidth;
        a = (Math.random() * 90 + 90) * Math.PI / 180;
      }
      if (Math.random() < 0.5){
        y = (Math.random() * 0.5 + 0.05) * this.gameHeight;
        a *= -1;
      } else {
        y = this.gameHeight - (Math.random() * 0.5 + 0.05) * this.gameHeight;
        a *= 1;
      }
      vStr = 2 + Math.random() * 2;
    } else {
      if (Math.random() < 0.5) {
        y = 0.05 * this.gameHeight;
        a = 1;
      } else {
        y = 0.95 * this.gameHeight;
        a = -1;
      }
      if (Math.random() < 0.5){
        x  = (Math.random() * 0.9 + 0.05) * this.gameWidth; 
        a *= (Math.random() * 90) * Math.PI / 180;
      } else {
        x  = this.gameWidth - (Math.random() * 0.9 + 0.05) * this.gameWidth; 
        a *= (Math.random() * 90 + 90) * Math.PI / 180;
      }
      vStr = Math.random() * 2;
    }
    let vx = Math.cos(-a) * (vStr + 1);
    let vy = Math.sin(-a) * (vStr + 1);
    return new Meteor(this.context, this.spriteHandler.character.sprites[3], x, y, vx, -vy, a * 180 / Math.PI, 0.5);
  }
  
  spawnAsteroid(maxScale = 1) {
    let type = 4 + Math.floor(Math.random() * 5);
    let x;
    let y;
    if (Math.random() < 0.5) {
      if (Math.random() < 0.5) {
        x = 0.05 * this.gameWidth;
      } else {
        x = 0.95 * this.gameWidth;
      }
      y = (Math.random() * 0.9 + 0.05) * this.gameHeight;
    } else {
      x  = (Math.random() * 0.9 + 0.05) * this.gameWidth; 
      if (Math.random() < 0.5) {
        y = 0.05 * this.gameHeight;
      } else {
        y = 0.95 * this.gameHeight;
      }
    }
    let a = Math.random() * 360 * Math.PI / 180;
    let vStr = 2;
    let vx = Math.cos(-a) * vStr;
    let vy = Math.sin(-a) * vStr;
    let scale = 0.15;
    scale += scale * (maxScale * Math.random());
    return new Asteroid(this.context, this.spriteHandler.character.sprites[type], x, y, vx, -vy, a * 180 / Math.PI, scale);
  }

  respawnAsteroid(asteroid) {
    let x;
    let y;
    if (Math.random() < 0.5) {
      if (Math.random() < 0.5) {
        x = 0.05 * this.gameWidth;
      } else {
        x = 0.95 * this.gameWidth;
      }
      y = (Math.random() * 0.9 + 0.05) * this.gameHeight;
    } else {
      x  = (Math.random() * 0.9 + 0.05) * this.gameWidth; 
      if (Math.random() < 0.5) {
        y = 0.05 * this.gameHeight;
      } else {
        y = 0.95 * this.gameHeight;
      }
    }
    let a = Math.random() * 360 * Math.PI / 180;
    let vStr = 2;
    let vx = Math.cos(-a) * vStr;
    let vy = Math.sin(-a) * vStr;
    asteroid.setPosition(x, y);
    asteroid.setAngle(a * 180 / Math.PI);
    asteroid.setVelocity(vx, -vy);
  }
}