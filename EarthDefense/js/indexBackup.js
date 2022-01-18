
class Game {
    constructor(canvasWidth, canvasHeight, gameWidth, gameHeight, context) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.context = context;

        new InputHandler(this);
        this.mouse = {
            X: 0,
            Y: 0
        };
        this.isMouseDown = false;
        this.playerBase = new PlayerBase(this);
        this.turret = new Turret(this);
        this.missiles = [];
        this.explosions = [];
        this.enemies = [];
        this.gameObjects = [this.playerBase, this.turret, ...this.missiles, ...this.explosions, ...this.enemies];

        this.gameState = GAME_STATE.MENU;
        this.gameTime = 0;
        this.gameScore = 0;
        this.gameStage = 0;

        this.numMissiles = 1;
        this.numEnemies = 1;
        this.spdBuff = 0;
        this.dmgBuff = 0;
        this.hpBuff = 0;
    }
    togglePause(){
        switch (this.gameState) {
            case GAME_STATE.RUNNING: 
                this.gameState = GAME_STATE.PAUSED;
            break;

            case GAME_STATE.PAUSED:
                this.gameState = GAME_STATE.RUNNING;
            break;
        }
    }
    start() {
        this.missiles = [];
        this.explosions = [];
        this.enemies = [];
        this.dmgMulti = 1;
        
        this.gameState = GAME_STATE.RUNNING;
        this.gameTime = 0;
        this.gameScore = 0;
        this.gameStage = 0;
    }
    refresh() {
        this.gameObjects = [this.playerBase, this.turret, ...this.missiles, ...this.explosions, ...this.enemies];
    }
    collisionDetect(deltaTime) {
        for (let i = 0; i < this.enemies.length; i++) {
            let e = this.enemies[i];
        
            for (let j = 0; j < this.missiles.length; j++) {
                let m = this.missiles[j];

                if (e.hit || m.dead) { continue; }
                if (e.inContactWith(m)) {
                    e.hit = m.dead = true;
                    let obj = {
                        position: {
                            x: (e.position.x + m.position.x) / 2,
                            y: (e.position.y + m.position.y) / 2
                        },
                        velocity: {
                            x: (e.velocity.x + m.velocity.x) / 2,
                            y: (e.velocity.y + m.velocity.y) / 2
                        }
                    };
                    let ex = new Explosion(obj, deltaTime);
                    this.explosions.push(ex);
                    this.refresh();

                    this.gameScore += 5 * this.gameStage;
                }
            }
        }
        for (let i = 0; i < this.enemies.length; i++) {
            let e = this.enemies[i];
            if (e.hit) {
                e.scale -= Missile.Damage(1 + this.dmgBuff / 100);
                if (e.scale > 0.2) {
                    var em = new Asteroid(this);
                    em.position.x = e.position.x + em.velocity.x * 5;
                    em.position.y = e.position.y + em.velocity.y * 5;
                    em.scale = 0.15 + (e.scale - 0.15) * Math.random();
                    this.enemies.push(em);
    
                    this.refresh();
                }
                e.hit = false;
            }
        }
        for (let i = 0; i < this.missiles.length; i++) {
            let m = this.missiles[i];
            if (m.dead) {
                this.missiles.splice(i, 1);
            }
        }
    }
    draw(ctx) {
        let second = Math.floor(this.gameTime/1000);
        let minute = Math.floor(second / 60); 
        second = second % 60;
        if (minute < 10) minute = "0" + minute;
        if (second < 10) second = "0" + second;

        switch (this.gameState) {
            case GAME_STATE.MENU:
                ctx.save();
                ctx.fillStyle = "rgb(0, 0, 0)";
                ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
                ctx.restore();
                
                ctx.save();
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillStyle = "rgb(255, 255, 255)";
                ctx.font = "50px Arial";
                ctx.fillText("Earth Defense", this.canvasWidth * 0.5, this.canvasHeight * 0.5);
                ctx.font = "20px Arial";
                ctx.fillText("Press 'Space' to start", this.canvasWidth * 0.5, this.canvasHeight - 10);
                ctx.restore();
            break;

            case GAME_STATE.RUNNING:
                // Background
                ctx.save();
                ctx.fillStyle = "rgb(192, 192, 192)";
                ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
                ctx.restore();
                ctx.save();
                ctx.fillStyle = "rgb(0, 0, 0)";
                ctx.fillRect(0, 0, this.gameWidth, this.gameHeight);
                ctx.restore();
                this.gameObjects.forEach((object) => object.draw(ctx));

                ctx.save();
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillStyle = "rgb(0, 0, 0)";
                ctx.font = "bold small-caps 36px Arial";
                ctx.fillText("Level: " + this.gameStage, this.gameWidth + (this.canvasWidth - this.gameWidth) / 2, 18);
                ctx.font = "bold 18px Arial";
                ctx.fillText("Score: " + this.gameScore, this.gameWidth + (this.canvasWidth - this.gameWidth) / 2, 47);
                ctx.fillStyle = "rgb(0, 0, 0)";
                ctx.font = "bold 18px Arial";
                ctx.fillText("PLAY TIME: " + minute + ":" + second, this.gameWidth + (this.canvasWidth - this.gameWidth) / 2, 67);
                ctx.restore();

                ctx.save();
                ctx.lineWidth = 4;
                ctx.beginPath();
                ctx.moveTo(this.gameWidth + 10, 80);
                ctx.lineTo(this.canvasWidth - 10, 80);
                ctx.stroke();
                ctx.restore();

                ctx.save();
                ctx.textAlign = "left";
                ctx.textBaseline = "middle";
                ctx.font = "20px Arial";
                ctx.fillStyle = "rgb(0, 0, 255)";
                ctx.fillText("Missile Number: " + this.numMissiles, this.gameWidth + 10, 94);
                ctx.fillText("Missile Damage + " + this.dmgBuff + "%", this.gameWidth + 10, 116);
                ctx.fillText("Reload Cooldown: " + this.turret.cooldown + " ms", this.gameWidth + 10, 138);
                ctx.fillText("Reload Speed + " + this.spdBuff + "%", this.gameWidth + 10, 160);
                ctx.fillStyle = "rgb(255, 0, 0)";
                ctx.fillText("Asteroid number: " + this.numEnemies, this.gameWidth + 10, this.gameHeight - 10);
                ctx.fillText("Asteroid HP + " + this.hpBuff + "%", this.gameWidth + 10, this.gameHeight - 30);
                ctx.restore();

                ctx.save();
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillStyle = "rgb(255, 255, 255)";
                ctx.font = "20px Arial";
                ctx.fillText("Press 'Space' to pause", this.gameWidth * 0.5, this.gameHeight - 10);
                ctx.restore();
            break;

            case GAME_STATE.PAUSED:
                ctx.save();
                ctx.fillStyle = "rgb(192, 192, 192)";
                ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
                ctx.restore();
                ctx.save();
                ctx.fillStyle = "rgb(0, 0, 0)";
                ctx.fillRect(0, 0, this.gameWidth, this.gameHeight);
                ctx.restore();
                this.gameObjects.forEach((object) => object.draw(ctx));

                ctx.save();
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillStyle = "rgb(0, 0, 0)";
                ctx.font = "bold small-caps 36px Arial";
                ctx.fillText("Level: " + this.gameStage, this.gameWidth + (this.canvasWidth - this.gameWidth) / 2, 18);
                ctx.font = "bold 18px Arial";
                ctx.fillText("Score: " + this.gameScore, this.gameWidth + (this.canvasWidth - this.gameWidth) / 2, 47);
                ctx.fillStyle = "rgb(0, 0, 0)";
                ctx.font = "bold 18px Arial";
                ctx.fillText("PLAY TIME: " + minute + ":" + second, this.gameWidth + (this.canvasWidth - this.gameWidth) / 2, 67);
                ctx.restore();

                ctx.save();
                ctx.lineWidth = 4;
                ctx.beginPath();
                ctx.moveTo(this.gameWidth + 10, 80);
                ctx.lineTo(this.canvasWidth - 10, 80);
                ctx.stroke();
                ctx.restore();

                ctx.save();
                ctx.textAlign = "left";
                ctx.textBaseline = "middle";
                ctx.font = "20px Arial";
                ctx.fillStyle = "rgb(0, 0, 255)";
                ctx.fillText("Missile Number: " + this.numMissiles, this.gameWidth + 10, 94);
                ctx.fillText("Missile Damage + " + this.dmgBuff + "%", this.gameWidth + 10, 116);
                ctx.fillText("Reload Cooldown: " + this.turret.cooldown + " ms", this.gameWidth + 10, 138);
                ctx.fillText("Reload Speed + " + this.spdBuff + "%", this.gameWidth + 10, 160);
                ctx.fillStyle = "rgb(255, 0, 0)";
                ctx.fillText("Asteroid number: " + this.numEnemies, this.gameWidth + 10, this.gameHeight - 10);
                ctx.fillText("Asteroid HP + " + this.hpBuff + "%", this.gameWidth + 10, this.gameHeight - 30);
                ctx.restore();
                
                ctx.save();
                ctx.fillStyle = "rgb(0, 0, 0, 0.8)";
                ctx.fillRect(0, 0, this.gameWidth, this.gameHeight);
                ctx.restore();

                ctx.save();
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillStyle = "white";
                ctx.font = "30px Arial";
                ctx.fillText("Game Paused", this.gameWidth/2, this.gameHeight/2);
                ctx.font = "20px Arial";
                ctx.fillText("Press 'Space' to resume", this.gameWidth/2, this.gameHeight - 10);
                ctx.restore();
            break;

            case GAME_STATE.GAMEOVER: 
                ctx.save();
                ctx.fillStyle = "rgb(63, 63, 63)";
                ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
                ctx.restore();
                ctx.save();
                ctx.fillStyle = "rgb(255, 255, 255)";
                ctx.fillRect(0, 0, this.gameWidth, this.gameHeight);
                ctx.restore();
                this.gameObjects.forEach((object) => object.draw(ctx));

                ctx.save();
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillStyle = "rgb(255, 255, 255)";
                ctx.font = "bold small-caps 36px Arial";
                ctx.fillText("Level: " + this.gameStage, this.gameWidth + (this.canvasWidth - this.gameWidth) / 2, 18);
                ctx.font = "bold 18px Arial";
                ctx.fillText("Score: " + this.gameScore, this.gameWidth + (this.canvasWidth - this.gameWidth) / 2, 47);
                ctx.fillStyle = "rgb(255, 255, 255)";
                ctx.font = "bold 18px Arial";
                ctx.fillText("PLAY TIME: " + minute + ":" + second, this.gameWidth + (this.canvasWidth - this.gameWidth) / 2, 67);
                ctx.restore();

                ctx.save();
                ctx.lineWidth = 4;
                ctx.strokeStyle = "rgb(255, 255, 255)";
                ctx.beginPath();
                ctx.moveTo(this.gameWidth + 10, 80);
                ctx.lineTo(this.canvasWidth - 10, 80);
                ctx.stroke();
                ctx.restore();

                ctx.save();
                ctx.textAlign = "left";
                ctx.textBaseline = "middle";
                ctx.font = "20px Arial";
                ctx.fillStyle = "rgb(255, 255, 0)";
                ctx.fillText("Missile Number: " + this.numMissiles, this.gameWidth + 10, 94);
                ctx.fillText("Missile Damage + " + this.dmgBuff + "%", this.gameWidth + 10, 116);
                ctx.fillText("Reload Cooldown: " + this.turret.cooldown + " ms", this.gameWidth + 10, 138);
                ctx.fillText("Reload Speed + " + this.spdBuff + "%", this.gameWidth + 10, 160);
                ctx.fillStyle = "rgb(0, 255, 255)";
                ctx.fillText("Asteroid number: " + this.numEnemies, this.gameWidth + 10, this.gameHeight - 10);
                ctx.fillText("Asteroid HP + " + this.hpBuff + "%", this.gameWidth + 10, this.gameHeight - 30);
                ctx.restore();
            
                ctx.save();
                ctx.fillStyle = "rgb(0, 0, 0, 0.2)";
                ctx.fillRect(0, 0, this.gameWidth, this.gameHeight);
                ctx.restore();

                ctx.save();
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillStyle = "rgb(255, 0, 0)";
                ctx.font = "30px Arial";
                ctx.fillText("Game Over", this.gameWidth/2, this.gameHeight/2);
                ctx.fillStyle = "rgb(0, 0, 0)";
                ctx.font = "20px Arial";
                ctx.fillText("Press 'Space' to restart", this.gameWidth/2, this.gameHeight - 10);
                ctx.restore();
            break;
        }
        
    }
    update(deltaTime) {
        if (this.gameState !== GAME_STATE.RUNNING) { return; }
        this.gameObjects.forEach((object) => object.update(deltaTime));
        this.gameTime += deltaTime;
        
        if (this.enemies.length === 0) {
            this.gameStage += 1;
            this.dmgBuff = 20 * Math.floor(this.gameStage / 2);
            this.spdBuff = 10 * Math.floor(this.gameStage / 5);
            this.hpBuff = 100 * Math.floor(this.gameStage / 5);
            this.numEnemies = Math.floor(this.gameStage / 2) + 1;
            this.numMissiles = Math.floor((this.gameStage - 1) / 2) + 1;
            for (let i = 0; i < this.numEnemies; i++) {
                let e = new Asteroid(this);
                this.enemies.push(e);
            }
            this.refresh();
        }
        for (let i = 0; i < this.enemies.length; i++) {
            let e = this.enemies[i];
            if (e.scale <= 0.1) {
                this.enemies.splice(i, 1);
            } else if (this.playerBase.isHitBy(e)) {
                this.gameState = GAME_STATE.GAMEOVER;
            }
            this.refresh();
        }
        for (let i = 0; i < this.missiles.length; i++) {
            let m = this.missiles[i];
            if (m.expired()) {
                let e = new Explosion(m, deltaTime);
                this.explosions.push(e);
                this.missiles.splice(i, 1);
            }
            
            this.refresh();
        }
        this.collisionDetect(deltaTime);
        for (let i = 0; i < this.explosions.length; i++) {
            let e = this.explosions[i];
            if (e.expired()) {
                this.explosions.splice(i, 1);
            }
        }
    }
}

