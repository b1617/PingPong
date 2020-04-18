(function () {
  let requestAnimId;
  const socket = io();
  let leftTop = new Player(30, 175, 'left', '#FFFF00');
  let rightTop = new Player(660, 175, 'right', '#0000CC');
  let leftDown = new Player(30, 300, 'left', '#CC0000');
  let rightDown = new Player(660, 300, 'right', '#33FF66');

  // Default game
  let ball = new Ball();
  let aiLeft = new AI(ball);
  let aiRight = new AI(ball);
  let game = new Game(ball, [leftTop, rightTop]);

  ball.setGame(game);
  aiLeft.setPlayer(leftTop);
  aiRight.setPlayer(rightTop);
  game.init();

  let initialisation = function () {
    requestAnimId = window.requestAnimationFrame(main);
  };
  let main = function () {
    game.clearLayer(game.playersBallLayer);
    game.displayPlayers();
    game.moveBall();
    if (
      ball.inGame &&
      (game.single || game.default || (game.mutli && game.isCreator))
    ) {
      ball.lostBall();
    }

    if (game.default) {
      aiLeft.move(game.groundHeight);
      aiRight.move(game.groundHeight);
    } else if (game.single) {
      leftTop.move(game.control, game.groundHeight);
      aiRight.move(game.groundHeight);
    } else if (game.mutli) {
      if (game.isCreator) {
        socket.emit('information', {
          key: game.secretId,
          x: ball.getX(),
          y: ball.getY(),
          s1: game.leftScore,
          s2: game.rightScore
        });
      }
      if (game.isOne) {
        leftTop.move(game.control, game.groundHeight);
        socket.emit('movePlayer', {
          y: leftTop.getY(),
          n: 1,
          key: game.secretId
        });
      } else if (game.isTwo) {
        game.isWin();
        rightTop.move(game.control, game.groundHeight);
        socket.emit('movePlayer', {
          y: rightTop.getY(),
          n: 2,
          key: game.secretId
        });
      } else if (game.isThree) {
        game.isWin();
        leftDown.move(game.control, game.groundHeight);
        socket.emit('movePlayer', {
          y: leftDown.getY(),
          n: 3,
          key: game.secretId
        });
      } else if (game.isFour) {
        game.isWin();
        rightDown.move(game.control, game.groundHeight);
        socket.emit('movePlayer', {
          y: rightDown.getY(),
          n: 4,
          key: game.secretId
        });
      }
    }
    ball.collideBallWithPlayersAndAction(game.players);
    requestAnimId = window.requestAnimationFrame(main);
  };
  window.onload = initialisation;

  $('#startGame').click(() => {
    $('#win').css('display', 'none');
    $('#lost').css('display', 'none');
  });

  $('.btnRestart').click(() => {
    $('#win').css('display', 'none');
    $('#lost').css('display', 'none');
    if (game.isOne) {
      socket.emit('restart', { key: game.secretId });
    }
  });

  $('#create').click(() => {
    const username = $('#usernameCreate').val();
    if (username.length > 0) {
      $('#startGame').prop('disabled', true);
      $('#joinDiv').css('display', 'none');
      $('#createDiv').css('display', 'none');
      const nbPlayers = $('#nbPlayers').val();
      if (nbPlayers == '2') {
        $('.four').css('display', 'none');
      } else {
        game.players.push(...[leftDown, rightDown]);
      }
      $('.players').css('display', 'block');
      $('#player1').append(username);
      socket.emit('creation', { username, nbPlayers });
    }
  });

  socket.on('created', (data) => {
    console.log('created', data);
    game.onStartJoinWithoutAi(leftTop);
    game.control.setPlayer(leftTop);
    game.isOne = true;
    game.isBall = true;
    game.secretId = data.secretId;
    $('#secretId').append(data.secretId);
    $('#startGameWithFriend').css('display', 'block');
  });

  $('#join').click(() => {
    const username = $('#usernameJoin').val();
    const secretId = $('#secretIdJoin').val();
    if (username && secretId) {
      socket.emit('joining', { username, secretId });
    }
  });

  socket.on('joined', (data) => {
    console.log(data);
    $(`#player${data.num}`).append(data.username);
    socket.emit('information', {
      x: ball.getX(),
      y: ball.getY(),
      key: game.secretId,
      s1: game.leftScore,
      s2: game.rightScore
    });
    if (data.num == parseInt(data.nbPlayers)) {
      $('#startGameWithFriend').prop('disabled', false);
    }
  });

  socket.on('erreur', (data) => {
    console.log('errr');
    $('#divErreur').css('display', 'block');
    $('#erreur').text(data.message);
    setTimeout(() => {
      $('#divErreur').css('display', 'none');
    }, 3000);
  });

  socket.on('createOnJoin', (data) => {
    console.log('create on join ', data);
    $('#startGame').prop('disabled', true);
    $('#joinDiv').css('display', 'none');
    $('#createDiv').css('display', 'none');
    $('.players').css('display', 'block');
    $('#secretId').append(data.secretId);
    $('#startGameWithFriend').css('display', 'none');
    $('.btnRestart').css('display', 'none');
    if (data.nbPlayers == '2') {
      $('.four').css('display', 'none');
    } else {
      game.players.push(...[leftDown, rightDown]);
    }
    game.secretId = data.secretId;
    const len = data.players.length;
    for (let i = 1; i <= len; ++i) {
      $(`#player${i}`).append(data.players[i - 1]);
    }
    console.log('lenght', len);
    if (len == 2) {
      game.onStartJoinWithoutAi(rightTop);
      game.control.setPlayer(rightTop);
      game.isTwo = true;
    } else if (len == 3) {
      game.onStartJoinWithoutAi(leftDown);
      game.control.setPlayer(leftDown);
      game.isThree = true;
    } else {
      game.onStartJoinWithoutAi(rightDown);
      game.control.setPlayer(rightDown);
      game.isFour = true;
    }
  });

  let lastScore = { s1: 0, s2: 0 };
  socket.on('information', (data) => {
    const { x, y, s1, s2 } = data;
    ball.setPos(x, y);
    if (lastScore.s1 !== s1 || lastScore.s2 !== s2) {
      lastScore.s1 = s1;
      lastScore.s2 = s2;
      game.leftScore = s1;
      game.rightScore = s2;
      game.clearLayer('SCORE');
      game.displayScore(s1, s2);
    }
  });

  socket.on('movePlayer', (data) => {
    const { y, n } = data;
    game.players[n - 1].setY(y);
  });

  $('#startGameWithFriend').click(() => {
    game.onStartGameWithoutAI(leftTop);
  });

  socket.on('restart', (data) => {
    $('#win').css('display', 'none');
    $('#lost').css('display', 'none');
    game.gameOn = true;
  });
})();
