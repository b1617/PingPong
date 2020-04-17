
$('#startGame').click(() => {
    // console.log('start new game vs AI');
    // left.ai = false;
    // game.creator = true;
    // game.aiMode = false;
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