function Building(type,team){
	this.type = type;
	this.team = team;
	this.img = new Image();
	this.img_path = "../../img/";

	switch(type){
		case "city":
			if(this.team != null){
				this.img.src = this.img_path + "city_" + this.team + ".png";
			} else {
				this.img.src = this.img_path + "city_neutre.png";
			}
			break;
		case "factory":
			if(this.team != null){
				this.img.src = this.img_path + "factory_" + this.team + ".png";
			} else {
				this.img.src = this.img_path + "factory_neutre.png";
			}
		default:
			break;
	}
}