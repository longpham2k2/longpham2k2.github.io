/**
 * @param {String} url The URL of the image
 * @returns {Promise<Image>} A promise of an image
 */
const fetchImage = (url) => new Promise((resolve, reject) => {
    const img = new Image();
    img.addEventListener('load', () => resolve(img));
    img.addEventListener('error', (err) => reject(err));
    img.src = url;
});
export class JSONPreloader {
    constructor(fileName, fileUrl) {
        this._loadComplete = false;
        this._jsonData = {};
        
        fetch(fileUrl + fileName + '.json')
            .then((response) => response.json())
            .then((object) => {
                this._loadComplete = true;
                this._jsonData = Object.assign({}, object);
            })
            .catch((reason) => console.error(reason));
    }
    isCompleted() {
        return this._loadComplete;
    }
    getData() {
        return this._jsonData;
    }
}
export class ImagePreloader {
    constructor(assetNames, assetUrl, assetNamePrefix = '', assetNamePostfix = '') {
        this._loadComplete = false;
        this._processedImages = [];
    
        let images = [];
        let bitmaps = [];
        assetNames.forEach((assetName) => images.push(fetchImage(assetUrl + assetNamePrefix + assetName + assetNamePostfix + '.png')));
        Promise.all(images)
            .then((loadedImages) => {
                loadedImages.forEach((loadedImage) => bitmaps.push(createImageBitmap(loadedImage)));
                return Promise.all(bitmaps);
            })
            .then((createdBitmaps) => {
                this._processedImages = [...createdBitmaps];
                this._loadComplete = true;
            })
            .catch((err) => console.error(err));
    }
    isCompleted() {
        return this._loadComplete;
    }
    getBitmaps() {
        return this._processedImages;
    }
}
export class InputHandler {
    constructor(gameContext, keyConfigurationUrl) {
        if (!(gameContext instanceof CanvasRenderingContext2D)) {
            throw new TypeError(gameContext + ' is not a canvas context.'); 
        }
        let canvas = gameContext.canvas;
        canvas.contentEditable = true;
        canvas.addEventListener('keydown', this.onKeyDown.bind(this));
        canvas.addEventListener('keyup', this.onKeyUp.bind(this));
        canvas.addEventListener('mousemove', this.onMouseMove.bind(this));
        canvas.addEventListener('mousedown', this.onMouseDown.bind(this));
        canvas.addEventListener('mouseup', this.onMouseUp.bind(this));

        this.context = gameContext;
        this.keyMap = {};
        this.keyState = {};
        this.mousePosition = {x: 0, y: 0};
        this.mouseState = false;
        fetch(keyConfigurationUrl)  
            .then((response) => response.json())
            .then((keyConfig) => {
                for (const keyName in keyConfig) {
                    keyConfig[keyName].forEach((keyValue) => this.keyMap[keyValue] = keyName);
                }
            })
            .catch((reason) => console.error(reason));
    }
    shouldPreventDefault(keyValue) {
        switch(keyValue) {
            case "ArrowUp":
            case "ArrowDown":
            case "ArrowRight":
            case "ArrowLeft":
            case "Home":
            case "End":
            case "PageUp":
            case "PageDown":
            case "Tab":
            case "Enter":
            case "Spacebar": // Older browsers
            case " ":
                return true;
            break;
        }
        return false;
    }
    onKeyDown(event) {
        if (this.shouldPreventDefault(event.key)) {
            event.preventDefault();
        }
        let keyName = this.keyMap[event.key];
        if (keyName) {
            this.keyState[keyName] = true;
        }
    }
    onKeyUp(event) {
        let keyName = this.keyMap[event.key];
        if (keyName) {
            this.keyState[keyName] = false;
        }
    }
    onMouseMove(event) {
        let clientRect = this.context.canvas.getBoundingClientRect();
        this.mousePosition.x = event.clientX - clientRect.left;
        this.mousePosition.y = event.clientY - clientRect.top;
    }
    onMouseDown(event) {
        this.mouseState = true;
    }
    onMouseUp(event) {
        this.mouseState = false;
    }
    isTriggered(keyName){
        if (!!this.keyState[keyName]) {
            this.keyState[keyName] = false;
            return true;
        } else {
            return false;
        }
    }
    isPressed(keyName){
        return !!this.keyState[keyName];
    }
    getMousePosition() {
        return this.mousePosition;
    }
    isMouseDown() {
        return this.mouseState;
    }
}
/**
 * Find x and y of given point when projected to given axis.
 * @param {Object} point 
 * @param {Object} axis 
 * @returns {Object} Projected point
 */
