export class BackgroundHandler {
  constructor(context, commonController) {
    this.context = context;
    this.width = context.canvas.clientWidth;
    this.height = context.canvas.clientHeight;
    this.commonController = commonController;
  }

  drawLoadingScreen() {
    this.context.save();
    this.context.textAlign = 'center';
    this.context.textBaseline = 'middle';
    this.context.font = '20px Arial';
    this.context.fillStyle = 'black';
    this.context.fillText('Now loading...', this.width/2, this.height/2);
    this.context.restore();
  }

  drawMenuScreen() {
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
  }

  drawGameBackground() {
    this.context.save();
    this.context.fillStyle = 'rgb(0, 0, 0)';
    this.context.fillRect(0, 0, this.width, this.height);
    this.context.restore();
  }

  drawGameUserInterface() {
    let second = Math.floor(this.commonController.getTime() / 1000);
    let minute = Math.floor(second / 60); 
    second = second % 60;
    if (minute < 10) minute = "0" + minute;
    if (second < 10) second = "0" + second;

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
    this.context.fillText("LEVEL: " + this.commonController.getLevel(), 50, 18);
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
    this.context.fillText("SCORE: " + this.commonController.getScore(), this.width - 100, 18);
    this.context.restore();
  }

  drawPausedScreen() {
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
  }

  drawOverBackground() {
    this.context.save();
    this.context.fillStyle = 'rgb(255, 255, 255)';
    this.context.fillRect(0, 0, this.width, this.height);
    this.context.restore();
  }

  drawOverUserInterface() {
    let second = Math.floor(this.commonController.getTime() / 1000);
    let minute = Math.floor(second / 60); 
    second = second % 60;
    if (minute < 10) minute = "0" + minute;
    if (second < 10) second = "0" + second;

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
    this.context.fillText("LEVEL: " + this.commonController.getLevel(), 50, 18);
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
    this.context.fillText("SCORE: " + this.commonController.getScore(), this.width - 100, 18);
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
  }
}