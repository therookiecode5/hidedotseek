/**************************************************
** GAME VARIABLES
**************************************************/
var canvas,			// Canvas DOM element
	ctx,			// Canvas rendering context
	keys,			// Keyboard input
	localPlayer,	// Local player
	remotePlayers,	// Remote players
	socket,			// Socket connection
	pillar,
	map; 			// The Global Map

/**************************************************
** GAME INITIALISATION
**************************************************/
function init() {
	refreshed=false;
	// Declare the canvas and rendering context
	canvas = document.getElementById("gameCanvas");
	ctx = canvas.getContext("2d");

	// Maximise the canvas
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	// Initialise keyboard controls
	keys = new Keys();

	// Calculate a random start position for the local player
	// The minus 5 (half a player size) stops the player being
	// placed right on the egde of the screen
	var startX = Math.round(Math.random()*1900+10),
		startY = Math.round(Math.random()*1900+10);

	// Initialise the local player
	localPlayer = new Player(startX, startY);

	// Initialise socket connection
	socket = io();
	// Initialise remote players array
	remotePlayers = [];
	obstacles = [];

	// Start listening for events
	setEventHandlers();
	var touchX=0,touchY=0,touchD=0;

};


/**************************************************
** GAME EVENT HANDLERS
**************************************************/
var setEventHandlers = function() {
	// Keyboardnew username
	window.addEventListener("keydown", onKeydown, false);
	window.addEventListener("keyup", onKeyup, false);
	window.addEventListener('touchstart', onTouchStart,false);
	window.addEventListener('touchmove', onTouchMove,false);
	window.addEventListener('touchstop', onTouchLeave,false);
	if(localStorage.getItem("dotname")){
		localPlayer.setName(localStorage.getItem("dotname"));
   	socket.emit("my name",{name:localStorage.getItem("dotname")});
	$("#name").html("");
	}else{
	$("#send_name").click(function(e){
	localPlayer.setName($("#name_text").val());
   	socket.emit("my name",{name:$("#name_text").val()});
   	localStorage.setItem("dotname",$("#name_text").val())
	$("#name").html("");
	});}

	// Window resize
	window.addEventListener("resize", onResize, false);
	window.addEventListener("mouseup",onTouchLeave,false);

	socket.on("winner name",onWinnerName);
	socket.on("loser name",onLoserName);
	socket.on("new username",onNewUserName);
	// Socket connection successful
	socket.on("connect", onSocketConnected);

	// Socket disconnection
	socket.on("disconnect", onSocketDisconnect);

	// New player message received
	socket.on("new player", onNewPlayer);
	socket.on("new obstacle", onNewObstacle);

	// Player move message received
	socket.on("move player", onMovePlayer);

	socket.on("move yourself", onMoveLocalPlayer);
	// Player removed message received
	socket.on("remove player", onRemovePlayer);
	socket.on("zombie", onZombie);
	socket.on ("temp safe", onTempSafe);
	socket.on("safe",onSafe);
	socket.on ("not safe", onNotSafe);
	socket.on("new pillar",onNewPillar);
	socket.on("refresh",onRefresh);
};
function onTouchStart(e) {
	if (localPlayer) {
		var touchobj = e.changedTouches[0]
  		touchX= touchobj.pageX;
  		touchY= touchobj.pageY;
	};
};function onTouchMove(e) {
	if (localPlayer) {
		 var touchobj = e.changedTouches[0] // reference first touch point for this event
		 keys.ClearKeys();

  				var c={};
  			if(parseInt(touchobj.pageX)-touchX>20){

  				c.keyCode=39;
  				keys.onKeyDown(c);
  				
  			}
  			if(parseInt(touchobj.pageX)-touchX<-20)
  			
  			{
  				c.keyCode=37;
  				keys.onKeyDown(c);
  			}
  			if(parseInt(touchobj.pageY)-touchY<20)
  			
  			{
  				c.keyCode=38;
  				keys.onKeyDown(c);
  			}
  			if(parseInt(touchobj.pageY)-touchY>-20)
  			
  			{
  				c.keyCode=40;
  				keys.onKeyDown(c);
  			}
  		}
	
};

function onTouchLeave(e) {
	if (localPlayer) {
		keys.ClearKeys();
  		
	}
	
};
// Keyboard key down
function onKeydown(e) {
	if (localPlayer) {
		keys.onKeyDown(e);
	}
};

// Keyboard key up
function onKeyup(e) {
	if (localPlayer) {
		keys.onKeyUp(e);
	};
};

// Browser window resize
function onResize(e) {
	// Maximise the canvas
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
};

// Socket connectedouchobj = e.changedTouches[0] // reference first touch point for this event
 
function onSocketConnected() {
	console.log("Connected to socket server");

	// Send local player data to the game server
	socket.emit("new player", {x: localPlayer.getX(), y: localPlayer.getY()});
};

// Socket disconnected
function onSocketDisconnect() {
	console.log("Disconnected from socket server");
};

