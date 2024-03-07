/**************************************************
** GAME PLAYER CLASS
**************************************************/
var Player = function(startX, startY) {
	var x = startX,
		y = startY,
		id,
		moveAmount = 2,
		zombie=false,
		name,
		safe = false,
		tempSafe = false,
		score = 0;
		
	// Getters and setters
	var getX = function() {
		return x;
	};

	var getY = function() {
		return y;
	};

	var setX = function(newX) {
		x = newX;
	};

	var setY = function(newY) {
		y = newY;
	};
	
	var isZombie = function() {
		return zombie;
	};
	
	var setZombie = function(newZombie) {
		zombie = newZombie;
	};
	
	var isSafe = function(){
		return safe;
	};
	
	var setSafe = function(newSafe){
		safe = newSafe;
	};
	
	var isTempSafe = function(){
		return tempSafe;
	};
	
	var setTempSafe = function(newTempSafe){
		tempSafe = newTempSafe;
	};
	
	var setName = function(newName){
		name = newName;
	};
	
	var getName = function(){
		return name;
	};
	
	var getScore = function(){
		return score;
	};
	
	var setScore = function(newScore){
		score = newScore;
	};

	// Update player position
	var update = function(keys) {
		// Previous position
		var prevX = x,
			prevY = y;

		// Up key takes priority over down
		if (keys.up) {
			y -= moveAmount;
		} else if (keys.down) {
			y += moveAmount;
		};

		// Left key takes priority over right
		if (keys.left) {
			x -= moveAmount;
		} else if (keys.right) {
			x += moveAmount;
		};

		return (prevX != x || prevY != y) ? true : false;
	};

	// Draw player
	var draw = function(ctx,lx,ly) {
		ctx.fillRect(x-lx, y-ly, 10, 10);
		ctx.fillText(name, x-lx, y-ly);
		ctx.fillText(x + "," + y, x-lx+10, y-ly-10); 
	};

	// Define which variables and methods can be accessed
	return {
		getX: getX,
		getY: getY,
		setX: setX,
		setY: setY,
		update: update,
		draw: draw,
		isZombie: isZombie,
		isSafe: isSafe,
		isTempSafe: isTempSafe,
		setSafe: setSafe,
		setTempSafe: setTempSafe,
		setZombie : setZombie,
		setName: setName,
		getName: getName,
		setScore: setScore,
		getScore: getScore,
		zombie:zombie,
		tempSafe:tempSafe,
		safe:safe
	}
};