class PlayerBase {
    constructor(game) {
        this.game = game;
        this.gameWidth = game.gameWidth;
        this.gameHeight = game.gameHeight;
        this.sprite = new Image();
        this.sprite.src = "./img/globe-sprite.png"

        this.position = {
            x: this.gameWidth / 2,
            y: this.gameHeight / 2
        }
        this.size = 50;
        this.angle = 0;
    }
    isHitBy(obj) {
        let diffX = this.position.x - obj.position.x;
        let diffY = this.position.y - obj.position.y;
        let dist = Math.sqrt(diffX * diffX + diffY * diffY);
        let avgS = (this.size + obj.averageSize()) /2;
        return (dist <= avgS);
    }
    draw(ctx) {   
        ctx.save();
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(Math.PI * this.angle / 180);
        if (this.sprite) {
            ctx.drawImage(
                this.sprite, 
                -this.size / 2,
                -this.size / 2,
                this.size,
                this.size
            );
        } else {
            ctx.strokeRect(-this.size / 2, -this.size / 2, this.size, this.size);
            ctx.rotate(Math.PI * 30 / 180);
            ctx.strokeRect(-this.size / 2, -this.size / 2, this.size, this.size);
            ctx.rotate(Math.PI * 30 / 180);
            ctx.strokeRect(-this.size / 2, -this.size / 2, this.size, this.size);
        }
        ctx.restore();
        /*
        if (this.game.isMouseDown){
            ctx.beginPath();
            ctx.moveTo(this.gameWidth / 2, this.gameHeight / 2);
            ctx.lineTo(this.game.mouse.X, this.game.mouse.Y);
            ctx.stroke();
        } */
    }
    update(deltaTime) {
        this.angle += 1;

    }
}

