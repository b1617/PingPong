game.ai = {
    player : null,
    ball : null,

    setPlayerAndBall : function(player, ball) {
        this.player = player;
        this.ball = ball;
      },

      move : function() {
        if ( this.ball.directionX == 1 ) {
            if ( this.player.originalPosition == "right" ) {
              // follow
              this.followBall();
            }
            if ( this.player.originalPosition == "left" ) {
              // center
              this.goCenter();
            }    
          } else {
            if ( this.player.originalPosition == "right" ) {
              // center
              this.goCenter();
            }
            if ( this.player.originalPosition == "left" ) {
              // follow
              this.followBall();
            }  
          }

    },

    followBall : function() {
        if ( this.ball.posY < this.player.posY + this.player.height/2  && this.player.posY > 0) {
            // la position de la balle est sur l'écran, au dessus de celle de la raquette
            this.player.posY--;
          } else if ( this.ball.posY > this.player.posY + this.player.height/2 && this.player.posY < game.groundHeight - this.player.height) {
            // la position de la balle est sur l'écran, en dessous de celle de la raquette
            this.player.posY++;
          }
    },
   
    goCenter : function() {
        if ( this.player.posY + this.player.height/2 > game.groundHeight / 2 ) {
            this.player.posY--;
          } else if ( this.player.posY + this.player.height/2 < game.groundHeight / 2 ) {
            this.player.posY++;
          }
    },

    startBall : function() {
        if ( this.player.originalPosition == "right" ) {
          this.ball.inGame = true;
          this.ball.posX = this.player.posX;
          this.ball.posY = this.player.posY;
          this.ball.directionX = -1;
          this.ball.directionY = 1;
        } else {
          this.ball.inGame = true;
          this.ball.posX = this.player.posX + this.player.width;
          this.ball.posY = this.player.posY;
          this.ball.directionX = 1;
          this.ball.directionY = 1;
        }
      }
}