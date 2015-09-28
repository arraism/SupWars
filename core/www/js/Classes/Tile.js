function Tile(type,x,y,team){
	this.type = type;
	this.x = x;
	this.y = y;
	this.unit = null;
	this.canMove = false;
	this.canAttack = false;
	this.img = new Image();
	this.image_path = "../../img/";
	this.team = team;
	this.hp = null;

	switch(type){
		case "field":
			this.img.src = this.image_path + "field.png";
			this.defense = 1;
			break;
		case "forest":
		 	this.img.src = this.image_path + "forest.png";
		 	this.defense = 2;
			break;
		case "mountain":
			this.img.src = this.image_path + "mountain.png";
			this.defense = 4;
			break;
		case "wall":
			this.img.src = this.image_path + "wall.png";
			break;
		case "factory":
			if(this.team != null){
				this.img.src = this.image_path + "factory_" + this.team + ".png";
			} else {
				this.img.src = this.image_path + "factory_neutre.png";
			}
			this.defense = 3;
			this.hp = 100;
			break;
		case "city":
			if(this.team != null){
				this.img.src = this.image_path + "city_" + this.team + ".png";
			} else {
				this.img.src = this.image_path + "city_neutre.png";
			}
			this.defense = 3;
			this.hp = 100;
			break;
		default:
			break;
	}

	this.isBuilding = function(){
		return (this.type == "factory" || this.type == "city");
	}
}