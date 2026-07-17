import { Game } from "./Game/Game.js";

/* Game Start here — same loop shape as the Earth Defense engine. */
let canvas = document.getElementById("game");
let ctx = canvas.getContext("2d");

// The engine's InputHandler binds keys to the canvas, so it needs focus.
canvas.focus();
canvas.addEventListener("mousedown", () => canvas.focus());

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
