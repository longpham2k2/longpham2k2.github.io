import {ImagePreloader, InputHandler, CollisionHandler, JSONPreloader} from "./game_core.js";
import {Base, Ship, Missile, Meteor, Asteroid, Explosion, Button} from "./game_objects.js";

const GAME_STATE = {
    LOADING: 0,
    MENU: 1,
    RUNNING: 2,
    PAUSED: 3,
    OVER: 4
};
class Game {
    constructor(canvasContext) {
        if (!(canvasContext instanceof CanvasRenderingContext2D)) {
            throw new TypeError(canvasContext + 
                ' is not a canvas context.');
        } 
        this.context = canvasContext;
        this.width = this.context.canvas.clientWidth;
        this.height = this.context.canvas.clientHeight;
        this._state;
        this._collisionHandler = new CollisionHandler(this.context);
        this._inputHandler = new InputHandler(this.context, './data/key_config.json');
        this._imgHandler = {};

        this._objects = [];
        this._buttons = [];
        this._base;
        this._ship;
        this._missiles = [];
        this._meteors = [];
        this._asteroids = [];
        this._explosions = [];
    
        this._time;
        this._score;
        this._level;
        this._cooldown;
    
        this._missilesNumChange;
        this._missilesSpdChange;
        this._missilesDmgChange;
        this._asteroidsNumChange;
        this._asteroidsSpdChange;
        this._asteroidsHPChange;

        this._state = GAME_STATE.LOADING;
        this._imgHandler.sprite = {};
        this._imgHandler.sprite.nameLoader = new JSONPreloader('sprite', './data/');
        this._imgHandler.system = {};
        this._imgHandler.system.nameLoader = new JSONPreloader('system', './data/');
        this._imgPhase1 = false;
        this._imgPhase2 = false;
    }
    refreshObjects() {
        this._objects = [this._base, this._ship, ...this._missiles, ...this._meteors, ...this._asteroids, ...this._explosions];
    }
    newStart() {
        this._buttons = {};
        this._buttons.pauseButton = new Button(this.context, this._imgHandler.system.cache[1], this.width/2, 25, 0, 50, 50);

        this._base = new Base(this.context, this._imgHandler.sprite.cache[0], 0.5);
        this._ship = new Ship(this.context, this._imgHandler.sprite.cache[1], 0.5);
        this._missiles = [];
        this._meteors = [];
        this._asteroids = [];
        this._explosions = [];
        this.refreshObjects();

        this._time = 0;
        this._score = 0;
        this._level = 0;
        this._cooldown = 0;
        this._missilesNumChange = 0;
        this._missilesSpdChange = 0;
        this._missilesDmgChange = 0;
        this._asteroidsNumChange = 0;
        this._asteroidsSpdChange = 0;
        this._asteroidsHPChange = 0;
    }
    update(deltaTime){
        switch (this._state) {
            case GAME_STATE.LOADING:
                if (!this._imgPhase1) {
                    let nameLoaded = true;
                    for (let key of Object.keys(this._imgHandler)) {
                        let imgSet = this._imgHandler[key];
                        nameLoaded = (nameLoaded && imgSet.nameLoader.isCompleted());
                    }
                    
                    if (nameLoaded) {
                        for (let key of Object.keys(this._imgHandler)) {
                            let imgSet = this._imgHandler[key];
                            let nameData = Object.assign({}, imgSet.nameLoader.getData());

                            imgSet.name = [...nameData.name];
                            let namePrefix = nameData.prefix;
                            let namePostfix = nameData.postfix;
                            imgSet.loader = new ImagePreloader(imgSet.name, './img/' + key + '/', namePrefix, namePostfix);
                        }
                        this._imgPhase1 = true;
                    }
                } else if (!this._imgPhase2) {
                    let imgLoaded = true;
                    for (let key of Object.keys(this._imgHandler)) {
                        let imgSet = this._imgHandler[key];
                        imgLoaded = (imgLoaded && imgSet.loader.isCompleted());
                    }

                    if (imgLoaded) {
                        for (let key of Object.keys(this._imgHandler)) {
                            let imgSet = this._imgHandler[key];
                            imgSet.cache = [...imgSet.loader.getBitmaps()];
                        }
    
                        this._state = GAME_STATE.MENU;
                    }
                }
            break;
            case GAME_STATE.MENU:
                if (this._inputHandler.isTriggered("ACCEPT")) {
                    this.newStart();

                    this._state = GAME_STATE.RUNNING;
                }
            break;
            case GAME_STATE.RUNNING:
                this._objects.forEach((object) => object.update()); 
                Object.keys(this._buttons).forEach((key) => {
                    this._buttons[key].update();
                });
                this._time += deltaTime;
                
                // Ship Control
                let mousePos = Object.assign({}, this._inputHandler.getMousePosition());
                let shipPos = Object.assign({}, this._ship.getPosition());
                let diffX = mousePos.x - shipPos.x;
                let diffY = mousePos.y - shipPos.y;
                let angle = Math.atan2(diffY, diffX);
                this._ship.setAngle(angle * 180 / Math.PI);
                
                // Missile Spawn
                let dist = Math.sqrt(diffX * diffX + diffY * diffY);
                let shipSize = Object.assign({}, this._ship.getSize());
                if (this._inputHandler.isMouseDown() && !this._cooldown) {
                    let a = angle;
                    let x = shipPos.x + Math.cos(-a) * shipSize.w;
                    let y = shipPos.y - Math.sin(-a) * shipSize.h;
                    let vStr = 2;
                    let vx = Math.cos(-a) * vStr * dist * 0.02;
                    let vy = Math.sin(-a) * vStr * dist * 0.02;

                    let m = new Missile(this.context, this._imgHandler.sprite.cache[2], x, y, vx, -vy, a * 180 / Math.PI, 0.5);
                    this._missiles.push(m);
                    this._cooldown = 20;
                }
                if (this._cooldown) this._cooldown--;
                
                // Meteor Spawn
                if (this._meteors.length <= 0) {
                    let meteorNum = 1 + Math.floor(Math.random() * 4)
                    for (let i = 0; i < meteorNum; i++) {
                        let x;
                        let y;
                        let a;
                        let vStr = Math.random() * 4;
                        if (Math.random() < 0.5) {
                            if (Math.random() < 0.5) {
                                x = 0.05 * this.width;
                                a = (Math.random() * 90) * Math.PI / 180;
                            } else {
                                x = 0.95 * this.width;
                                a = (Math.random() * 90 + 90) * Math.PI / 180;
                            }
                            if (Math.random() < 0.5){
                                y = (Math.random() * 0.5 + 0.05) * this.height;
                                a *= -1;
                            } else {
                                y = this.height - (Math.random() * 0.5 + 0.05) * this.height;
                                a *= 1;
                            }
                            vStr = 2 + Math.random() * 2;
                        } else {
                            if (Math.random() < 0.5) {
                                y = 0.05 * this.height;
                                a = 1;
                            } else {
                                y = 0.95 * this.height;
                                a = -1;
                            }
                            if (Math.random() < 0.5){
                                x  = (Math.random() * 0.9 + 0.05) * this.width; 
                                a *= (Math.random() * 90) * Math.PI / 180;
                            } else {
                                x  = this.width - (Math.random() * 0.9 + 0.05) * this.width; 
                                a *= (Math.random() * 90 + 90) * Math.PI / 180;
                            }
                            vStr = Math.random() * 2;
                        }
                        let vx = Math.cos(-a) * (vStr + 1);
                        let vy = Math.sin(-a) * (vStr + 1);
                        let m = new Meteor(this.context, this._imgHandler.sprite.cache[3], x, y, vx, -vy, a * 180 / Math.PI, 0.5);
                        this._meteors.push(m);
                    }
                }

                // Asteroid Spawn
                if (this._asteroids.length <= 0) {
                    this._level += 1;
                    this._asteroidsNumChange = Math.floor(this._level);
                    this._asteroidsHPChange = 100 * Math.floor(this._level / 5);
                    for (let i = 0; i < this._asteroidsNumChange; i++) {
                        let type = 4 + Math.floor(Math.random() * 5);
                        let x;
                        let y;
                        if (Math.random() < 0.5) {
                            if (Math.random() < 0.5) {
                                x = 0.05 * this.width;
                            } else {
                                x = 0.95 * this.width;
                            }
                            y = (Math.random() * 0.9 + 0.05) * this.height;
                        } else {
                            x  = (Math.random() * 0.9 + 0.05) * this.width; 
                            if (Math.random() < 0.5) {
                                y = 0.05 * this.height;
                            } else {
                                y = 0.95 * this.height;
                            }
                        }
                        let a = Math.random() * 360 * Math.PI / 180;
                        let vStr = 2;
                        let vx = Math.cos(-a) * vStr;
                        let vy = Math.sin(-a) * vStr;
                        let scale = 0.15;
                        let maxScale = scale * (100 + this._asteroidsHPChange) / 100;
                        scale += (maxScale - scale) * Math.random();
                        let asteroid = new Asteroid(this.context, this._imgHandler.sprite.cache[type], x, y, vx, -vy, a * 180 / Math.PI, scale);
                        this._asteroids.push(asteroid);
                    }
                }

                // Missile Destroy
                this._missiles.forEach((missile, missileIndex) => {
                    // Out of bound
                    if (missile.position.x < 0 || missile.position.x > this.width ||
                        missile.position.y < 0 || missile.position.y > this.height) {
                            let explosion = new Explosion(this.context, missile, deltaTime);
                            this._explosions.push(explosion);
                            this._missiles.splice(missileIndex, 1);
                    }
                });
                
                // Meteor Disappear
                this._meteors.forEach((meteor, meteorIndex) => {
                    // Out of bound
                    if (meteor.position.x < 0 || meteor.position.x > this.width ||
                        meteor.position.y < 0 || meteor.position.y > this.height) {
                            this._meteors.splice(meteorIndex, 1);
                    }
                });
                
                // Asteroid Respawn
                this._asteroids.forEach((asteroid, asteroidIndex) => {
                    // Out of bound
                    if (asteroid.position.x < 0 || asteroid.position.x > this.width ||
                        asteroid.position.y < 0 || asteroid.position.y > this.height) {
                        let x;
                        let y;
                        if (Math.random() < 0.5) {
                            if (Math.random() < 0.5) {
                                x = 0.05 * this.width;
                            } else {
                                x = 0.95 * this.width;
                            }
                            y = (Math.random() * 0.9 + 0.05) * this.height;
                        } else {
                            x  = (Math.random() * 0.9 + 0.05) * this.width; 
                            if (Math.random() < 0.5) {
                                y = 0.05 * this.height;
                            } else {
                                y = 0.95 * this.height;
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
                });
                
                // Missiles vs. Meteors
                this._missiles.forEach((missile, missileIndex) => {
                    this._meteors.forEach((meteor, meteorIndex) => {
                        if (this._collisionHandler.rect_rect(missile, meteor)) {
                            let explosion = new Explosion(this.context, meteor, deltaTime);
                            this._explosions.push(explosion);
                            this._missiles.splice(missileIndex, 1);
                            this._meteors.splice(meteorIndex, 1);
                            this._score += this._level * 1;
                        }
                    });
                });
                // Missiles vs. Asteroids
                this._missiles.forEach((missile, missileIndex) => {
                    this._asteroids.forEach((asteroid, asteroidIndex) => {
                        if (this._collisionHandler.rect_rect(missile, asteroid)) {
                            let explosion = new Explosion(this.context, asteroid, deltaTime);
                            this._explosions.push(explosion);
                            let dmgDealt = 0.1;
                            dmgDealt *= (100 + this._missilesDmgChange) / 100;
                            asteroid.setScale(asteroid.getScale() - dmgDealt);
                            
                            if (asteroid.getScale() <= 0.1) {
                                this._asteroids.splice(asteroidIndex, 1);
                                this._score += this._level * 5;
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
                                    this._asteroids.push(asteroidJr);
                                }
                                
                            }
                            this._missiles.splice(missileIndex, 1);
                        }
                    });
                });
                
                // Base vs. All
                let colli = false;
                for (let i = 0; i < this._meteors.length; i++) {
                    let mete = this._meteors[i];
                    if (this._collisionHandler.rect_rect(this._base, mete)) colli = true;
                }
                for (let i = 0; i < this._asteroids.length; i++) {
                    let aste = this._asteroids[i];
                    if (this._collisionHandler.rect_rect(this._base, aste)) colli = true;
                }
                // Clean explosion
                this._explosions.forEach((explosion, explosionIndex) => {
                    if (explosion.isExpired()) this._explosions.splice(explosionIndex, 1);
                })
                this.refreshObjects();

                if (colli) {
                    this._state = GAME_STATE.OVER; 
                    let index = 0;
                    Object.keys(this._buttons).forEach((key) => {
                        this._buttons[key].changeSprite(this._imgHandler.system.cache[index])
                        index = index + 2;
                    });
                }
                if (this._inputHandler.isTriggered("ACCEPT")) {
                    this._state = GAME_STATE.PAUSED;
                }
            break;
            case GAME_STATE.PAUSED:
                if (this._inputHandler.isTriggered("ACCEPT")) {
                    this._state = GAME_STATE.RUNNING;
                }
            break;
            case GAME_STATE.OVER:
                if (this._inputHandler.isTriggered("ACCEPT")) {
                    this._state = GAME_STATE.MENU;
                }
            break;
        }
    }
    draw(){
        let second = Math.floor(this._time / 1000);
        let minute = Math.floor(second / 60); 
        second = second % 60;
        if (minute < 10) minute = "0" + minute;
        if (second < 10) second = "0" + second;

        switch (this._state) {
            case GAME_STATE.LOADING:
                this.context.save();
                this.context.textAlign = 'center';
                this.context.textBaseline = 'middle';
                this.context.font = '20px Arial';
                this.context.fillStyle = 'black';
                this.context.fillText('Now loading...', this.width/2, this.height/2);
                this.context.restore();
            break;
            case GAME_STATE.MENU:
                this.context.save();
                this.context.textAlign = 'center';
                this.context.textBaseline = 'middle';
                this.context.font = 'bold 60px system-ui';
                this.context.fillStyle = 'black';
                this.context.fillText('Earth Defense', this.width/2, this.height/2);
                this.context.restore();
                
                this.context.save();
                this.context.textAlign = 'center';
                this.context.textBaseline = 'middle';
                this.context.font = '30px system-ui';
                this.context.fillStyle = 'black';
                this.context.fillText('Destroy asteroids and meteorites to protect our planet!', this.width/2, this.height - 50);
                this.context.restore();
                
                this.context.save();
                this.context.textAlign = 'center';
                this.context.textBaseline = 'middle';
                this.context.font = '20px system-ui';
                this.context.fillStyle = 'black';
                this.context.fillText("Press 'Space' to continue...", this.width/2, this.height - 10);
                this.context.restore();
            break;
            case GAME_STATE.RUNNING:
                this.context.save();
                this.context.fillStyle = 'rgb(0, 0, 0)';
                this.context.fillRect(0, 0, this.width, this.height);
                this.context.restore();

                this._objects.forEach((object) => object.draw());
                Object.keys(this._buttons).forEach((key) => {
                    this._buttons[key].draw();
                });
                
                this.context.save();
                this.context.fillStyle = 'rgba(192, 192, 192, 0.5)';
                this.context.fillRect(this.width / 2 - 100, this.height - 36, 200, 36);
                this.context.restore();

                this.context.save();
                this.context.textAlign = "center";
                this.context.textBaseline = "middle";
                this.context.fillStyle = 'rgb(0, 0, 0)';
                this.context.font = "bold 18px Arial";
                this.context.fillText("PLAY TIME: " + minute + ":" + second, this.width / 2, this.height - 18);
                this.context.restore();
                
                this.context.save();
                this.context.fillStyle = 'rgba(192, 192, 192, 0.5)';
                this.context.fillRect(0, 0, 100, 36);
                this.context.restore();

                this.context.save();
                this.context.textAlign = "center";
                this.context.textBaseline = "middle";
                this.context.fillStyle = 'rgb(0, 0, 0)';
                this.context.font = "bold 18px Arial";
                this.context.fillText("LEVEL: " + this._level, 50, 18);
                this.context.restore();
                
                this.context.save();
                this.context.fillStyle = 'rgba(192, 192, 192, 0.5)';
                this.context.fillRect(this.width - 200, 0, 200, 36);
                this.context.restore();

                this.context.save();
                this.context.textAlign = "center";
                this.context.textBaseline = "middle";
                this.context.fillStyle = 'rgb(0, 0, 0)';
                this.context.font = "bold 18px Arial";
                this.context.fillText("SCORE: " + this._score, this.width - 100, 18);
                this.context.restore();
            break;
            case GAME_STATE.PAUSED:
                this.context.save();
                this.context.textAlign = 'center';
                this.context.textBaseline = 'middle';
                this.context.font = 'bold 40px system-ui';
                this.context.fillStyle = 'black';
                this.context.fillText('Game Paused', this.width/2, this.height/2);
                this.context.restore();

                this.context.save();
                this.context.textAlign = 'center';
                this.context.textBaseline = 'middle';
                this.context.font = '20px system-ui';
                this.context.fillStyle = 'black';
                this.context.fillText("Press 'Space' to continue...", this.width/2, this.height - 10);
                this.context.restore();
            break;
            case GAME_STATE.OVER:
                this.context.save();
                this.context.fillStyle = 'rgb(255, 255, 255)';
                this.context.fillRect(0, 0, this.width, this.height);
                this.context.restore();

                this._objects.forEach((object) => object.draw());
                Object.keys(this._buttons).forEach((key) => {
                    this._buttons[key].draw();
                });
                
                this.context.save();
                this.context.fillStyle = 'rgba(64, 64, 64, 1.0)';
                this.context.fillRect(this.width / 2 - 100, this.height - 36, 200, 36);
                this.context.restore();

                this.context.save();
                this.context.textAlign = "center";
                this.context.textBaseline = "middle";
                this.context.fillStyle = 'rgb(255, 255, 255)';
                this.context.font = "bold 18px Arial";
                this.context.fillText("PLAY TIME: " + minute + ":" + second, this.width / 2, this.height - 18);
                this.context.restore();
                
                this.context.save();
                this.context.fillStyle = 'rgba(64, 64, 64, 1.0)';
                this.context.fillRect(0, 0, 100, 36);
                this.context.restore();

                this.context.save();
                this.context.textAlign = "center";
                this.context.textBaseline = "middle";
                this.context.fillStyle = 'rgb(255, 255, 255)';
                this.context.font = "bold 18px Arial";
                this.context.fillText("LEVEL: " + this._level, 50, 18);
                this.context.restore();
                
                this.context.save();
                this.context.fillStyle = 'rgba(64, 64, 64, 1.0)';
                this.context.fillRect(this.width - 200, 0, 200, 36);
                this.context.restore();

                this.context.save();
                this.context.textAlign = "center";
                this.context.textBaseline = "middle";
                this.context.fillStyle = 'rgb(255, 255, 255)';
                this.context.font = "bold 18px Arial";
                this.context.fillText("SCORE: " + this._score, this.width - 100, 18);
                this.context.restore();

                // Gameover text
                this.context.save();
                this.context.fillStyle = 'rgba(192, 192, 192, 0.5)';
                this.context.fillRect(this.width / 2 - 100, this.height - 84, 200, 48);
                this.context.restore();

                this.context.save();
                this.context.textAlign = "center";
                this.context.textBaseline = "middle";
                this.context.fillStyle = 'rgb(255, 0, 0)';
                this.context.font = "bold 24px Arial";
                this.context.fillText("GAME OVER", this.width / 2,  this.height - 60);
                this.context.restore();
            break;
        }
    }
}

/* Game Start here */
let canvas = document.getElementById('game');
let ctx = canvas.getContext('2d');

let game = new Game(ctx);
let lastTime = 0;
function gameLoop(timestamp) {
    let deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    if (game) {
        game.update(deltaTime);
        game.draw();
    }

    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
