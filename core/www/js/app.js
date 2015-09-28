var game; // Game Instance
var socket; // Socket.IO
var drawInterval;
var scrollXInterval;
var scrollYInterval;
// Configuration: toutes les constantes seront déclarées ici
var config = {
	game_speed: 30,
	canvas_width: 1067,
	canvas_height: 600,
	scroll_speed: 30,
	scroll_border: 70
}

// Canvas dans lequel sera dessiné le jeu
var canvas = document.getElementById("game-canvas");
var context = canvas.getContext('2d');
canvas.width = config.canvas_width;
canvas.height = config.canvas_height;

// Gestionnaire clavier pour le jeu

$(document).ready(function(){
	document.onkeydown = keyboardHandler;
	game = new Game();
	game.init();
	socketEmitWithId("registerSocket" , {userInfo:userInfo});
	socketEmitWithId("game-getMap" , {userInfo:userInfo});
});