/**************************************************
** GAME MAP CLASS
**************************************************/
var Map = function(inWidth, inHeight){
	var 
		width = inWidth,
		height = inHeight;
		image;
	
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
	
	var setImage = function(newImage){
		image = newImage;
	};
	
	var getImage = function(){
		return image;
	};
	
	return{
		setWidth : setWidth,
		setHeight : setHeight,
		getWidth : getWidth,
		getHeight : getHeight,
		setImage : setImage,
		getImage : getImage	
	};
};