// New player
function onNewPlayer(data) {
	console.log("New player connected: "+data.id);

	// Initialise the new player
	var newPlayer = new Player(data.x, data.y);
	newPlayer.id = data.id;
	newPlayer.name=data.name;
	// Add new player to the remote players array
	remotePlayers.push(newPlayer);
	playerById(data.id).setName(data.name);
};
function onNewObstacle(data){
	console.log("New obstacle get: ");

	// Initialise the new player
	var wall = new Obstacle(data.x, data.y,data.w,data.h);

	// Add new player to the remote players array
	obstacles.push(wall);
}
// Move player
function onMovePlayer(data) {
	var movePlayer = playerById(data.id);

	// Player not found
	if (!movePlayer) {
		console.log("Player not found: "+data.id);
		return;
	};

	// Update player position
	movePlayer.setX(data.x);
	movePlayer.setY(data.y);
};


function onMoveLocalPlayer(data) {
	var movePlayer = localPlayer;

	// Player not found
	

	// Update player position
	movePlayer.setX(data.x);
	movePlayer.setY(data.y);
};

// Remove player
function onRemovePlayer(data) {
	var removePlayer = playerById(data.id);

	// Player not found
	if (!removePlayer) {
		console.log("Player not found: "+data.id);
		return;
	};

	// Remove player from array
	remotePlayers.splice(remotePlayers.indexOf(removePlayer), 1);
};

function onTempSafe(data){
	var x = playerById(data.id)
	if(x){
		x.tempSafe=true;
	}else{
		localPlayer.tempSafe=true;
	}
}


function onSafe(data){
	var x = playerById(data.id)
	if(x){
		x.safe=true;
	}else{
		localPlayer.safe=true;
	}
}

function onNotSafe(data){
	var x = playerById(data.id)
	if(x){
		x.tempSafe=false;
		x.safe=false;
	}else{
		localPlayer.tempSafe=false;
		localPlayer.safe=false;
	}
}

function onZombie(data){
	var x = playerById(data.id)
	if(x){
		x.zombie=true;
	}else{
		localPlayer.setZombie(true);
	}
}
function onNewPillar(data){
	console.log("pillar")
	pillar= new Pillar(data.x,data.y,40,40);

}
function onRefresh(){
	if (!refreshed){
		refreshed=true;
		location.reload();}
}

function onNewUserName(data){
	console.log("GET USERNAME"+data.id+" "+data.name);
	var findPlayer=playerById(data.id);
	if (findPlayer)
		{	
			findPlayer.setName(data.name);}
}

function onWinnerName(data){
	$("#result").append("SURVIVED: "+data.name+"&nbsp;"+data.score+"<br>");
}

function onLoserName(data){

	$("#result").append("INFECTED: "+data.name+"&nbsp;"+data.score+"<br>");
	
}
/**************************************************
** GAME ANIMATION LOOP
**************************************************/
function animate() {
	update();
	draw();

	// Request a new animation frame using Paul Irish's shim
	window.requestAnimFrame(animate);
};


/**************************************************
** GAME UPDATE
**************************************************/
function update() {
	// Update local player and check for change
	if (localPlayer.update(keys)) {
		// Send local player data to the game server
		socket.emit("move player", {x: localPlayer.getX(), y: localPlayer.getY()});
	};
};

  

/**************************************************
** GAME DRAW
**************************************************/
function draw() {
	// Wipe the canvas clean
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	if(pillar){
		pillar.draw(ctx,localPlayer.getX()-canvas.width/2,localPlayer.getY()-canvas.height/2);
	}
	if(localPlayer.isZombie()){
		ctx.fillStyle="#FF0000";
	}else if(localPlayer.tempSafe || localPlayer.safe){
		ctx.fillStyle="#00FF00";
	}else{
		ctx.fillStyle="#000000";
	}
	
	// Draw the local player
	ctx.fillRect(canvas.width/2,canvas.height/2, 10, 10);
	ctx.fillText(name, canvas.width/2,canvas.height/2);
	ctx.fillText(localPlayer.getX() + "," + localPlayer.getY(), canvas.width/2-10,canvas.height/2-10); 

	
	// Draw the remote players
	var i;
	for (i = 0; i < remotePlayers.length; i++) {
		if(remotePlayers[i].zombie){
			ctx.fillStyle="#FF0000";
		}else if(remotePlayers[i].tempSafe || remotePlayers[i].safe){
			ctx.fillStyle="#00FF00";
		}else{
			ctx.fillStyle="#000000";
		}
		remotePlayers[i].draw(ctx,localPlayer.getX()-canvas.width/2,localPlayer.getY()-canvas.height/2);
	};

	var i;
	for (i = 0; i < obstacles.length; i++) {
		
			ctx.fillStyle="#000000";
		
		obstacles[i].draw(ctx,localPlayer.getX()-canvas.width/2,localPlayer.getY()-canvas.height/2);
	};

	// Draw the final point
    
      
      
};


/**************************************************
** GAME HELPER FUNCTIONS
**************************************************/
// Find player by ID
function playerById(id) {
	var i;
	for (i = 0; i < remotePlayers.length; i++) {
		if (remotePlayers[i].id == id)
			return remotePlayers[i];
	};
	
	return false;
};
