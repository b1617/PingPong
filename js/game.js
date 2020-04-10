var game = {
  groundWidth: 700,
  groundHeight: 400,
  groundColor: "#000000",
  netWidth: 6,
  netColor: "#FFFFFF",
  scorePosPlayer1: 300,
  scorePosPlayer2: 365,
  groundLayer: null,
  ball: {
    width: 10,
    height: 10,
    color: "#ffcc00",
    posX: 200,
    posY: 200,
    speed: 5,
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
    collide: function (anotherItem) {
      if (!(this.posX >= anotherItem.posX + anotherItem.width || this.posX <= anotherItem.posX - this.width
        || this.posY >= anotherItem.posY + anotherItem.height || this.posY <= anotherItem.posY - this.height)) {
        // Collision
        return true;
      }
      return false;
    },
  },
  playerOne: {
    width: 10,
    height: 50,
    color: "#FFFFFF",
    posX: 30,
    posY: 200,
    goUp: false,
    goDown: false,
    originalPosition: 'left'
  },

  playerTwo: {
    width: 10,
    height: 50,
    color: "#FFFFFF",
    posX: 650,
    posY: 200,
    goUp: false,
    goDown: false,
    originalPosition: 'right'
  },

  init: function () {
    this.groundLayer = game.display.createLayer("terrain", this.groundWidth, this.groundHeight, undefined, 0, "#000000", 0, 0);

    game.display.drawRectangleInLayer(this.groundLayer, this.netWidth, this.groundHeight, this.netColor, this.groundWidth / 2 - this.netWidth / 2, 0);
    this.scoreLayer = game.display.createLayer("score", this.groundWidth, this.groundHeight, undefined, 1, undefined, 0, 0);
    this.playersBallLayer = game.display.createLayer("joueursetballe", this.groundWidth, this.groundHeight, undefined, 2, undefined, 0, 0);

    this.displayScore(0, 0);
    this.displayBall();
    this.displayPlayers();

    this.initKeyboard(game.control.onKeyDown, game.control.onKeyUp);
    this.initMouse(game.control.onMouseMove);
    game.ia.setPlayerAndBall(this.playerTwo, this.ball);
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
  },
  initKeyboard: function (onKeyDownFunction, onKeyUpFunction) {
    window.onkeydown = onKeyDownFunction;
    window.onkeyup = onKeyUpFunction;
  },
  movePlayers: function () {
    if (game.control.controlSystem == "KEYBOARD") {
      // keyboard control
      if (game.playerOne.goUp && game.playerOne.posY > 0) {
        game.playerOne.posY -= 5;
      } else if (game.playerOne.goDown && game.playerOne.posY < game.groundHeight - game.playerOne.height) {
        game.playerOne.posY += 5;
      }
    } else if (game.control.controlSystem == "MOUSE") {
      // mouse control
      if (game.playerOne.goUp && game.playerOne.posY > game.control.mousePointer)
        game.playerOne.posY -= 5;
      else if (game.playerOne.goDown && game.playerOne.posY < game.control.mousePointer && game.playerOne.posY < game.groundHeight - game.playerOne.height)
        game.playerOne.posY += 5;
    }
  },
  initMouse: function (onMouseMoveFunction) {
    window.onmousemove = onMouseMoveFunction;
  },
  collideBallWithPlayersAndAction: function () {
    if (this.ball.collide(game.playerOne))
      game.ball.directionX = -game.ball.directionX;
    if (this.ball.collide(game.playerTwo))
      game.ball.directionX = -game.ball.directionX;
  },

};