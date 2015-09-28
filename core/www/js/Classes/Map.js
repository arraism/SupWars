function Map() {

	this.scrollingX = 0;
	this.scrollingY = 0;
	this.tiles = new Array();
	this.tile_width = 30;
	this.tile_height = 30;
	this.img = new Image();
	this.img.src = "../../img/field.png";

	this.drawMap = function() {
		//Dessine un fond noir
		context.fillStyle = "rgb(0,0,0)";
		context.fillRect(0, 0, config.canvas_width, config.canvas_height);
		//Dessine les tiles
		for(var i = 0 ; i < this.tiles.length ; i++){
			for(var j = 0 ; j < this.tiles[i].length ; j++){
				//Dessine les batiments
				if(this.tiles[i][j].isBuilding() == true){
					context.drawImage(this.img, (i*this.tile_width)+this.scrollingX, (j*this.tile_height)+this.scrollingY, this.tile_width, this.tile_height);
				}
				context.drawImage(this.tiles[i][j].img, (i*this.tile_width)+this.scrollingX, (j*this.tile_height)+this.scrollingY, this.tile_width, this.tile_height);
				//Dessine les unités
				if(this.tiles[i][j].unit != null){
					context.drawImage(this.tiles[i][j].unit.img, (i*this.tile_width)+this.scrollingX, (j*this.tile_height)+this.scrollingY, this.tile_width, this.tile_height);
				}
				//Dessin d'un calque noir pour montrer que l'unité a déjà joué
				if(this.tiles[i][j].unit != null && game.turn.color == this.tiles[i][j].unit.team && this.tiles[i][j].unit.canPlay == false){
					context.fillStyle = 'rgba(0,0,0,0.5)';
					context.fillRect((i*this.tile_width)+this.scrollingX,(j*this.tile_height)+this.scrollingY,this.tile_width,this.tile_height);
				}
				//Dessin d'un calque jaune pour les cases où l'unité peut se déplacer
				if(this.tiles[i][j].canMove == true){
					context.fillStyle = 'rgba(255,255,0,0.5)';
					context.fillRect((i*this.tile_width)+this.scrollingX,(j*this.tile_height)+this.scrollingY,this.tile_width,this.tile_height);
				}
				//Dessin d'un calque bleu pour les cases où l'unité peut attaquer
				if(this.tiles[i][j].canAttack == true){
					context.fillStyle = 'rgba(0,0,255,0.5)';
					context.fillRect((i*this.tile_width)+this.scrollingX,(j*this.tile_height)+this.scrollingY,this.tile_width,this.tile_height);
				}
			}
		}
	};

	this.createQuickMap = function(){
		for(var i = 0 ; i < 100 ; i++){
			this.tiles[i] = new Array();
			for(var j = 0 ; j < 70 ; j++){
				if(j%5 == 0){
					this.tiles[i][j] = new Tile("forest",i,j,null);
				} else if(j%6 == 0){
					this.tiles[i][j] = new Tile("mountain",i,j,null);
				} else {
					this.tiles[i][j] = new Tile("field",i,j,null);
				}
			}
		}
		var soldat = new Unit("soldat","red");
		var tankm = new Unit("tankm","red");
		var city = new Tile("city",5,10,"red");
		var factory = new Tile("factory",6,10,null);

		this.tiles[8][10].unit = soldat;
		this.tiles[8][8].unit = tankm;
		this.tiles[11][10] = new Tile("wall",11,10,null);
		this.tiles[12][10] = new Tile("wall",12,10,null);
		soldat = new Unit("soldat","red");
		this.tiles[12][12].unit = soldat;
		soldat = new Unit("soldat","red");
		this.tiles[30][17].unit = soldat;
		soldat = new Unit("soldat","blue");
		this.tiles[11][11].unit = soldat;
		soldat = new Unit("soldat","blue");
		this.tiles[8][7].unit = soldat;
		soldat = new Unit("soldat","blue");
		this.tiles[5][5].unit = soldat;

		this.tiles[5][10] = new Tile("city",5,10,"red");
		this.tiles[6][10] = new Tile("factory",6,10,null);
	};

	this.canUnitMove = function(tileX,tileY,move,unit){
		var tile = this.tiles[tileX][tileY];
		tile.canMove = true;
		this.canUnitMoveRec(tileX+1,tileY,move,unit);
		this.canUnitMoveRec(tileX-1,tileY,move,unit);
		this.canUnitMoveRec(tileX,tileY+1,move,unit);
		this.canUnitMoveRec(tileX,tileY-1,move,unit);
	};

	this.canUnitMoveRec = function(tileX,tileY,move,unit){
		var tile = this.tiles[tileX][tileY];
		if(unit.getMove(tile.type) != null){
			move -= unit.getMove(this.tiles[tileX][tileY].type);
			if(move >= 0){
				var tile = this.tiles[tileX][tileY];
				if(tile.unit == null && tile.type != "wall"){
					tile.canMove = true;	
				}
				if((tile.unit == null || (tile.unit != null && tile.unit.team == unit.team)) && tile.type != "wall"){
					this.canUnitMoveRec(tileX+1,tileY,move,unit);
					this.canUnitMoveRec(tileX-1,tileY,move,unit);
					this.canUnitMoveRec(tileX,tileY+1,move,unit);
					this.canUnitMoveRec(tileX,tileY-1,move,unit);
				}
			}
		}
		return null;
	};

	this.canUnitAttack = function(tileX,tileY){
		if((game.map.tiles[tileX+1][tileY].unit != null && game.map.tiles[tileX+1][tileY].unit.team != game.map.tiles[tileX][tileY].unit.team)){
			game.map.tiles[tileX+1][tileY].canAttack = true;
		}
		if((game.map.tiles[tileX-1][tileY].unit != null && game.map.tiles[tileX-1][tileY].unit.team != game.map.tiles[tileX][tileY].unit.team)){
			game.map.tiles[tileX-1][tileY].canAttack = true;
		}
		if((game.map.tiles[tileX][tileY+1].unit != null && game.map.tiles[tileX][tileY+1].unit.team != game.map.tiles[tileX][tileY].unit.team)){
			game.map.tiles[tileX][tileY+1].canAttack = true;
		}
		if((game.map.tiles[tileX][tileY-1].unit != null && game.map.tiles[tileX][tileY-1].unit.team != game.map.tiles[tileX][tileY].unit.team)){
			game.map.tiles[tileX][tileY-1].canAttack = true;
		}
	}

	this.moveUnit = function(x,y,tileX,tileY){
		var unit = this.tiles[x][y].unit;
		this.tiles[x][y].unit = null;
		this.tiles[tileX][tileY].unit = unit;
	};

	this.unmoveUnit = function(x,y,tileX,tileY){
		var unit = this.tiles[tileX][tileY].unit;
		this.tiles[tileX][tileY].unit = null;
		this.tiles[x][y].unit = unit;
	};

	this.removeCanMove = function(){
		for(var i = 0 ; i < this.tiles.length ; i++){
			for(var j = 0 ; j < this.tiles[0].length ; j++){
				this.tiles[i][j].canMove = false;
			}
		}
	};

	this.removeCanAttack = function(){
		for(var i = 0 ; i < this.tiles.length ; i++){
			for(var j = 0 ; j < this.tiles[0].length ; j++){
				this.tiles[i][j].canAttack = false;
			}
		}
	};

	this.removeCannotPlay = function(){
		for(var i = 0 ; i < this.tiles.length ; i++){
			for(var j = 0 ; j < this.tiles[0].length ; j++){
				if(this.tiles[i][j].unit != null){
					this.tiles[i][j].unit.canPlay = true;
				}
			}
		}
	};
}