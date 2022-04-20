//Displays and handles the colour palette.
function ColourPalette() {
	
	//Get the color swatch elements for fill and stroke
	var fillSwatch = select("#fillColor");
	var strokeSwatch = select("#strokeColor");

	this.setDefaultColor = function() {
		//Get the current layer's graphics buffer
		let currentLayerPixels = canvasLayers.selectedLayer.layerPixels;

		fillSwatch.value("#C4C4C4");
		strokeSwatch.value("#212121");

		//Set the style properties based on swatch values
		currentLayerPixels.fill("#C4C4C4");
		currentLayerPixels.stroke("#212121");
		currentLayerPixels.strokeWeight(2);
	}

	this.updateColor = function() {
		//Get the current layer's graphics buffer
		let currentLayerPixels = canvasLayers.selectedLayer.layerPixels;

		//get the new colour from the id of the clicked element
		currentLayerPixels.fill(fillSwatch.value());
		currentLayerPixels.stroke(strokeSwatch.value());
		currentLayerPixels.strokeWeight(2);

	}

	//Update the swatch when user selects a colour
	fillSwatch.changed(this.updateColor);
	strokeSwatch.changed(this.updateColor);
}