function HUD(){
	this.image_path = "../../img/";
	//Mise en place du bouton menu
	this.btn_menu = {};
	this.btn_menu.img = new Image();
	this.btn_menu.img.src = this.image_path + "menu.png";
	this.btn_menu.width = 50;
	this.btn_menu.height = 20;
	this.btn_menu.x = (config.canvas_width/2)-(this.btn_menu.width/2);
	this.btn_menu.y = 10;
	//Mise en place du menu
	this.menu = {};
	this.menu.show = false;
	this.menu.width = 100;
	this.menu.item_height = 30;
	this.menu.x = (config.canvas_width/2) - (this.menu.width/2);
	this.menu.y = 100;
	this.menu.items = ["Option","End turn"];
	//Mise en place des infos des unités
	this.unit_data = {};
	this.unit_data.width = 200;
	this.unit_data.height = 150;
	this.unit_data.x = 0;
	this.unit_data.y = config.canvas_height - this.unit_data.height;
	this.unit_data.img_width = 30;
	this.unit_data.img_height = 30;
	//Mise en place de la boite d'action
	this.action_menu = {};
	this.action_menu.show = false;
	this.action_menu.width = 100;
	this.action_menu.item_height = 30;
	this.action_menu.x = 0;
	this.action_menu.y = 0;
	this.action_menu.items = ["Move","Cancel"];
	//Mise en place des infos des dégats
	this.damage_data = {};
	this.damage_data.show = false;
	this.damage_data.x = 0;
	this.damage_data.y = 0;
	this.damage_data.width = 150;
	this.damage_data.height = 30;
	//Portrait des joueurs et informations
	this.team_data = {};
	this.team_data.show = true;
	this.team_data.x = 0;
	this.team_data.y = 0;
	this.team_data.width = 200;
	this.team_data.height = 0;

	this.draw_menu = function(){
		if(this.menu.show){
			//Dessin du fond du menu
			context.fillStyle = "rgb(255,255,255)";
			context.fillRect(this.menu.x, this.menu.y, this.menu.width, this.menu.item_height*this.menu.items.length);
			//Dessin des items
			context.fillStyle = "rgb(0,0,0)";
			context.font = "20px Arial";
			for(var i = 0 ; i < this.menu.items.length ; i++){
				context.fillText(this.menu.items[i],this.menu.x+5,this.menu.y + i * this.menu.item_height + 25);
			}
		} else {
			//Dessin du bouton menu
			context.drawImage(this.btn_menu.img,this.btn_menu.x,this.btn_menu.y,this.btn_menu.width,this.btn_menu.height);
		}
	};

	this.draw_unit_data = function(unit){
		if(game.overUnit != null){
			//Dessin du fond des infos
			context.fillStyle = "rgb(255,255,255)";
			context.fillRect(this.unit_data.x,this.unit_data.y,this.unit_data.width,this.unit_data.height);
			//Dessin des données
			context.fillStyle = "rgb(0,0,0)";
			context.font = "15px Arial";
			context.drawImage(unit.img, this.unit_data.x+5,this.unit_data.y+5,this.unit_data.img_width,this.unit_data.img_height);
			var unit_hp = "HP : " + unit.hp;
			context.fillText(unit_hp, this.unit_data.x+this.unit_data.img_width+10,this.unit_data.y+30);
			var unit_move = "Move : " + unit.move;
			context.fillText(unit_move, this.unit_data.x+this.unit_data.img_width+10,this.unit_data.y+60);
		}
	};

	this.draw_action_menu = function(){
		if(this.action_menu.show){
			//Dessin du fond du menu
			context.fillStyle = "rgb(255,255,255)";
			context.fillRect(this.action_menu.x, this.action_menu.y, this.action_menu.width, this.action_menu.item_height*this.action_menu.items.length);
			//Dessin des items
			context.fillStyle = "rgb(0,0,0)";
			context.font = "20px Arial";
			for(var i = 0 ; i < this.action_menu.items.length ; i++){
				context.fillText(this.action_menu.items[i],this.action_menu.x+5,this.action_menu.y + i * this.action_menu.item_height + 25);
			}
		}
	};

	this.draw_damage_data = function(tileUnit,tileAttackedUnit){
		if(this.damage_data.show){
			//Dessin du fond
			context.fillStyle = "rgb(255,255,255)";
			context.fillRect(this.damage_data.x, this.damage_data.y, this.damage_data.width, this.damage_data.height);
			//Calcule des infos
			var damage = Math.floor(tileUnit.unit.damage * (tileUnit.unit.hp/100) * (1-(tileAttackedUnit.defense/6)) * (1+((100-tileAttackedUnit.unit.hp)/100)));
			var message = "Damage : " + damage;
			//Dessin des infos 
			context.fillStyle = "rgb(0,0,0)";
			context.font = "20px Arial";
			context.fillText(message,this.damage_data.x+5,this.damage_data.y + this.damage_data.height - 5);
		}
	};

	this.draw_team_data = function(){
		if(this.team_data.show){
			this.team_data.height = 30*game.teams.length;
			//Dessin du fond
			context.fillStyle = "rgb(255,255,255)";
			context.fillRect(this.team_data.x, this.team_data.y, this.team_data.width, this.team_data.height);
			//Dessin des infos de chaque team
			for(var i = 0 ; i < game.teams.length ; i++){
				context.drawImage(game.teams[i].user.img, this.team_data.x, this.team_data.y+(i*30), 30, 30);
				var message = game.teams[i].user.login + " / " + game.teams[i].money + "$";
				context.fillStyle = "rgb(0,0,0)";
				context.font = "20px Arial";
				context.fillText(message,this.team_data.x+35,30*i+18);
			}
		}
	};
}