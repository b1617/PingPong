(function () {
  let requestAnimId;

  let initialisation = function () {
    game.init();
    requestAnimId = window.requestAnimationFrame(main);
  };
  let main = function () {
    game.clearLayer(game.playersBallLayer);
    game.movePlayers();
    game.displayPlayers();
    game.moveBall();
    if (game.ball.inGame) {
      game.lostBall();
    }
    game.ai.move();
    game.collideBallWithPlayersAndAction();
    requestAnimId = window.requestAnimationFrame(main);
  };
  window.onload = initialisation;

  let socket = io();

  $('#startGame').click(() => {
    game.ai.setAIMode(true);
    game.creator = true;
    game.aiMode = true;
    $('#win').css('display', 'none');
    $('#lost').css('display', 'none');
  });

  $('.btnRestart').click(() => {
    $('#win').css('display', 'none');
    $('#lose').css('display', 'none');
    if (game.aiMode) {
      game.control.onRestartGame();
    } else {
      socket.emit('restart');
      game.control.onRestartGame();
    }
  });

  $('#create').click(() => {
    $('#startGame').prop('disabled', true);
    $('#joinDiv').css('display', 'none');
    $('#createDiv').css('display', 'none');
    const username = $('#usernameCreate').val();
    $('.players').css('display', 'block');
    $('#player1').append(username);
    socket.emit('creation', { username });
  });
  socket.on('created', (data) => {
    $('#secretId').append(data.secretId);
  });

  $('#join').click(() => {
    const username = $('#usernameJoin').val();
    const secretId = $('#secretIdJoin').val();
    $('#player2').text('Player 2 ' + username);
    socket.emit('joining', { username, secretId });
  });

  socket.on('joined', (data) => {
    $('#player2').text('Player 2 : ' + data.username);
    $('#startGameWithFriend').css('display', 'block');
  });

  socket.on('createOnJoin', (data) => {
    $('#joinDiv').css('display', 'none');
    $('#createDiv').css('display', 'none');
    $('.players').css('display', 'block');
    $('#secretId').append(data.secretId);
    $('#player1').append(data.username);
    $('#startGameWithFriend').css('display', 'none');
    $('.btnRestart').css('display', 'none');
    game.ball.posX = 500;
    game.gameOn = true;
    setInterval(() => {
      socket.emit('movePlayer', { y: game.playerOne.posY });
    });
  });
  let timer = null;
  $('#startGameWithFriend').click(() => {
    game.creator = true;
    timer = setInterval(() => {
      socket.emit('moveBall', {
        x: game.ball.posX,
        y: game.ball.posY,
        speed: game.ball.speed
      });
      socket.emit('movePlayer', { y: game.playerOne.posY });
      socket.emit('score', {
        s1: game.playerOne.score,
        s2: game.playerTwo.score
      });
    });
  });

  $('#score').change(() => {
    console.log('ss');
    socket.emit('score', {
      s1: game.playerOne.score,
      s2: game.playerTwo.score
    });
  });

  socket.on('moveBall', (data) => {
    const { x, y, speed } = data;
    game.ball.posX = game.groundWidth - x;
    game.ball.posY = y;
    game.ball.speed = speed;
  });

  socket.on('movePlayer', (data) => {
    const { y } = data;
    game.playerTwo.posY = y;
  });

  socket.on('restart', (data) => {
    $('#win').css('display', 'none');
    $('#lost').css('display', 'none');
    game.gameOn = true;
  });

  let lastScore = { s1: 0, s2: 0 };
  socket.on('score', (data) => {
    const { s1, s2 } = data;
    if (lastScore.s1 !== s1 || lastScore.s2 !== s2) {
      lastScore.s1 = s1;
      lastScore.s2 = s2;
      if (lastScore.s1 === 3 || lastScore.s2 === 3) {
        if (s2 == 3) {
          $('#win').css('display', 'block');
        } else {
          $('#lost').css('display', 'block');
        }
        game.gameOn = false;
        clearInterval(timer);
      }
      game.scoreLayer.clear();
      game.displayScore(s2, s1);
    }
  });
})();
