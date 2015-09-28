function keyboardHandler(event){
	keyCode= event.keyCode;
	var direction = "";
	switch (keyCode){		
		// Moves
		case 37: direction = "left"; break;
		case 38: direction = "up"; break;
		case 39: direction = "right"; break;
		case 40: direction = "down"; break;
		default: break;
	}
};

function getMousePos(canvas, evt) {
	var rect = canvas.getBoundingClientRect();
	return {
		x: evt.clientX - rect.left,
		y: evt.clientY - rect.top
	};
};

function socketEmitWithId(eventName, data) {
	socket.emit(eventName , {
		id: userInfo.id,
		data: data
	});
};