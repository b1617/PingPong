(function () {
  let requestAnimId;

  const socket = io();
  let leftTop = new Player(30, 175, 'left');
  let rightTop = new Player(660, 175, 'right');

  // let leftDown = new Player(30, 300, 'left');
  // let rightDown = new Player(660, 300, 'right');

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
    if (ball.inGame) {
      ball.lostBall();
    }
    // Default
    if (game.default) {
      aiLeft.move(game.groundHeight);
      aiRight.move(game.groundHeight);
    } else if (game.single) {
      // 1 vs AI 
      leftTop.move(game.control, game.groundHeight);
      aiRight.move(game.groundHeight);
    } else if (game.mutli) {
      if (game.isCreator) {
        socket.emit('moveBall', ball.getPos())
      }

      if (game.isOne) {
        leftTop.move(game.control, game.groundHeight);
        socket.emit('movePlayer', { y: leftTop.getY(), n: 1 })
      } else if (game.isTwo) {
        rightTop.move(game.control, game.groundHeight);
        socket.emit('movePlayer', { y: rightTop.getY(), n: 2 })
      }
      // leftTop.move(game.control, game.groundHeight);
    }
    ball.collideBallWithPlayersAndAction(game.players);
    requestAnimId = window.requestAnimationFrame(main);
  };
  window.onload = initialisation;

  // set up 
  $('#startGame').click(() => {
    $('#win').css('display', 'none');
    $('#lost').css('display', 'none');
  });

  $('.btnRestart').click(() => {
    $('#win').css('display', 'none');
    $('#lost').css('display', 'none');
    // if (game.aiMode) {
    //   game.control.onRestartGame();
    // } else {
    //   socket.emit('restart');
    //   game.control.onRestartGame();
    // }
  });

  // Etape 1 : create game
  $('#create').click(() => {
    $('#startGame').prop('disabled', true);
    $('#joinDiv').css('display', 'none');
    $('#createDiv').css('display', 'none');
    const username = $('#usernameCreate').val();
    const nbPlayers = $('#nbPlayers').val();
    if (nbPlayers == '2') $('.four').css('display', 'none');
    // set as creator 
    $('.players').css('display', 'block');
    $('#player1').append(username);

    // create default pos
    // game.onStartGameWithoutAI(leftTop);
    socket.emit('creation', { username, nbPlayers });
  });

  //  Receive secret key
  socket.on('created', (data) => {
    console.log('created', data);
    game.onStartJoinWithoutAi(leftTop);
    game.control.setPlayer(leftTop);
    game.isOne = true;
    game.isBall = true;
    $('#secretId').append(data.secretId);
    $('#startGameWithFriend').css('display', 'block');
  });

  // Join with key and username
  $('#join').click(() => {
    const username = $('#usernameJoin').val();
    const secretId = $('#secretIdJoin').val();
    socket.emit('joining', { username, secretId });
  });

  // joined the game
  socket.on('joined', (data) => {
    console.log(data);
    $(`#player${data.num}`).append(data.username);
    if (data.num == parseInt(data.nbPlayers)) {
      $('#startGameWithFriend').prop('disabled', false);
    }
  });

  socket.on('erreur', () => {
    console.log('errr');
  })

  socket.on('createOnJoin', (data) => {
    console.log('create on join ', data);
    $('#startGame').prop('disabled', true);
    $('#joinDiv').css('display', 'none');
    $('#createDiv').css('display', 'none');
    $('.players').css('display', 'block');
    $('#secretId').append(data.secretId);
    $('#startGameWithFriend').css('display', 'none');
    $('.btnRestart').css('display', 'none');
    if (data.nbPlayers == '2') $('.four').css('display', 'none');
    const len = data.players.length;
    for (let i = 1; i <= len; ++i) {
      $(`#player${i}`).append(data.players[i - 1]);
    }
    console.log(len);
    if (len == 2) {
      game.onStartJoinWithoutAi(rightTop);
      game.control.setPlayer(rightTop);
      game.isTwo = true;
    } else if (len == 3) {
      game.onStartJoinWithoutAI(rightTop);
      game.control.setPlayer(rightTop);
      game.isThree = true;
    } else {
      game.onStartJoinWithoutAI(rightTop);
      game.control.setPlayer(rightTop);
      game.isFour = true;
    }
  });

  socket.on('moveBall', (data) => {
    const { x, y } = data;
    ball.setPos(x, y);
  });

  socket.on('movePlayer', (data) => {
    const { y, n } = data;
    game.players[n - 1].setY(y);
  });

  $('#startGameWithFriend').click(() => {
    game.onStartGameWithoutAI(leftTop);
    //   socket.emit('score', {
    //     s1: game.playerOne.score,
    //     s2: game.playerTwo.score
    //   });
    // });
  });

  // $('#score').change(() => {
  //   console.log('ss');
  //   socket.emit('score', {
  //     s1: game.playerOne.score,
  //     s2: game.playerTwo.score
  //   });
  // });



  // socket.on('restart', (data) => {
  //   $('#win').css('display', 'none');
  //   $('#lost').css('display', 'none');
  //   game.gameOn = true;
  // });

  // let lastScore = { s1: 0, s2: 0 };
  // socket.on('score', (data) => {
  //   const { s1, s2 } = data;
  //   if (lastScore.s1 !== s1 || lastScore.s2 !== s2) {
  //     lastScore.s1 = s1;
  //     lastScore.s2 = s2;
  //     if (lastScore.s1 === 3 || lastScore.s2 === 3) {
  //       if (s2 == 3) {
  //         $('#win').css('display', 'block');
  //       } else {
  //         $('#lost').css('display', 'block');
  //       }
  //       game.gameOn = false;
  //       clearInterval(timer);
  //     }
  //     game.scoreLayer.clear();
  //     game.displayScore(s2, s1);
  //   }
  // });
})();
