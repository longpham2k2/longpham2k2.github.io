export class Button {
    constructor(context, sprite, x, y, a = 0, preferredWidth = sprite.width, preferredHeight = sprite.height) {
        this.context = context;        
        this.sprite = sprite;
        this.position = {
            x: x,
            y: y
        };
        this.size = {
            w: preferredWidth,
            h: preferredHeight
        };
        this.a = a;
    }
    getPosition() {
        return this.position;
    }
    getSize() {
        return this.size;
    }
    changeSprite(sprite) {
        this.sprite = sprite;
    }
    update() {

    }
    draw() {
        this.context.save();
        this.context.translate(this.position.x, this.position.y);
        this.context.rotate(this.a / 180 * Math.PI);
        this.context.drawImage(
            this.sprite,
            -this.size.w / 2,
            -this.size.h / 2,
            this.size.w,
            this.size.h    
        );
        this.context.restore();
    }
}
export class Base{
    constructor(context, sprite, preferredScale = 1) {
        this.context = context;
        this.sprite = sprite;
        this.position = {
            x: context.canvas.clientWidth / 2,
            y: context.canvas.clientHeight / 2
        };
        this.size = {
            w: sprite.width * preferredScale,
            h: sprite.height * preferredScale
        }
        this.scale = preferredScale;
        this.a = 0;
    }
    getPosition() {
        return this.position;
    }
    getSize() {
        return this.size;
    }
    getAngle() {
        return this.a;
    }
    getScale() {
        return this.scale;
    }
    update() {
        this.a += 1;
    }
    draw() {
        this.context.save();
        this.context.translate(this.position.x, this.position.y);
        this.context.rotate(this.a / 180 * Math.PI);
        this.context.drawImage(
            this.sprite,
            -this.size.w / 2,
            -this.size.h / 2,
            this.size.w,
            this.size.h    
        );
        this.context.restore();
    }
}
export class Ship{
    constructor(context, sprite, preferredScale = 1) {
        this.context = context;
        this.sprite = sprite;
        this.position = {
            x: context.canvas.clientWidth / 2,
            y: context.canvas.clientHeight / 2
        };
        this.size = {
            w: sprite.width * preferredScale,
            h: sprite.height * preferredScale
        };
        this.scale = preferredScale;
        this.a = 0;
    }
    getPosition() {
        return this.position;
    }
    getSize() {
        return this.size;
    }
    getScale() {
        return this.scale;
    }
    getAngle() {
        return this.a;
    }
    setAngle(angle = 0) {
        this.a = angle;
    }
    update() {
    }
    draw() {
        this.context.save();
        this.context.translate(this.position.x, this.position.y);
        this.context.rotate(this.a / 180 * Math.PI);
        this.context.drawImage(
            this.sprite,
            -this.size.w / 2,
            -this.size.h / 2,
            this.size.w,
            this.size.h    
        );
        this.context.restore();
    }
}
export class Missile {
    constructor(context, sprite, x, y, vx, vy, a, preferredScale = 1) {
        this.context = context;
        this.sprite = sprite;
        this.size = {
            w: sprite.width * preferredScale,
            h: sprite.height * preferredScale
        };
        this.position = {
            x: x,
            y: y
        };
        this.velocity = {
            x: vx,
            y: vy
        }
        this.scale = preferredScale;
        this.a = a;
    }
    getPosition() {
        return this.position;
    }
    getSize() {
        return this.size;
    }
    getVelocity() {
        return this.velocity;
    }
    getScale() {
        return this.scale;
    }
    getAngle() {
        return this.a;
    }
    update() {
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
    draw() {
        this.context.save();
        this.context.translate(this.position.x, this.position.y);
        this.context.rotate(this.a / 180 * Math.PI);
        this.context.drawImage(
            this.sprite,
            -this.size.w / 2,
            -this.size.h / 2,
            this.size.w,
            this.size.h    
        );
        this.context.restore();
    }
}
export class Meteor {
    constructor(context, sprite, x, y, vx, vy, a, preferredScale = 1) {
        this.context = context;
        this.sprite = sprite;
        this.position = {
            x: x,
            y: y
        };
        this.size = {
            w: sprite.width * preferredScale,
            h: sprite.height * preferredScale
        };
        this.scale = preferredScale;
        this.velocity = {
            x: vx,
            y: vy
        }
        this.a = a;
    }
    getPosition() {
        return this.position;
    }
    getSize() {
        return this.size;
    }
    getVelocity() {
        return this.velocity;
    }
    getScale() {
        return this.scale;
    }
    getAngle() {
        return this.a;
    }
    update() {
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
    draw() {
        this.context.save();
        this.context.translate(this.position.x, this.position.y);
        this.context.rotate(this.a / 180 * Math.PI);
        this.context.drawImage(
            this.sprite,
            -this.size.w / 2,
            -this.size.h / 2,
            this.size.w,
            this.size.h    
        );
        this.context.restore();
    }
}
export class Asteroid {
    constructor(context, sprite, x, y, vx, vy, a, preferredScale = 1) {
        this.context = context;
        this.sprite = sprite;
        this.position = {
            x: x,
            y: y
        };
        this.scale = preferredScale;
        this.velocity = {
            x: vx,
            y: vy
        }
        this.da = 15 * (Math.random() - 0.5); 
        this.a = a;
    }
    getSprite() {
        return this.sprite;
    }
    getPosition() {
        return this.position;
    }
    getVelocity() {
        return this.velocity;
    }
    getSize() {
        return {
            w: this.sprite.width * this.scale,
            h: this.sprite.height * this.scale
        };
    }
    getScale() {
        return this.scale;
    }
    getAngle() {
        return this.a;
    }
    setPosition(x = 1, y = 1) {
        this.position.x = x;
        this.position.y = y;
    }
    setVelocity(vx = 1, vy = 1) {
        this.velocity.x = vx;
        this.velocity.y = vy;
    }
    setScale(scale = 1) {
        this.scale = scale;
    }
    setAngle(angle = 0) {
        this.a = angle;
    }
    update() {
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        this.a += this.da;
    }
    draw() {
        let expectedSize = this.getSize();
        this.context.save();
        this.context.translate(this.position.x, this.position.y);
        this.context.rotate(this.a / 180 * Math.PI);
        this.context.drawImage(
            this.sprite,
            -expectedSize.w / 2,
            -expectedSize.h / 2,
            expectedSize.w,
            expectedSize.h    
        );
        this.context.restore();
    }

}
export class Ash {
    constructor(context, x, y, vx, vy, lifeTime = 100, preferredScale = 1) {
        this.context = context;
        this.position = {
            x: x,
            y: y
        }
        this.size = {
            w: 4 * preferredScale,
            h: 4 * preferredScale
        };
        this.velocity = {
            x: vx, 
            y: vy
        }
        this.lifeTime = 5 * lifeTime;
        this.lifeTime *= Math.random() * 2 + 1;
        this.airResist = 0.97;
    }
    getPosition() {
        return this.position;
    }
    getSize() {
        return {
            w: this.sprite.width * this.scale,
            h: this.sprite.height * this.scale
        };
    }
    getVelocity() {
        return this.velocity;
    }
    getAngle() {
        return this.a;
    }
    update() {
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        this.velocity.x *= this.airResist;
        this.velocity.y *= this.airResist;
        this.lifeTime -= 1;
    }
    draw() {
        this.context.save();
        this.context.fillStyle = "rgb(255, 255, 255)";
        this.context.fillRect(
            this.position.x - this.size.w / 2, 
            this.position.y - this.size.h / 2, 
            this.size.w, 
            this.size.h
        );
        this.context.restore();
    }
    isExpired() {
        return this.lifeTime <= 0;
    }
}
export class Explosion {
    constructor(context, source, expectedLifeTime = 100) {
        this.context = context;
        this.ashes = [];
        this.expectedLifeTime = expectedLifeTime;
        this.init(source);
    }
    init(source) {
        let sourceScale = source.getScale();
        let num = 5 + Math.floor(Math.random() * sourceScale * 10);
        for (let i = 0; i < num; i++) {
            let sourcePosition = Object.assign({}, source.getPosition());
            let sourceVelocity = Object.assign({}, source.getVelocity());
            let x = sourcePosition.x;
            let y = sourcePosition.y;
            let vx = 2 * sourceVelocity.x * (Math.random() - 0.2);
            vx += 3 * (Math.random() - 0.5);
            let vy = 2 * sourceVelocity.y * (Math.random() - 0.2);
            vy += 3 * (Math.random() - 0.5);
            let scale = Math.floor(Math.random() * sourceScale * 10);
            let a = new Ash(this.context, x, y, vx, -vy, this.expectedLifeTime, sourceScale);
            this.ashes.push(a);
        }
    }
    update() {
        this.ashes.forEach((ash, ashIndex) => {
            if (ash.isExpired()) this.ashes.splice(ashIndex, 1);
            else ash.update();
        })
    }
    draw() {
        this.ashes.forEach((ash) => ash.draw());
    }
    isExpired() {
        return this.ashes.length <= 0;
    }
}