/**************************************************
** NODE.JS REQUIREMENTS
**************************************************/
var util = require("util");
var Player = require("./Player").Player;
var Pillar = require("./Pillar").Pillar;
var Obstacle = require("./Obstacle").Obstacle;
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const httpServer = require("http").createServer();
const io = require("socket.io")(httpServer, {
});
var compression = require('compression');

/**************************************************
** GAME VARIABLES
**************************************************/
var obstacles,		// Socket controller
	players;	// Array of connected players

var zombie = 0;
var pillar;
var gameOver=false;
/**************************************************
** GAME INITIALISATION
**************************************************/
function init() {
	// Create an empty array to store players
	players = [];
	obstacles = [];
var port=80;
http.listen(port, function(){
  console.log('listening on *: '+port);
});
	

app.use(compression({
  threshold: 512
}))
app.use(express.static(__dirname + '/public'));
app.get('/', function(req, res){
  res.sendfile('./public/index.html');
});
initgame();

};




/**************************************************
** GAME EVENT HANDLERS
**************************************************/
io.on("connection", (socket) => {
  util.log("New player has connected: "+socket.id);

	// Listen for client disconnected
	socket.on("disconnect", onClientDisconnect);

	// Listen for new player message
	socket.on("new player", onNewPlayer);

	// Listen for move player message
	socket.on("move player", onMovePlayer);
	socket.on("my name", onSetName);
});

function initgame(){
	gameOver=false;
	zombie=0;
	var x=Math.round(Math.random()*2000),
	y=Math.round(Math.random()*2000);
	pillar= new Pillar(x,y,40,40);
	if (obstacles.length>=200){
		obstacles.length=0;
	}
	for (var i=0;i<20;i++){
		var x=Math.round(Math.random()*2000),
		y=Math.round(Math.random()*2000),
		h=Math.round(Math.random()*100+1),
		w=Math.round(Math.random()*100+1);
		wall = new Obstacle(x,y,w,h);
		obstacles.push(wall);
	}

}
// Socket client has disconninitgameected
function onClientDisconnect(initgame) {
	util.log("Player has disconnected: "+this.id);
	if (zombie==this.id){
		zombie=0;
	}
	var removePlayer = playerById(this.id);

	// Player not found20
	if (!removePlayer) {
		util.log("Player not found: "+this.id);
		return;
	};

	// Remove player from players array
	players.splice(players.indexOf(removePlayer), 1);

	// Broadcast removed player to connected socket clients
	this.broadcast.emit("remove player", {id: this.id});
};

// New player has joined
function onNewPlayer(data) {
	// Create a new player
	//this.disconnect();
	var collision=false;
	do{
		collision = false;
		for(var i=0;i<obstacles.length;i++){
			if (data.x+10>obstacles[i].getX() && data.x<obstacles[i].getX()+obstacles[i].getWidth() &&
				data.y+10>obstacles[i].getY() && data.y<obstacles[i].getY()+obstacles[i].getHeight()) 
				{collision=true; break;}
		}
		if(collision){
				data.x = Math.round(Math.random()*1900+10),
				data.y = Math.round(Math.random()*1900+10);
		}
	}while(collision);
	
	var newPlayer = new Player(data.x, data.y);
	newPlayer.id = this.id;
	newPlayer.idle = new Date().getTime();
	this.emit("move yourself",{x:data.x,y:data.y});
	// Broadcast new player to connected socket clients
	this.broadcast.emit("new player", {id: newPlayer.id, x: newPlayer.getX(), y: newPlayer.getY()});

	// Send existing players to the new player
	var i, existingPlayer;
	for (i = 0; i < players.length; i++) {
		existingPlayer = players[i];
		this.emit("new player", {id: existingPlayer.id, x: existingPlayer.getX(), y: existingPlayer.getY(),name:existingPlayer.getName()});
		if (existingPlayer.isZombie()) {
			this.emit("zombie", {id:existingPlayer.id});
		}
	};
	var wall;
	for (i = 0; i < obstacles.length; i++) {
		wall = obstacles[i];
		
		this.emit("new obstacle",{x:wall.getX(),y:wall.getY(),w:wall.getWidth(),h:wall.getHeight()});
		
	};
		
	// Add new player to the players array
	players.push(newPlayer);
	if (players.length>2 && zombie==0){
		var zombieplayer=players[Math.round(Math.random()*(players.length-1))];
		zombie=zombieplayer.id;
		zombieplayer.setZombie(true);
	}
	if (zombie!=0){
		console.log("current zombie:"+zombie);
		io.emit("zombie",{id:zombie});
	}

	this.emit("new pillar",{x:pillar.getX(),y:pillar.getY(),w:pillar.getWidth(),h:pillar.getHeight()});
};

