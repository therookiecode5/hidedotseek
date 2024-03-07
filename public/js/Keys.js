/**************************************************
** GAME KEYBOARD CLASS
**************************************************/
var Keys = function(up, left, right, down) {
	var up = up || false,
		left = left || false,
		right = right || false,
		down = down || false;
		
	var onKeyDown = function(e) {
		var that = this,
			c = e.keyCode;
		switch (c) {
			// Controls
			case 37: case 65:// Left
				that.left = true;
				break;
			case 38: case 87: // Up
				that.up = true;
				break;
			case 39: case 68:// Right
				that.right = true; // Will take priority over the left key
				break;
			case 40: case 83:// Down
				that.down = true;
				break;
		};
	};
	
	var onKeyUp = function(e) {
		var that = this,
			c = e.keyCode;
		switch (c) {
			case 37: case 65:// Left
				that.left = false;
				break;
			case 38: case 87:// Up
				that.up = false;
				break;
			case 39: case 68:// Right
				that.right = false;
				break;
			case 40: case 83:// Down
				that.down = false;
				break;
		};
	};

	var ClearKeys = function(){
		var that = this;
		that.left = that.up = that.right = that.down = false;
	};

	return {
		up: up,
		left: left,
		right: right,
		down: down,
		onKeyDown: onKeyDown,
		onKeyUp: onKeyUp,
		ClearKeys:ClearKeys
	};
};