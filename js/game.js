
const Game = class {

  constructor(ball, players) {
    this.groundWidth = 700,
      this.groundHeight = 400,
      this.groundColor = '#318CE7',
      this.netWidth = 6,
      this.netColor = '#FFFFFF',
      this.groundLayer = null,
      this.scoreLayer = null,
      this.playersBallLayer = null,
      this.groundLayer = null,
      this.scorePosPlayer1 = 300,
      this.scorePosPlayer2 = 365,
      this.wallSound = new Audio('./sound/player.ogg'),
      this.playerSound = null,
      this.divGame = null,
      this.gameOn = false,
      this.restartWinGameButton = null,
      this.restartLostGameButton = null,
      this.startGameButton = null,
      this.startGameWithFriend = null,
      this.creator = false,
      this.default = true,
      this.single = false,
      this.mutli = false,
      this.leftScore = 0,
      this.rightScore = 0,
      this.keycode = {
        KEYDOWN: 40,
        KEYUP: 38
      },
      this.ball = ball,
      this.players = players,
      this.control = new Control(this)
  }

  init() {
    this.divGame = document.getElementById('divGame');
    this.startGameButton = document.getElementById('startGame');
    this.startGameWithFriend = document.getElementById('startGameWithFriend');
    this.restartGameWinButton = document.getElementById('restartWin');
    this.restartGameLostButton = document.getElementById('restartLost');
    this.groundLayer = new Display().createLayer(
      'terrain',
      this.groundWidth,
      this.groundHeight,
      this.divGame,
      0,
      this.groundColor,
      500,
      100
    );

    new Display().drawRectangleInLayer(
      this.groundLayer,
      this.netWidth,
      this.groundHeight,
      this.netColor,
      this.groundWidth / 2 - this.netWidth / 2,
      0
    );

    this.scoreLayer = new Display().createLayer(
      'score',
      this.groundWidth,
      this.groundHeight,
      this.divGame,
      1,
      undefined,
      500,
      100
    );

    this.playersBallLayer = new Display().createLayer(
      'joueursetballe',
      this.groundWidth,
      this.groundHeight,
      this.divGame,
      2,
      undefined,
      500,
      100
    );

    this.displayScore(this.leftScore, this.rightScore);
    this.displayBall();
    this.displayPlayers();
    this.initKeyboard(this.control.onKeyDown, this.control.onKeyUp);
    this.initMouse(this.control.onMouseMove);
    this.initStartGameButton();
  }

  initKeyboard(onKeyDownFunction, onKeyUpFunction) {
    window.onkeydown = onKeyDownFunction;
    window.onkeyup = onKeyUpFunction;
  }

  initMouse(onMouseMoveFunction) {
    window.onmousemove = onMouseMoveFunction;
  }

  moveBall() {
    this.ball.move();
    this.ball.bounce(this.wallSound, this.groundWidth, this.groundHeight);
    this.displayBall();
  }

  displayPlayers() {
    for (const player of this.players) {
      new Display().drawRectangleInLayer(
        this.playersBallLayer,
        player.width,
        player.height,
        player.color,
        player.posX,
        player.posY
      );
    }
  }
  displayBall() {
    new Display().drawRectangleInLayer(
      this.playersBallLayer,
      this.ball.width,
      this.ball.height,
      this.ball.color,
      this.ball.posX,
      this.ball.posY
    );
  }
  displayScore(scorePlayer1, scorePlayer2) {
    new Display().drawTextInLayer(
      this.scoreLayer,
      scorePlayer1,
      '60px Arial',
      '#FFFFFF',
      this.scorePosPlayer1,
      55
    );
    new Display().drawTextInLayer(
      this.scoreLayer,
      scorePlayer2,
      '60px Arial',
      '#FFFFFF',
      this.scorePosPlayer2,
      55
    );
  }

  clearLayer(type) {
    const targetLayer = type === 'SCORE' ? this.scoreLayer : this.playersBallLayer;
    targetLayer.context2D.clearRect(0, 0, targetLayer.canvas.width, targetLayer.canvas.height);
  }

  initStartGameButton() {
    this.startGameButton.onclick = this.onStartGameWithAI;
    this.restartGameLostButton.onclick = this.onRestartGame;
    this.startGameWithFriend.onclick = this.onRestartGame;
    this.restartGameWinButton.onclick = this.onRestartGame;

  }

  onStartGame(player) {
    //game.reinitGame();
    console.log('on start game');
    this.gameOn = true;
    this.ball.inGame = true;
    this.ball.posX = player.posX + player.width;
    this.ball.posY = player.posY;
    this.ball.directionX = 1;
    this.ball.directionY = 1;
  }

  startBall(player) {
    if (player.originalPosition === 'right') {
      this.ball.inGame = true;
      this.ball.posX = player.posX;
      this.ball.posY = player.posY;
      this.ball.directionX = -1
      this.ball.directionY = 1
    } else {
      this.ball.inGame = true;
      this.ball.posX = player.posX + player.width;
      this.ball.posY = player.posY;
      this.ball.directionX = 1
      this.ball.directionY = 1
    }
  }


  reinitGame() {
    this.ball.inGame = false;
    this.ball.speed = 1;
    this.leftScore = 0;
    this.rightScore = 0;
    this.clearLayer('SCORE');
    this.displayScore(this.leftScore.score, this.rightScore.score);
  }

  onStartGameWithAI = (e) => {
    this.reinitGame();
    this.default = false;
    this.single = true;
    this.players[0].ai = false;
    this.onStartGame(this.players[0]);
  }

  onRestartGame = (e) => {
    console.log('call on restart this.game');
    this.reinitGame();
    this.onStartGame(this.players[0]);
  }
};
