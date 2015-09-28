function Unit(type,team){
	this.hp = 100;
	this.img = new Image();
	this.img_path = "../../img/";
	this.team = team;
	this.canPlay = true;
	this.type = type;

	switch(type){
		case "soldat":
			this.move = 3;
			this.img.src = this.img_path + "soldat_" + team + ".png";
			this.move_field = 1;
			this.move_forest = 1;
			this.move_mountain = 2;
			this.move_building = 1;
			this.damage = 40;
			break;
		case "tankm":
			this.move = 5;
			this.img.src = this.img_path + "tankm_" + team + ".png";
			this.move_field = 1;
			this.move_forest = 2;
			this.move_mountain = null;
			this.move_building = 1;
			this.damage = 60;
		default:
			break;
	}

	this.getMove = function(type){
		switch(type){
			case "field":
				return this.move_field;
				break;
			case "forest":
				return this.move_forest;
				break;
			case "mountain":
				return this.move_mountain;
				break;
			case "factory":
			case "city":
				return this.move_building;
				break;
			default:
				break;
		}
	}
}