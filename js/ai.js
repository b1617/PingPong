class AI {
  constructor(ball) {
    this.player = null,
      this.ball = ball
  }

  setPlayer(player) {
    this.player = player;
    this.player.ai = true;
  }

  move(groundHeight) {
    if (this.ball.directionX == 1) {
      if (this.player.originalPosition == 'right') {
        // follow
        this.followBall(groundHeight);
      }
      if (this.player.originalPosition == 'left') {
        // center
        this.goCenter(groundHeight);
      }
    } else {
      if (this.player.originalPosition == 'right') {
        // center
        this.goCenter(groundHeight);
      }
      if (this.player.originalPosition == 'left') {
        // follow
        this.followBall(groundHeight);
      }
    }
  }

  followBall(groundHeight) {
    if (
      this.ball.posY < this.player.posY + this.player.height / 2 &&
      this.player.posY > 0
    ) {
      // la position de la balle est sur l'écran, au dessus de celle de la raquette
      this.player.posY--;
    } else if (
      this.ball.posY > this.player.posY + this.player.height / 2 &&
      this.player.posY < groundHeight - this.player.height
    ) {
      // la position de la balle est sur l'écran, en dessous de celle de la raquette
      this.player.posY++;
    }
  }

  goCenter(groundHeight) {
    if (this.player.posY + this.player.height / 2 > groundHeight / 2) {
      this.player.posY--;
    } else if (
      this.player.posY + this.player.height / 2 <
      groundHeight / 2
    ) {
      this.player.posY++;
    }
  }

}
