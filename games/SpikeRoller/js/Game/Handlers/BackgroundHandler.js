/**
 * Draws the non-object visuals: sky + parallax hills, the menu, the HUD, and
 * the win screen. Same role as the Earth Defense BackgroundHandler.
 */
export class BackgroundHandler {
  constructor(context, commonController) {
    this.context = context;
    this.width = context.canvas.clientWidth;
    this.height = context.canvas.clientHeight;
    this.common = commonController;
  }

  drawLoadingScreen() {
    const ctx = this.context;
    ctx.save();
    ctx.fillStyle = "#0d0f1c";
    ctx.fillRect(0, 0, this.width, this.height);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "20px system-ui";
    ctx.fillStyle = "#cfd2e0";
    ctx.fillText("Loading...", this.width / 2, this.height / 2);
    ctx.restore();
  }

  drawGameBackground(cameraX) {
    const ctx = this.context;
    const sky = ctx.createLinearGradient(0, 0, 0, this.height);
    sky.addColorStop(0, "#20233d");
    sky.addColorStop(1, "#0d0f1c");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, this.width, this.height);

    // Parallax hills scroll slower than the world.
    ctx.fillStyle = "#191b33";
    const offset = -(cameraX * 0.3) % 400;
    for (let x = offset - 400; x < this.width + 400; x += 400) {
      ctx.beginPath();
      ctx.arc(x + 200, this.height, 260, Math.PI, 0);
      ctx.fill();
    }
  }

  drawMenuScreen() {
    const ctx = this.context;
    ctx.save();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "bold 56px system-ui";
    ctx.fillStyle = "#4ec9e0";
    ctx.fillText("Spike Roller", this.width / 2, this.height / 2 - 20);

    ctx.font = "20px system-ui";
    ctx.fillStyle = "#cfd2e0";
    ctx.fillText("Press Space to roll", this.width / 2, this.height / 2 + 40);
    ctx.restore();
  }

  drawHUD(deaths) {
    const ctx = this.context;
    ctx.save();
    ctx.fillStyle = "#cfd2e0";
    ctx.font = "16px system-ui";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText("Deaths: " + deaths, 16, 14);
    ctx.textAlign = "right";
    ctx.fillText(formatTime(this.common.getTime()), this.width - 16, 14);
    ctx.restore();
  }

  drawWinScreen(deaths) {
    const ctx = this.context;
    ctx.save();
    ctx.fillStyle = "rgba(13,15,28,0.75)";
    ctx.fillRect(0, 0, this.width, this.height);

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#6ee7a8";
    ctx.font = "bold 44px system-ui";
    ctx.fillText("You reached the flag!", this.width / 2, this.height / 2 - 20);

    ctx.fillStyle = "#cfd2e0";
    ctx.font = "18px system-ui";
    ctx.fillText(
      "Deaths: " + deaths + "  ·  Time: " + formatTime(this.common.getTime()),
      this.width / 2,
      this.height / 2 + 24
    );
    ctx.fillText("Press Space to return to the menu", this.width / 2, this.height / 2 + 52);
    ctx.restore();
  }
}

function formatTime(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  let minutes = Math.floor(totalSeconds / 60);
  let seconds = totalSeconds % 60;
  if (minutes < 10) minutes = "0" + minutes;
  if (seconds < 10) seconds = "0" + seconds;
  return minutes + ":" + seconds;
}