class Asteroid {
    constructor(game) {
        this.game = game;
        this.gameWidth = game.gameWidth;
        this.gameHeight = game.gameHeight;
        this.sprite = new Image();
        this.sprite.src = "./img/asteroid-sprite-1.png";

        this.initialSize = {
            w: 113,
            h: 101
        };
        this.size = {
            w: this.initialSize.w, 
            h: this.initialSize.h
        }
        this.initialScale = 0.15;
        this.position = {x: 0, y: 0};
        this.angle = 0;
        this.velocity = {x: 0, y: 0};
        this.deltaAngle = 0;
        this.maxDxy = 2 * (1 + this.game.spdBuff * 2 / 100);
        this.maxDa = 15;
        this.maxScale = 0.15 * (1 + this.game.hpBuff / 100);

        this.spawn();
    }
    spawn() {
        this.hit = false;
        this.scale = this.initialScale + (this.maxScale - this.initialScale) * Math.random();
        this.calcSize();
        if (Math.random() < 0.5) {
          if (Math.random() < 0.5) {
            this.position.x = this.size.w / 2;
          } else {
            this.position.x = this.gameWidth - this.size.w / 2;
          }
          this.position.y = Math.random() * (this.gameHeight - this.size.h) + this.size.h / 2;
        } else {
          this.position.x = Math.random() * (this.gameWidth - this.size.w) + this.size.w / 2;
          if (Math.random() < 0.5) {
            this.position.y = this.size.h / 2;
          } else {
            this.position.y = this.gameHeight - this.size.h / 2;
          }
        }
        this.angle = Math.random() * 360;
        this.velocity.x = this.maxDxy * (Math.random() - 0.5);
        this.velocity.y = this.maxDxy * (Math.random() - 0.5);
        this.deltaAngle = this.maxDa * (Math.random() - 0.5);
    }
    calcSize() {
        this.size.w = this.initialSize.w * this.scale, 
        this.size.h = this.initialSize.h * this.scale
    }
    move() {
        this.angle += this.deltaAngle;
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        // Bounce off the edges
        if (this.position.x < this.size.w / 2 ||
            this.position.x + this.size.w / 2 > this.gameWidth) {
        this.velocity.x = -this.velocity.x;
        this.deltaAngle = -this.deltaAngle;
        }
        if (this.position.y < this.size.h / 2 ||
            this.position.y + this.size.h / 2 > this.gameHeight) {
        this.velocity.y = -this.velocity.y;
        this.deltaAngle = -this.deltaAngle;
        }
    }
    draw(ctx) {
        if (this.scale <= 0.1) { return; }
        ctx.save();
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(this.angle * Math.PI / 180);
        ctx.drawImage(
            this.sprite,
            -this.initialSize.w * this.scale / 2,
            -this.initialSize.h * this.scale / 2,
            this.initialSize.w * this.scale,
            this.initialSize.h * this.scale);
        ctx.restore();
    }
    averageSize() {
        return Math.sqrt(this.size.w * this.size.w + this.size.h * this.size.h);
    }
    update(deltaTime) {
        this.calcSize();
        this.move();
    }
    inContactWith(obj) {
        let diffX = this.position.x - obj.position.x;
        let diffY = this.position.y - obj.position.y;
        let avgS = (this.averageSize() + obj.averageSize()) / 2;
        let dist = Math.sqrt(diffX * diffX + diffY * diffY);
        return (dist <= avgS || dist <= 10);
    }
}

