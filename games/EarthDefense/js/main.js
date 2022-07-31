import { Game } from "./Game/Game.js";

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
