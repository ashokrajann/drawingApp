//a tool for making freehand drawings on the screen

function FreehandTool(){
	//set an icon and a name for the object
	this.icon = "assets/tools/freeHand.svg";
	this.name = "freehand";

	//Set the start position of the mouse to -1 to determine if user as started drawing
	var previousMouseX = -1;
	var previousMouseY = -1;

	this.draw = function(){
		//Get the current layer's graphics buffer
		let currentLayerPixels = canvasLayers.selectedLayer.layerPixels;

		//if the mouse is pressed
		if(mouseIsPressed){
			//If user has just begun drawing, set previous X and Y to current moue position
			if (previousMouseX == -1){
				previousMouseX = mouseX;
				previousMouseY = mouseY;
			}
			//iDraw a line from the starting point to current mouselocation
			else{
				currentLayerPixels.line(previousMouseX, previousMouseY, mouseX, mouseY);
				previousMouseX = mouseX;
				previousMouseY = mouseY;
			}
		}
		//if the user has released the mouse, set the previousMouse values back to -1.
		else{
			previousMouseX = -1;
			previousMouseY = -1;
		}

		//After the drawing is done, save the current state of canvas
		currentLayerPixels.loadPixels();
	};

	//When another tool is selected, update the pixels to just show the drawing
    this.unselectTool = function() {
		let currentLayerPixels = canvasLayers.selectedLayer.layerPixels;
        currentLayerPixels.updatePixels();
    };
}