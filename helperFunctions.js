function HelperFunctions() { 
	

	//event handler for the clear button event. Clears the screen
	select("#clearButton").mouseClicked(function() {
		//Get the current layer's graphics buffer
		let currentLayerPixels = canvasLayers.selectedLayer.layerPixels;

		//Clear the buffer
		currentLayerPixels.clear();
		
		//call loadPixels to update the drawing state
		//this is needed for the mirror tool
		currentLayerPixels.loadPixels();

		//Reset the colourPalette values
		colourP.setDefaultColor();
	});

	//event handler for the save image button. saves the canvas to the
	//local file system.
	select("#saveImageButton").mouseClicked(function() {
		//Get the current layer's graphics buffer
		let currentLayerPixels = canvasLayers.selectedLayer.layerPixels;

		currentLayerPixels.loadPixels();
		saveCanvas("myDrawing", "jpg");
		currentLayerPixels.updatePixels();
	});

	//Set the deafult cursor to cross when drawing
	this.updateCursor = function() {
		cursor(CROSS);
	}
}