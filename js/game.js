var game = {
  groundWidth: 700,
  groundHeight: 400,
  groundColor: "#000000",
  netWidth: 6,
  netColor: "#FFFFFF",
  groundLayer: null,
  scoreLayer: null,
  playersBallLayer: null,
  scorePosPlayer1: 300,
  scorePosPlayer2: 365,

  ball: {
    width: 10,
    height: 10,
    color: "#FFCC00",
    posX: 200,
    posY: 200,
    speed: 1,
    directionX: 1,
    directionY: 1,
    move: function () {
      this.posX += this.directionX * this.speed;
      this.posY += this.directionY * this.speed;
    },
    bounce: function () {
      if (this.posX > game.groundWidth || this.posX < 0)
        this.directionX = -this.directionX;
      if (this.posY > game.groundHeight || this.posY < 0)
        this.directionY = -this.directionY;
    },
  },
  playerOne: {
    width: 10,
    height: 50,
    color: "#FFFFFF",
    posX: 10,
    posY: 150
  },

  playerTwo: {
    width: 10,
    height: 50,
    color: "#FFFFFF",
    posX: 600,
    posY: 150
  },

  init: function () {
    this.groundLayer = game.display.createLayer("terrain", this.groundWidth, this.groundHeight, undefined, 0, "#000000", 0, 0);
    game.display.drawRectangleInLayer(this.groundLayer, this.netWidth, this.groundHeight, this.netColor, this.groundWidth / 2 - this.netWidth / 2, 0);

    this.scoreLayer = game.display.createLayer("score", this.groundWidth, this.groundHeight, undefined, 1, undefined, 0, 0);
    game.display.drawTextInLayer(this.scoreLayer, "SCORE", "10px Arial", "#FF0000", 10, 10);

    this.playersBallLayer = game.display.createLayer("joueursetballe", this.groundWidth, this.groundHeight, undefined, 2, undefined, 0, 0);
    game.display.drawTextInLayer(this.playersBallLayer, "JOUEURSETBALLE", "10px Arial", "#FF0000", 100, 100);

    this.displayScore(0, 0);
    this.displayBall();
    this.displayPlayers();
  },

  displayScore: function (scorePlayer1, scorePlayer2) {
    game.display.drawTextInLayer(this.scoreLayer, scorePlayer1, "60px Arial", "#FFFFFF", this.scorePosPlayer1, 55);
    game.display.drawTextInLayer(this.scoreLayer, scorePlayer2, "60px Arial", "#FFFFFF", this.scorePosPlayer2, 55);
  },
  displayBall: function () {
    game.display.drawRectangleInLayer(this.playersBallLayer, this.ball.width, this.ball.height, this.ball.color, this.ball.posX, this.ball.posY);
  },
  displayPlayers: function () {
    game.display.drawRectangleInLayer(this.playersBallLayer, this.playerOne.width, this.playerOne.height, this.playerOne.color, this.playerOne.posX, this.playerOne.posY);
    game.display.drawRectangleInLayer(this.playersBallLayer, this.playerTwo.width, this.playerTwo.height, this.playerTwo.color, this.playerTwo.posX, this.playerTwo.posY);
  },
  moveBall: function () {
    this.ball.move();
    this.ball.bounce();
    this.displayBall();
  },
  clearLayer: function (targetLayer) {
    targetLayer.clear();
  }
};