// Player has moved
function onMovePlayer(data) {
	// Find player in array
	var movePlayer = playerById(this.id);
	if (movePlayer.isTempSafe()){		
	movePlayer.timeout=new Date().getTime();
	movePlayer.setTempSafe(false);
	io.emit("not safe",{id:movePlayer.id});
	if (movePlayer.partner){
		movePlayer.partner.setTempSafe(false);
		movePlayer.partner.timeout=new Date().getTime();
		io.emit("not safe",{id:movePlayer.partner.id});
	}}
	if (movePlayer.isSafe()){
		movePlayer.setSafe(false);
		io.emit("not safe",{id:movePlayer.id});
	}
	// Player not found
	if (!movePlayer) {
		util.log("Player not found: "+this.id);
		return;
	};
	collision = false;
	// Update player position
	if (data.x>2000 || data.x<0 || data.y>2000 || data.y<0){
			collision=true;
	}
	for(var i=0;i<players.length;i++){
		if(this.id==players[i].id)
			continue;
		
		if (data.x+10>players[i].getX() && data.x<players[i].getX()+10 &&
			data.y+10>players[i].getY() && data.y<players[i].getY()+10) {
			collision=true;
		if (movePlayer.isZombie() && !players[i].isZombie() && !players[i].isTempSafe() && !players[i].isSafe()){
			players[i].setZombie(true);
			players[i].setScore(players[i].getScore() - 100);
			movePlayer.setScore(movePlayer.getScore() + 100);
			io.emit("zombie",{id:players[i].id});
		} else
		if (players[i].isZombie() && !movePlayer.isZombie() && !movePlayer.isTempSafe() && !movePlayer.isSafe()){
			movePlayer.setZombie(true);
			movePlayer.setScore(movePlayer.getScore() - 100);
			players[i].setScore(players[i].getScore() + 100);
			io.emit("zombie",{id:movePlayer.id});
		}else if(!movePlayer.isZombie()){
			lastx=movePlayer.getX();
			lasty=movePlayer.getY();
			other=players[i];
			setTimeout(function(){
				var delta=5001;
				if(movePlayer.timeout){
					delta= new Date().getTime()-movePlayer.timeout;
				}
				if (lastx==movePlayer.getX() && lasty==movePlayer.getY() && delta>5000){
					movePlayer.setTempSafe(true);
					other.setTempSafe(true);
					movePlayer.partner=other;
					other.partner=movePlayer;
					io.emit("temp safe",{id:movePlayer.id});
					io.emit("temp safe",{id:other.id});
					//console.log("wow");
				}
			}, 500);

		}
	}
}
	if (data.x+10>pillar.getX() && data.x<pillar.getX()+pillar.getWidth() &&
			data.y+10>pillar.getY() && data.y<pillar.getY()+pillar.getHeight()) {
			collision=true;
		movePlayer.setSafe(true);
		io.emit("safe",{id:movePlayer.id});}
					
	
	
	for(var i=0;i<obstacles.length;i++){
		
		if (data.x+10>obstacles[i].getX() && data.x<obstacles[i].getX()+obstacles[i].getWidth() &&
			data.y+10>obstacles[i].getY() && data.y<obstacles[i].getY()+obstacles[i].getHeight()) {
			collision=true;
		break;}
	}
	
	if(collision){
		this.emit("move yourself",{x:movePlayer.getX(),y:movePlayer.getY()});
	}else {
		movePlayer.setX(data.x);
		movePlayer.setY(data.y);
		this.broadcast.emit("move player", {id: movePlayer.id, x: movePlayer.getX(), y: movePlayer.getY()});
	}
	checkWinner();
	
	// End Game Condition
	

	// Broadcast updated position to connected socket clients
};

function checkWinner(){
	if (gameOver) {
		return;
	}

	var winners = [], losers = [];
	for(var i = 0; i < players.length; i++){
		if(players[i].isSafe()){
			winners.push(players[i]);
		}else if(players[i].isZombie()){
			losers.push(players[i]);
		}
	}
	
	if((winners.length + losers.length) >= players.length){
		gameOver=true;
		console.log("Winners : " + winners.length);

		for(var i = 0; i < winners.length; i++){
			winners[i].setScore(winners[i].getScore() + (100 * winners.length));
			io.emit("winner name",{name:winners[i].getName(),score:winners[i].getScore()});
			
		}

		console.log("Losers : " + losers.length);
		for(var i = 0; i < losers.length; i++){
			console.log(losers[i].getName() + " : " + losers[i].id + " : " + losers[i].getScore());
			io.emit("loser name",{name:losers[i].getName(),score:losers[i].getScore()});
		}
		setTimeout(function(){
			initgame();
			io.emit("refresh");},5000);
	}
}

function onSetName(data){
	var movePlayer = playerById(this.id);
	movePlayer.setName(data.name);
	this.broadcast.emit("new username",{id:this.id,name:data.name});

}


/**************************************************
** GAME HELPER FUNCTIONS
**************************************************/
// Find player by ID
function playerById(id) {
	var i;
	for (i = 0; i < players.length; i++) {
		if (players[i].id == id)
			return players[i];
	};
	
	return false;
};

httpServer.listen(3000);
/**************************************************
** RUN THE GAME
**************************************************/
init();
