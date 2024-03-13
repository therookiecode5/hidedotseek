/**************************************************
** GAME Pillar CLASS
**************************************************/
var Pillar = function(startX, startY, inWidth, inHeight){
	var 
		X = startX,
		Y = startY,
		width = inWidth,
		height = inHeight,
		image,
		visible = false;
	
	// Getter and Setter
	var setWidth = function(newWidth){
		width = newWidth;
	};
	
	var getWidth = function(){
		return width;
	};
	
	var setHeight = function(newHeight){
		height = newHeight;
	};
	
	var getHeight = function(){
		return height;
	};
	
	var getX = function(){
		return X;
	};
	
	var setX = function(newX){
		X = newX;
	};
	
	var setY = function(newY){
		Y = newY;
	};
	
	var getY = function(){
		return Y;
	};
	
	var setImage = function(newImage){
		image = newImage;
	};
	
	var getImage = function(){
		return image;
	};
	
	var getVisible = function(){
		return visible;
	};
	
	var setVisible = function(newVisible){
		visible = newVisible;
	};
	
	var setUserIsSafe = function(player){
		player.setIsSafe(true);
	};
	
	var setUserIsUnsafe = function(player){
		player.setIsSafe(false);
	};
	var draw = function(ctx,lx,ly) {

		ctx.fillStyle="#222222";
		ctx.fillRect(X-lx, Y-ly, width, height);
	};
	
	return{
		setWidth : setWidth,
		setHeight : setHeight,
		getWidth : getWidth,
		getHeight : getHeight,
		getX : getX,
		getY : getY,
		setX : setX,
		setY : setY,
		setImage : setImage, 
		getImage : getImage,
		draw:draw
		
	};
};
