function Game(){
	this.me = new User(userInfo);
	this.map = new Map();

	this.teams = new Array();
	var team = new Team({user: this.me,
						 color: "red",
						 id: 1});
	this.teams.push(team);

	var user = new User({id: 2,
						 login: "ennemi",
						 img: "portrait2.png"});
	var team = new Team({user: user,
					 color: "blue",
					 id: 2});
	this.teams.push(team);

	this.turn = this.teams[0];

	this.image_path = "../../img/";

	this.cursor = new Image();
	this.cursor.src = this.image_path + "cursor.png";
	this.large_cursor = new Image();
	this.large_cursor.src = this.image_path + "large_cursor.png";
	this.map_cursor = true;
	this.menu_cursor = false;
	this.action_menu_cursor = false;

	this.HUD = new HUD();

	this.mouse = 
	{
		x: 0,
		y: 0
	};

	this.clickUnit = null;
	this.overUnit = null;

	this.money_by_building = 1000;

	this.init = function(){
		this.config_mouse();
		this.map.createQuickMap();
		this.set_team_data();
		this.map.drawMap();
	};

	//Test si l'unité peut attaquer
	this.canAttack = function(tile,unit){
		return ((game.map.tiles[tile.x+1][tile.y].unit != null && game.map.tiles[tile.x+1][tile.y].unit.team != unit.team)
				|| (game.map.tiles[tile.x-1][tile.y].unit != null && game.map.tiles[tile.x-1][tile.y].unit.team != unit.team)
				|| (game.map.tiles[tile.x][tile.y+1].unit != null && game.map.tiles[tile.x][tile.y+1].unit.team != unit.team)
				|| (game.map.tiles[tile.x][tile.y-1].unit != null && game.map.tiles[tile.x][tile.y-1].unit.team != unit.team));
	};

	this.canCapture = function(tile,unit){
		return (tile.isBuilding() == true && (tile.team == null || tile.team != unit.team) && unit.type == "soldat");
	};

	this.attack = function(tileUnit,tileAttackedUnit){
		tileAttackedUnit.unit.hp -= Math.floor(tileUnit.unit.damage * (tileUnit.unit.hp/100) * (1-(tileAttackedUnit.defense/6)) * (1+((100-tileAttackedUnit.unit.hp)/100)));
		if(tileAttackedUnit.unit.hp < 0){
			tileAttackedUnit.unit = null;
		} else {
			tileUnit.unit.hp -= Math.floor(tileAttackedUnit.unit.damage * (tileAttackedUnit.unit.hp/100) * (1-(tileUnit.defense/6)) * (1+((100-tileUnit.unit.hp)/100)));
		}
		if(tileUnit.unit.hp < 0){
			tileUnit.unit = null;
		}
		tileUnit.canPlay = false;
	};

	this.set_team_data = function(){
		//Met en place le nombre de building des teams
		for(var i = 0 ; i < this.teams.length ; i++){
			for(var j = 0 ; j < this.map.tiles.length ; j++){
				for(var k = 0 ; k < this.map.tiles[j].length ; k++){
					if(this.map.tiles[j][k].isBuilding() == true && this.map.tiles[j][k].team == this.teams[i].color){
						this.teams[i].nb_building++;
					}
				}
			}
		}
	}

	this.earn_money = function(team){
		team.money += this.money_by_building*team.nb_building;
	};

	this.draw = function(){
		this.map.drawMap();
		if(this.map_cursor){
			this.draw_map_cursor();
		}
		this.HUD.draw_menu();
		this.HUD.draw_action_menu();
		if(this.menu_cursor){
			this.draw_menu_cursor();
		}
		if(this.action_menu_cursor){
			this.draw_action_menu_cursor();
		}
		if(this.overUnit != null){
			this.HUD.draw_unit_data(this.overUnit.unit);
		}
		if(this.HUD.damage_data.show){
			this.HUD.draw_damage_data(this.map.tiles[this.clickUnit.newX][this.clickUnit.newY],this.overUnit);
		}
		if(this.HUD.team_data.show){
			this.HUD.draw_team_data();
		}
	};

	this.draw_map_cursor = function(){
		context.drawImage(this.cursor,(Math.floor((this.mouse.x - this.map.scrollingX)/this.map.tile_width)*this.map.tile_width)+this.map.scrollingX,(Math.floor((this.mouse.y - this.map.scrollingY)/this.map.tile_height)*this.map.tile_height)+this.map.scrollingY,this.map.tile_width,this.map.tile_height);
	};

	this.draw_menu_cursor = function(){
		var indexItemClicked = Math.floor((this.mouse.y - this.HUD.menu.y) / this.HUD.menu.item_height);
		context.drawImage(this.large_cursor,this.HUD.menu.x,(indexItemClicked * this.HUD.menu.item_height ) + this.HUD.menu.y,this.HUD.menu.width,this.HUD.menu.item_height);
	};

	this.draw_action_menu_cursor = function(){
		var indexItemClicked = Math.floor((this.mouse.y - this.HUD.action_menu.y) / this.HUD.action_menu.item_height);
		context.drawImage(this.large_cursor,this.HUD.action_menu.x,(indexItemClicked * this.HUD.action_menu.item_height ) + this.HUD.action_menu.y,this.HUD.action_menu.width,this.HUD.action_menu.item_height);
	};

	this.map_mousemove_EventListener = function(evt) {
		var mousePos = getMousePos(canvas, evt);
		//Récupération de la position du curseur
		game.mouse.x = mousePos.x;
		game.mouse.y = mousePos.y;
		game.map_cursor = true;
		//Fait scroll la map si le curseur est sur les bords
		if(mousePos.x >= config.canvas_width-config.scroll_border){
			clearInterval(scrollXInterval);
			scrollXInterval = setInterval(function(){if(game.map.scrollingX > -((game.map.tile_width*game.map.tiles.length)-config.canvas_width)){game.map.scrollingX -= config.scroll_speed;}},config.game_speed);
		} else if(mousePos.x <= config.scroll_border){
			clearInterval(scrollXInterval);
			scrollXInterval = setInterval(function(){if(game.map.scrollingX < 0){game.map.scrollingX += config.scroll_speed;}},config.game_speed);
		} else {
			clearInterval(scrollXInterval);
		}
		if(mousePos.y >= config.canvas_height-config.scroll_border){
			clearInterval(scrollYInterval);
			scrollYInterval = setInterval(function(){if(game.map.scrollingY > -((game.map.tile_height*game.map.tiles[0].length)-config.canvas_height)){game.map.scrollingY -= config.scroll_speed;}},config.game_speed);
		} else if(mousePos.y <= config.scroll_border && (mousePos.x < game.HUD.btn_menu.x || mousePos.x > game.HUD.btn_menu.x+game.HUD.btn_menu.width)){
			clearInterval(scrollYInterval);
			scrollYInterval = setInterval(function(){if(game.map.scrollingY < 0){game.map.scrollingY += config.scroll_speed;}},config.game_speed);
		} else {
			clearInterval(scrollYInterval);
		}

		//Si le curseur est sur une case avec une unité, affiche les données
		var tileX, tileY;
		tileX = Math.floor((mousePos.x - game.map.scrollingX)/game.map.tile_width);
		tileY = Math.floor((mousePos.y - game.map.scrollingY)/game.map.tile_height);
		if(game.map.tiles[tileX][tileY].unit != null){
			game.overUnit = game.map.tiles[tileX][tileY];
		} else {
			game.overUnit = null;
		}

		//Si l'utilisateur passe sur une unité qu'il peut attaquer, affiche les dégats
		if(game.map.tiles[tileX][tileY].canAttack == true){
			//Calcule des coordonnées où afficher les données
			game.HUD.damage_data.x = (Math.floor((game.mouse.x - game.map.scrollingX)/game.map.tile_width)*game.map.tile_width)+game.map.scrollingX+game.map.tile_width;
			if(game.HUD.damage_data.x+game.HUD.damage_data.width > config.canvas_width){
				game.HUD.damage_data.x -= game.HUD.damage_data.width+game.map.tile_width;
			}
			game.HUD.damage_data.y = (Math.floor((game.mouse.y - game.map.scrollingY)/game.map.tile_height)*game.map.tile_height)+game.map.scrollingY;
			if(game.HUD.damage_data.y+game.HUD.damage_data.height > config.canvas_height){
				game.HUD.damage_data.y = config.canvas_height-game.HUD.damage_data.height;
			}
			game.HUD.damage_data.show = true;
		} else {
			game.HUD.damage_data.show = false;
		}
	};

	this.map_click_EventListener = function(evt) {
		var mousePos = getMousePos(canvas, evt);
		//Récupère les coordonnées de la tile cliquée
		var tileX, tileY;
		tileX = Math.floor((mousePos.x - game.map.scrollingX)/game.map.tile_width);
		tileY = Math.floor((mousePos.y - game.map.scrollingY)/game.map.tile_height);

		//Check si l'utilisateur a cliqué sur le menu
		if(mousePos.x >= game.HUD.btn_menu.x && mousePos.x <= game.HUD.btn_menu.x + game.HUD.btn_menu.width && mousePos.y >= game.HUD.btn_menu.y && mousePos.y <= game.HUD.btn_menu.y + game.HUD.btn_menu.height){
			game.HUD.menu.show = true;
			canvas.removeEventListener('mousemove', game.map_mousemove_EventListener);
			canvas.removeEventListener('click', game.map_click_EventListener);
			canvas.removeEventListener('mouseout', game.map_mouseout_EventListener);
			game.map_cursor = false;
			canvas.addEventListener('mousemove', game.menu_mousemove_EventListener);
			canvas.addEventListener('click', game.menu_click_EventListener);
		}
		//Check si l'utilisateur est entrain de sélectionner une unité à attaquer
		else if(game.clickUnit != null && game.clickUnit.selectAttack != null){
			if(game.map.tiles[tileX][tileY].canAttack == true){
				game.map.tiles[game.clickUnit.newX][game.clickUnit.newY].unit.canPlay = false;
				game.attack(game.map.tiles[game.clickUnit.newX][game.clickUnit.newY],game.map.tiles[tileX][tileY]);
				game.map.removeCanMove();
				game.map.removeCanAttack();
				game.clickUnit = null;
			} else {
				game.HUD.action_menu.show = true;
				canvas.removeEventListener('mousemove', game.map_mousemove_EventListener);
				canvas.removeEventListener('click', game.map_click_EventListener);
				canvas.removeEventListener('mouseout', game.map_mouseout_EventListener);
				game.map_cursor = false;
				canvas.addEventListener('mousemove', game.action_menu_mousemove_EventListener);
				canvas.addEventListener('click', game.action_menu_click_EventListener);
				game.clickUnit.selectAttack = null;
			}
			game.map.removeCanAttack();
		}
		//Check si l'utilisateur a cliqué sur une unité, que c'est bien son tour de jouer et que l'unité et de son équipe
		else if(game.map.tiles[tileX][tileY].unit != null && game.clickUnit == null && game.turn.color == game.map.tiles[tileX][tileY].unit.team && game.map.tiles[tileX][tileY].unit.canPlay == true){
			game.clickUnit = {x: tileX, y: tileY, unit: game.map.tiles[tileX][tileY].unit};
			game.map.canUnitMove(game.clickUnit.x,game.clickUnit.y,game.map.tiles[game.clickUnit.x][game.clickUnit.y].unit.move,game.map.tiles[game.clickUnit.x][game.clickUnit.y].unit);
			console.log("clickUnit: " + game.clickUnit.x + "," + game.clickUnit.y);
		} 
		//Check si l'utilisateur a cliqué sur une cas où l'unité qu'il a choisi peut effectuer une action
		else if(game.clickUnit != null && game.map.tiles[tileX][tileY].canMove == true){
			game.clickUnit.newX = tileX;
			game.clickUnit.newY = tileY;

			game.HUD.action_menu.items = ["Move","Cancel"];

			var destTile = game.map.tiles[game.clickUnit.newX][game.clickUnit.newY];
			var unit = game.map.tiles[game.clickUnit.x][game.clickUnit.y].unit;
			//Test si l'unité déplacée peut attaquer
			if(game.canAttack(destTile,unit)){
				game.HUD.action_menu.items.splice(0, 0, "Attack");
			}
			//Test si l'utilisateur peut capturer le batiment
			if(game.canCapture(destTile,unit)){
				game.HUD.action_menu.items.splice(1, 0, "Capture");
			}

			//Calcul des coordonnées du menu en fonction de la case cliquée
			game.HUD.action_menu.x = (Math.floor((game.mouse.x - game.map.scrollingX)/game.map.tile_width)*game.map.tile_width)+game.map.scrollingX+game.map.tile_width;
			if(game.HUD.action_menu.x+game.HUD.action_menu.width > config.canvas_width){
				game.HUD.action_menu.x -= game.HUD.action_menu.width+game.map.tile_width;
			}
			game.HUD.action_menu.y = (Math.floor((game.mouse.y - game.map.scrollingY)/game.map.tile_height)*game.map.tile_height)+game.map.scrollingY;
			if(game.HUD.action_menu.y+game.HUD.action_menu.items.length*game.HUD.action_menu.item_height > config.canvas_height){
				game.HUD.action_menu.y = config.canvas_height-game.HUD.action_menu.items.length*game.HUD.action_menu.item_height;
			}

			game.map.moveUnit(game.clickUnit.x,game.clickUnit.y,tileX,tileY);
			game.HUD.action_menu.show = true;
			canvas.removeEventListener('mousemove', game.map_mousemove_EventListener);
			canvas.removeEventListener('click', game.map_click_EventListener);
			canvas.removeEventListener('mouseout', game.map_mouseout_EventListener);
			game.map_cursor = false;
			canvas.addEventListener('mousemove', game.action_menu_mousemove_EventListener);
			canvas.addEventListener('click', game.action_menu_click_EventListener);
		} 
		//L'utilisateur a cliqué su une case sans unité
		else {
			game.clickUnit = null;
			game.map.removeCanMove();
		}

		var message = 'Mouse click tile: ' + tileX + ',' + tileY;
		console.log(message);
	};

	//Stop le scrolling si le curseur sort du canvas
	this.map_mouseout_EventListener = function(evt) {
		clearInterval(scrollXInterval);
		clearInterval(scrollYInterval);
	};

	this.menu_mousemove_EventListener = function(evt){
		var mousePos = getMousePos(canvas, evt);
		game.mouse.x = mousePos.x;
		game.mouse.y = mousePos.y;
		if(game.mouse.x > game.HUD.menu.x && game.mouse.x < game.HUD.menu.x + game.HUD.menu.width && game.mouse.y > game.HUD.menu.y && game.mouse.y < game.HUD.menu.y + game.HUD.menu.items.length * game.HUD.menu.item_height){
			game.menu_cursor = true;
		} else {
			game.menu_cursor = false;
		}
	};

	this.menu_click_EventListener = function(evt){
		var mousePos = getMousePos(canvas, evt);
		if(game.mouse.x > game.HUD.menu.x && game.mouse.x < game.HUD.menu.x + game.HUD.menu.width && game.mouse.y > game.HUD.menu.y && game.mouse.y < game.HUD.menu.y + game.HUD.menu.items.length * game.HUD.menu.item_height){
			var indexItemClicked = Math.floor((game.mouse.y - game.HUD.menu.y) / game.HUD.menu.item_height);
			console.log("Click item " + indexItemClicked);
			if(game.HUD.menu.items[indexItemClicked] == "End turn"){
				if(game.teams.indexOf(game.turn) < game.teams.length-1){
					game.turn = game.teams[game.teams.indexOf(game.turn)+1];
				} else {
					game.turn = game.teams[0];
				}
				console.log("Turn of team : " + game.turn.color);
				game.earn_money(game.turn);
				game.map.removeCannotPlay();
				game.remove_menu_EventListener();
			}
		} else {
			game.remove_menu_EventListener();
		}
	};

	this.action_menu_click_EventListener = function(evt){
		var mousePos = getMousePos(canvas, evt);
		if(game.mouse.x > game.HUD.action_menu.x && game.mouse.x < game.HUD.action_menu.x + game.HUD.action_menu.width && game.mouse.y > game.HUD.action_menu.y && game.mouse.y < game.HUD.action_menu.y + game.HUD.action_menu.items.length * game.HUD.action_menu.item_height){
			var indexItemClicked = Math.floor((game.mouse.y - game.HUD.action_menu.y) / game.HUD.action_menu.item_height);
			console.log("Click action item " + indexItemClicked);
			if(game.HUD.action_menu.items[indexItemClicked] == "Move"){
				game.map.tiles[game.clickUnit.newX][game.clickUnit.newY].unit.canPlay = false;
				game.clickUnit = null;
				game.map.removeCanMove();
				game.remove_action_menu_EventListener();
			} else if(game.HUD.action_menu.items[indexItemClicked] == "Cancel"){
				game.map.unmoveUnit(game.clickUnit.x,game.clickUnit.y,game.clickUnit.newX,game.clickUnit.newY);
				game.remove_action_menu_EventListener();
			} else if(game.HUD.action_menu.items[indexItemClicked] == "Attack"){
				game.map.canUnitAttack(game.clickUnit.newX,game.clickUnit.newY);
				game.clickUnit.selectAttack = true;
				game.remove_action_menu_EventListener();
			}
		} else {
			game.map.unmoveUnit(game.clickUnit.x,game.clickUnit.y,game.clickUnit.newX,game.clickUnit.newY);
			game.remove_action_menu_EventListener();
		}
	};

	this.action_menu_mousemove_EventListener = function(evt){
		var mousePos = getMousePos(canvas, evt);
		game.mouse.x = mousePos.x;
		game.mouse.y = mousePos.y;
		if(game.mouse.x > game.HUD.action_menu.x && game.mouse.x < game.HUD.action_menu.x + game.HUD.action_menu.width && game.mouse.y > game.HUD.action_menu.y && game.mouse.y < game.HUD.action_menu.y + game.HUD.action_menu.items.length * game.HUD.action_menu.item_height){
			game.action_menu_cursor = true;
		} else {
			game.action_menu_cursor = false;
		}
	};

	this.remove_menu_EventListener = function(){
		game.HUD.menu.show = false;
		game.menu_cursor = false;
		canvas.removeEventListener('mousemove', game.menu_mousemove_EventListener);
		canvas.removeEventListener('click', game.menu_click_EventListener);
		game.map_cursor = true;
		canvas.addEventListener('mousemove', game.map_mousemove_EventListener);
		canvas.addEventListener('click', game.map_click_EventListener);
		canvas.addEventListener('mouseout', game.map_mouseout_EventListener);
	};

	this.remove_action_menu_EventListener = function(){
		game.HUD.action_menu.show = false;
		game.action_menu_cursor = false;
		canvas.removeEventListener('mousemove', game.action_menu_mousemove_EventListener);
		canvas.removeEventListener('click', game.action_menu_click_EventListener);
		game.map_cursor = true;
		canvas.addEventListener('mousemove', game.map_mousemove_EventListener);
		canvas.addEventListener('click', game.map_click_EventListener);
		canvas.addEventListener('mouseout', game.map_mouseout_EventListener);
	};

	this.config_mouse = function(){
		canvas.addEventListener('mousemove', this.map_mousemove_EventListener);
		canvas.addEventListener('click', this.map_click_EventListener);
		canvas.addEventListener('mouseout', this.map_mouseout_EventListener);
	};
}