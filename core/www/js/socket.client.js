// GET Map
socket.on('game-getMap', function (data) {
    $("#loader").hide();
    drawInterval = setInterval(function(){
            game.draw();
    }, config.game_speed);
});


socket.on ("socket-registered" , function(){
    socket.emit("game-getConnectedUsers");
});

socket.on("chat-newMessage" , function (data){
    $("#chat-messages").append('<div class="chat-message">'+data.user+' : '+data.message+'</div>');
});