function projectTo(point, axis) {
    let x = point.x;
    let y = point.y;
    let xAxis = axis.x;
    let yAxis = axis.y;
    let common = (x * xAxis + y * yAxis) / (xAxis * xAxis + yAxis * yAxis);
    return {
        x: common * xAxis, 
        y: common * yAxis
    };
}
/**
 * Calculate scalar value of a given projected point on given axis.
 * @param {Object} projPoint 
 * @param {Object} axis 
 * @returns {Number} Scalar value
 */
function getScalar(projPoint, axis) {
    let x = projPoint.x;
    let y = projPoint.y;
    let xAxis = axis.x;
    let yAxis = axis.y;
    return (x * xAxis + y * yAxis);
}
/**
 * Find x and y of a given point after circling around a given center point for a given angle. 
 * @param {Object} point 
 * @param {Object} center 
 * @param {Number} angle 
 * @returns {Object} Circled Point
 */
function circleAround(point, center, angle) {
    let x = point.x;
    let y = point.y;
    let xCenter = center.x;
    let yCenter = center.y;
    let a = angle * Math.PI / 180;
    return {
        x: (x - xCenter) * Math.cos(a) - (y - yCenter) * Math.sin(a) + xCenter, 
        y: (y - yCenter) * Math.cos(a) + (x - xCenter) * Math.sin(a) + yCenter
    }; 
}
/**
 * Calculate four vertices of a given rectangle
 * @param {Object} rectangle An object with 3 methods getPosition(), getSize(), getAngle()
 * @returns {Object} An object with 4 properties topLeft, topRight, bottomLeft, bottomRight
 */
function getVertices(rectangle) {
    let rectPosition = Object.assign({}, rectangle.getPosition());
    let rectSize = Object.assign({}, rectangle.getSize());
    let rectAngle = rectangle.getAngle();
    let topLeft = {
        x: rectPosition.x - rectSize.w / 2,
        y: rectPosition.y - rectSize.h / 2
    };
    let topRight = {
        x: rectPosition.x + rectSize.w / 2,
        y: rectPosition.y - rectSize.h / 2
    };
    let bottomLeft = {
        x: rectPosition.x - rectSize.w / 2,
        y: rectPosition.y + rectSize.h / 2
    };
    let bottomRight = {
        x: rectPosition.x + rectSize.w / 2,
        y: rectPosition.y + rectSize.h / 2
    };    
    topLeft = Object.assign({}, circleAround(topLeft, rectPosition, rectAngle));
    topRight = Object.assign({}, circleAround(topRight, rectPosition, rectAngle));
    bottomLeft = Object.assign({}, circleAround(bottomLeft, rectPosition, rectAngle));
    bottomRight = Object.assign({}, circleAround(bottomRight, rectPosition, rectAngle));

    return {
        topLeft: topLeft, 
        topRight: topRight, 
        bottomLeft: bottomLeft, 
        bottomRight: bottomRight
    };
}
/**
 * Seperating Axis Theorem (SAT) based method 
 * which check if two given rectangle collides when projected to the given axis
 * @param {Object} axis 
 * @param {Object} rect1 
 * @param {Object} rect2 
 * @returns {boolean}
 */
