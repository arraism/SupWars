function User(userData){
	this.id = userData.id;
	this.login = userData.login;
	this.img = new Image();
	this.img.src = "../../img/" + userData.img;
}