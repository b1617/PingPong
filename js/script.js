(function () {
    // début du code isolé
    let requestAnimId;

    let initialisation = function () {
        // le code de l'initialisation
        game.init();
        requestAnimId = window.requestAnimationFrame(main); // premier appel de main au rafraîchissement de la page
    }
    let main = function () {
        // le code du jeu
        game.clearLayer(game.playersBallLayer);
        game.movePlayers();
        game.displayPlayers();
        game.moveBall();
        if (game.ball.inGame) {
            game.lostBall();
        }
        game.ai.move();
        game.collideBallWithPlayersAndAction();
        requestAnimId = window.requestAnimationFrame(main); // rappel de main au prochain rafraîchissement de la page
    }
    window.onload = initialisation; // appel de la fonction initialisation au chargement de la page
    // fin du code isol
    let socket = io();

    $('#startGame').click(() => {
        game.ai.setAIMode(true);
    });

    $('#create').click(() => {
        $('#joinDiv').css('display', 'none');
        $('#createDiv').css('display', 'none');
        const username = $('#usernameCreate').val();
        $('.players').css('display', 'block');
        $('#player1').append(username);
        socket.emit('creation', { username });
    });
    socket.on('created', (data) => {
        console.log(data.secretId);
        $('#secretId').append(data.secretId);
    });

    $('#join').click(() => {
        const username = $('#usernameJoin').val();
        const secretId = $('#secretIdJoin').val();
        $('#player2').text('Player 2 ' + username);
        socket.emit('joining', { username, secretId });
    });

    socket.on('joined', (data) => {
        console.log(data);
        // Player 2 joined the game
        $('#player2').text('Player 2 : ' + data.username);
        $('#startGameWithFriend').css('display', 'block');
    });

    socket.on('createOnJoin', (data) => {
        $('#joinDiv').css('display', 'none');
        $('#createDiv').css('display', 'none');
        $('.players').css('display', 'block');
        $('#secretId').append(data.secretId);
        $('#player1').append(data.username);
        // only creator can start the game
        $('#startGameWithFriend').css('display', 'none');
        // we can start the second player move 
        game.ball.posX = 500;
        game.gameOn = true;

        setInterval(() => {
            socket.emit('movePlayer', { y: game.playerOne.posY });
        });
    });


    $('#startGameWithFriend').click(() => {
        socket.emit('start');
        setInterval(() => {
            socket.emit('moveBall', { x: game.ball.posX, y: game.ball.posY, speed: game.ball.speed });
            socket.emit('movePlayer', { y: game.playerOne.posY })
        });
    });

    socket.on('moveBall', (data) => {
        console.log('ball move');
        const { x, y, speed } = data;
        game.ball.posX = game.groundWidth - x;
        game.ball.posY = y;
        game.ball.speed = speed;
    });

    socket.on('movePlayer', (data) => {
        const { y } = data;
        game.playerTwo.posY = y;
    });

})();