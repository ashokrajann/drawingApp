//a tool for drawing straight lines to the screen

function LineToTool(){
	//set an icon and a name for the object
	this.icon = "assets/tools/lineTo.svg";
	this.name = "line";

	//Set the start position of the mouse to -1 to determine if user as started drawing
	var startMouseX = -1;
	var startMouseY = -1;

	this.draw = function(){
		//Get the current layer's graphics buffer
		let currentLayerPixels = canvasLayers.selectedLayer.layerPixels;

		//only draw when mouse is clicked
		if(mouseIsPressed){
			//if it's the start of drawing a new line
			if(startMouseX == -1){
				startMouseX = mouseX;
				startMouseY = mouseY;
				//save the current pixel Array
				currentLayerPixels.loadPixels();
			}

			else{
				//update the screen with the saved pixels to hide any previous
				//line between mouse pressed and released
				currentLayerPixels.updatePixels();
				//draw the line
				currentLayerPixels.line(startMouseX, startMouseY, mouseX, mouseY);
			}

		}

		else {
			//save the pixels with the most recent line and reset the start locations
			currentLayerPixels.loadPixels();
			startMouseX = -1;
			startMouseY = -1;
		}
	};

	//When another tool is selected, update the pixels to just show the drawing
    this.unselectTool = function() {
		let currentLayerPixels = canvasLayers.selectedLayer.layerPixels;
        currentLayerPixels.updatePixels();
    };


}
