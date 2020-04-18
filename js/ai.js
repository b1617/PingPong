class AI {
  constructor(ball) {
    (this.player = null), (this.ball = ball);
  }

  setPlayer(player) {
    this.player = player;
    this.player.ai = true;
  }

  move(groundHeight) {
    if (this.ball.directionX == 1) {
      if (this.player.originalPosition == 'right') {
        this.followBall(groundHeight);
      }
      if (this.player.originalPosition == 'left') {
        this.goCenter(groundHeight);
      }
    } else {
      if (this.player.originalPosition == 'right') {
        this.goCenter(groundHeight);
      }
      if (this.player.originalPosition == 'left') {
        this.followBall(groundHeight);
      }
    }
  }

  followBall(groundHeight) {
    if (
      this.ball.posY < this.player.posY + this.player.height / 2 &&
      this.player.posY > 0
    ) {
      this.player.posY--;
    } else if (
      this.ball.posY > this.player.posY + this.player.height / 2 &&
      this.player.posY < groundHeight - this.player.height
    ) {
      this.player.posY++;
    }
  }

  goCenter(groundHeight) {
    if (this.player.posY + this.player.height / 2 > groundHeight / 2) {
      this.player.posY--;
    } else if (this.player.posY + this.player.height / 2 < groundHeight / 2) {
      this.player.posY++;
    }
  }
}
