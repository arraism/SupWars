exports.socketHandler = function (socket){
    socket.on("disconnect", function  (data) {
        /*var id = data.id;
        delete CONNECTEDPLAYERS[id];
        for (var i in CONNECTEDPLAYERS) {
            CONNECTEDPLAYERS[i].socket.emit("game-disconnectPlayer", id);
        }   */   
    })

    socket.on("registerSocket",function(d) {
        var id = d.id;
        CONNECTEDPLAYERS[id] = d.data.userInfo;
        CONNECTEDPLAYERS[id].socket = socket;
        newPlayer = CONNECTEDPLAYERS[id];
        socket.emit("socket-registered");
        for (var i in CONNECTEDPLAYERS){
            var user = CONNECTEDPLAYERS[i];
            if (user.id != id){
                user.socket.emit("game-newPlayer",{
                    id: newPlayer.id,
                    x: newPlayer.x,
                    y: newPlayer.y,
                    login: newPlayer.login                    
                });
            }
        }
    });

    socket.on("game-getConnectedUsers", function () {
        var users = new Array();
        for (var i in CONNECTEDPLAYERS){
            var user = CONNECTEDPLAYERS[i];
            users.push({
                id: user.id,
                x: user.x,
                y: user.y,
                login: user.login
            })
        }
        socket.emit("game-connectedPlayers" , users);
    })

    // Send Map
    socket.on('game-getMap', function (coords) {
        socket.emit('game-getMap', null);
    });

/**************************************************************************************************
    Chat
/*************************************************************************************************/

    socket.on("chat-newMessage" , function(data){
        var message = data.data
        var user = CONNECTEDPLAYERS[data.id].login;

        if (MESSAGES.length > 20)
            MESSAGES.shift();
        data = {
            user: user,
            message:message
        }
        MESSAGES.push(data);
        for (var i in CONNECTEDPLAYERS)
            CONNECTEDPLAYERS[i].socket.emit("chat-newMessage" , data);

    });
}