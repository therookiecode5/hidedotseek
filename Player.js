/**************************************************
** GAME PLAYER CLASS
**************************************************/
var Player = function(startX, startY) {
	var x = startX,
		y = startY,
		zombie=false,
		safe=false,
		tempSafe=false,
		name,
		id,
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

	var setZombie = function(newZombie) {
		zombie = newZombie;
	};
	
	var isZombie = function(){
		return zombie;
	};
	
	var isSafe = function() {
		return safe;
	};
	
	var isTempSafe = function() {
		return tempSafe;
	};
	
	var setSafe = function(newSafe) {
		safe = newSafe;
	};
	
	var setTempSafe = function(newTempSafe) {
		tempSafe = newTempSafe;
	};
	
	var setName = function(newName) {
		name = newName;
	};
	
	var getName = function(){
		return name;
	};
	
	var setScore = function(newScore){
		score = newScore;
	};
	
	var getScore = function(){
		return score;
	};
	
	// Define which variables and methods can be accessed
	return {
		getX: getX,
		getY: getY,
		setX: setX,
		setY: setY,
		id: id,
		setZombie: setZombie,
		isZombie: isZombie,
		isSafe: isSafe,
		isTempSafe: isTempSafe,
		setSafe: setSafe,
		setTempSafe: setTempSafe,
		setName: setName,
		getName: getName,
		setScore: setScore,
		getScore: getScore
	}
};

// Export the Player class so you can use it in
// other files by using require("Player").Player
exports.Player = Player;