function collideOn(axis, rect1, rect2) {
    let projRect1 = [];
    projRect1.push(getScalar(projectTo(rect1.topRight, axis), axis));
    projRect1.push(getScalar(projectTo(rect1.topLeft, axis), axis));
    projRect1.push(getScalar(projectTo(rect1.bottomRight, axis), axis));
    projRect1.push(getScalar(projectTo(rect1.bottomLeft, axis), axis));

    let projRect2 = [];
    projRect2.push(getScalar(projectTo(rect2.topRight, axis), axis));
    projRect2.push(getScalar(projectTo(rect2.topLeft, axis), axis));
    projRect2.push(getScalar(projectTo(rect2.bottomRight, axis), axis));
    projRect2.push(getScalar(projectTo(rect2.bottomLeft, axis), axis));

    let max1 = projRect1[0];
    let min1 = projRect1[0];
    projRect1.forEach((value) => {
        if (value > max1) max1 = value;
        if (value < min1) min1 = value;
    });
    let max2 = projRect2[0];
    let min2 = projRect2[0];
    projRect2.forEach((value) => {
        if (value > max2) max2 = value;
        if (value < min2) min2 = value;
    });
    if (min2 <= max1 && max2 >= min1) return true;
    else return false;
}
/**
 * Seperating Axis Theorem (SAT) based method 
 * which calculates axes of given rectangles. 
 * Then check if they collides with each other when projected to these axes.
 * @param {Object} rect1 an object with four properties: topLeft, topRight, bottomLeft, bottomRight
 * @param {Object} rect2 an object with four properties: topLeft, topRight, bottomLeft, bottomRight
 * @returns {boolean} 
 */
function checkCollision(rect1, rect2) {
    let axis1 = {
        x: rect1.topRight.x - rect1.topLeft.x,
        y: rect1.topRight.y - rect1.topLeft.y
    };
    let axis2 = {
        x: rect1.topRight.x - rect1.bottomRight.x,
        y: rect1.topRight.y - rect1.bottomRight.y
    }
    let axis3 = {
        x: rect2.topLeft.x - rect2.bottomLeft.x,
        y: rect2.topLeft.y - rect2.bottomLeft.y
    }
    let axis4 = {
        x: rect2.topLeft.x - rect2.topRight.x,
        y: rect2.topLeft.y - rect2.topRight.y
    }
    // Projection
    return (collideOn(axis1, rect1, rect2) 
        && collideOn(axis2, rect1, rect2)
        && collideOn(axis3, rect1, rect2)
        && collideOn(axis4, rect1, rect2));
}
/**
 * Calculates diagonal line length of the given rectangle
 * @param {Object} rect 
 * @returns {Number} 
 */
function getDiagonal(rect) {
    let position = Object.assign({}, rect.getPosition());
    let size = Object.assign({}, rect.getSize());
    let vertex = {
        x: position.x - size.w / 2,
        y: position.y - size.h / 2
    }
    let diffX = vertex.x - position.x;
    let diffY = vertex.y - position.y;
    return Math.sqrt(diffX * diffX + diffY * diffY);
}
/**
 * Check if two given rectangle can collide with each other
 * @param {*} rect1 containing these methods: getPosition(), getSize()
 * @param {*} rect2 containing these methods: getPosition(), getSize()
 */
function canCollide(rect1, rect2) {
    let pos1 = Object.assign({}, rect1.getPosition());
    let pos2 = Object.assign({}, rect2.getPosition());
    let diffX = pos1.x - pos2.x;
    let diffY = pos1.y - pos2.y;
    let connect = Math.sqrt(diffX * diffX + diffY * diffY);
    return (getDiagonal(rect1) + getDiagonal(rect2) >= connect);
}
export class CollisionHandler {
    constructor(context, shouldShowHitbox = false) {
        this.context = context;
        this.shouldShowHitbox = shouldShowHitbox;
    }
    showHitbox(rect) {
        this.context.save();
        this.context.beginPath();
        this.context.moveTo(rect.topLeft.x, rect.topLeft.y);
        this.context.lineTo(rect.topRight.x, rect.topRight.y);
        this.context.lineTo(rect.bottomRight.x, rect.bottomRight.y);
        this.context.lineTo(rect.bottomLeft.x, rect.bottomLeft.y);
        this.context.lineTo(rect.topLeft.x, rect.topLeft.y);
        this.context.stroke();
        this.context.restore();
    }
    rect_rect(obj1, obj2) {
        if (!canCollide(obj1, obj2)) return false;
        let rect1 = Object.assign({}, getVertices(obj1));
        let rect2 = Object.assign({}, getVertices(obj2));
        if (this.shouldShowHitbox) {
            this.showHitbox(rect1);
            this.showHitbox(rect2); 
        }
        return checkCollision(rect1, rect2);
    }
}