class Missile {
    constructor(game, x, y, vx, vy, a) {
        this.game = game;
        this.gameWidth = game.gameWidth;
        this.gameHeight = game.gameHeight;
        this.sprite = new Image();
        this.sprite.src = "./img/rocket-sprite.png";
        this.size = {
            w: 75,
            h: 9
        }
        this.position = {
            x: x,
            y: y
        }
        this.velocity = {
            x: vx,
            y: vy
        }
        this.angle = a;
        this.dead = false;
    }
    static BaseDamage() {
        return 0.05;
    }
    static Damage(dmgBuff) {
        return this.BaseDamage() * dmgBuff;
    }
    move(){
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
    averageSize() {
        return Math.sqrt(this.size.w * this.size.w + this.size.h * this.size.h);
    }
    draw(ctx){
        ctx.save();
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(this.angle);
        ctx.drawImage(
            this.sprite,
            -this.size.w / 2,
            -this.size.h / 2,
            this.size.w,
            this.size.h
        );
        ctx.restore();
    }
    update(deltaTime) {
        this.move();
    }
    expired() {
        return (
            this.position.x < 0 || this.position.x > this.gameWidth ||
            this.position.y < 0 || this.position.y > this.gameHeight);
    }
}

class Turret {
    constructor(game) {
        this.game = game;
        this.gameWidth = game.gameWidth;
        this.gameHeight = game.gameHeight;
        this.sprite = new Image();
        this.sprite.src = "./img/turret-sprite.png";
        this.size = {
            w: 40,
            h: 30
        }
        this.reloadDelay = 0;
        this.cooldown = this.reloadDelay;
        this.position = {
            x: this.gameWidth / 2,
            y: this.gameHeight /2
        }
        this.angle = 0;
    }
    reload() {
        this.cooldown += Math.max(0, 100 - 100 * (this.game.spdBuff / 100));
    }
    move() {
        let diffX = this.game.mouse.X - this.position.x;
        let diffY = this.game.mouse.Y - this.position.y;
        let dist = Math.sqrt(diffX * diffX + diffY * diffY);
        this.angle = Math.atan2(diffY, diffX);
        
        if (this.game.isMouseDown && !this.cooldown) {
            let a = this.angle;
            let x = this.position.x;
            x += Math.cos(-a) * this.size.w;
            let y = this.position.y;
            y -= Math.sin(-a) * this.size.h;

            let vStr = 2;
            let vx = Math.cos(-a) * vStr;
            let vy = Math.sin(-a) * vStr;
            
            let missile = new Missile(this.game, x, y, vx, -vy, a);
            this.game.missiles.push(missile);
            
            let extraMissile = this.game.numMissiles - 1;
            for (let i = 1; i <= extraMissile; i++) {
                let extraA = (i % 2 === 0) ? a + (i * 5 + 9) / 180 * Math.PI: a - (i * 10 + 9) / 180 * Math.PI;
                let extraX = this.position.x + Math.cos(-extraA) * this.size.w;
                let extraY = this.position.y - Math.sin(-extraA) * this.size.h;
                let extraVx = Math.cos(-extraA) * vStr;
                let extraVy = Math.sin(-extraA) * vStr;
                let missile = new Missile(this.game, extraX, extraY, extraVx, -extraVy, extraA);
                this.game.missiles.push(missile);
            }
            this.game.refresh();

            this.reload();
        }
        if (this.cooldown) {this.cooldown--};
    }
    draw(ctx){
        ctx.save();
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(this.angle);
        if (this.sprite) {
            ctx.drawImage(
                this.sprite, 
                -this.size.w / 2,
                -this.size.h / 2,
                this.size.w,
                this.size.h
            );
        } else {
            console.log("Failed.");
        }
        ctx.restore();
    }
    update(deltaTime) {
        this.move();
    }
}

class Ash {
    constructor(x, y, vx, vy, deltaTime) {
        this.position = {
            x: x,
            y: y
        }
        this.velocity = {
            x: vx, 
            y: vy
        }
        this.life = 5 * deltaTime;
        this.life *= Math.random() * 2 + 1;
        this.airResist = 0.97;
    }
    move() {
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        this.velocity.x *= this.airResist;
        this.velocity.y *= this.airResist;
    }
    draw(ctx) {
        ctx.save();
        ctx.fillStyle = "rgb(255, 255, 255)";
        ctx.fillRect(this.position.x - 1, this.position.y - 1, 2, 2);
        ctx.restore();
    }
    update(deltaTime) {
        this.move();
        this.life -= 1;
    }
    expired() {
        return this.life <= 0;
    }
}

class Explosion {
    constructor(source, deltaTime) {
        this.ashes = [];
        this.init(source, deltaTime);
    }
    init(source, deltaTime) {
        let num = Math.floor(Math.random() * 10);
        for (let i = 0; i < num; i++) {
            let vx = 2 * source.velocity.x * (Math.random() - 0.2);
            vx += 3 * (Math.random() - 0.5);
            let vy = 2 * source.velocity.y * (Math.random() - 0.2);
            vy += 3 * (Math.random() - 0.5);
            let a = new Ash(source.position.x, source.position.y, vx, vy, deltaTime);
            this.ashes.push(a);
        }
    }
    draw(ctx) {
        for (let i = 0; i < this.ashes.length; i++) {
            let a = this.ashes[i];
            a.draw(ctx);
        }
    }
    update(deltaTime) {
        for (let i = 0; i < this.ashes.length; i++) {
            let a = this.ashes[i];
            if (a.expired()) {
                this.ashes.splice(i, 1);
            } else {
                a.update(deltaTime);
            }
        }
    }
    expired() {
        return this.ashes.length <= 0;
    }
}

/* Game Start here */
/*
const GAME_STATE = {
    MENU: 0,
    RUNNING: 1,
    PAUSED: 2,
    GAMEOVER: 3
};
let game = new Game(CANVAS_WIDTH, CANVAS_HEIGHT, GAME_WIDTH, GAME_HEIGHT, ctx);
let lastTime = 0;
function gameLoop(timestamp) {
    let deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    if (game) {
        game.update(deltaTime);
        game.draw(ctx);
    }

    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
*/