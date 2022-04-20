//global variables that will store the toolbox, colour palette, layers
//and the helper functions
var toolbox = null;
var colourP = null;
var helpers = null;
var canvasLayers = null;

//Load images as stamps for the stampTool
var totalStamps = 12;
var stampCollection = [];

function preload() {
	for(let stamp = 1; stamp <= totalStamps; ++stamp) {
		stampCollection[stamp - 1] = loadImage("assets/stamps/" + stamp + ".svg");
	}
}


function setup() {

	//create a canvas to fill the content div from index.html
	var canvas = createCanvas(800, 600);
	canvas.id("canvasView");
	canvas.parent(select('#canvasContainer'));

	//create helper functions and the colour palette
	canvasLayers = new CanvasLayers();
	helpers = new HelperFunctions();
	colourP = new ColourPalette();

	//create a toolbox for storing the tools
	toolbox = new Toolbox();

	//add the tools to the toolbox.
	toolbox.addTool(new FreehandTool());
	toolbox.addTool(new LineToTool());
	toolbox.addTool(new ShapeTool());
	toolbox.addTool(new SprayCanTool());
	toolbox.addTool(new mirrorDrawTool());
	toolbox.addTool(new StampTool(stampCollection));
	toolbox.addTool(new ScissorTool());
	toolbox.addTool(new TextTool());
	
	colourP.setDefaultColor();
	canvas.mouseOver(helpers.updateCursor);
	canvas.mousePressed(onMousePressed);
}

function draw() {

	//Load the images of each layer
	background(255);
	for(let layer = 0; layer < canvasLayers.layers.length; ++layer) {
		image(canvasLayers.layers[layer].layerPixels, 0, 0);
	}

	//hasOwnProperty is a javascript function that tests
	//if an object contains a particular method or property
	if (toolbox.selectedTool.hasOwnProperty("draw")) {

		//call the draw function from the selected tool.
		toolbox.selectedTool.draw();

	} else {
		//if there isn't a draw method the app will alert the user
		alert("it doesn't look like your tool has a draw method!");
	}
}


function onMousePressed() {
	let currentTool = toolbox.selectedTool;
	//Call the mouseClick method when scissor tool is selected
	if(currentTool.name == "scissor") {
		currentTool.onMouseClick();
	}

	if(currentTool.name == "text") {
		currentTool.onMouseClick();
	}
}

function mouseDragged() {
	let currentTool = toolbox.selectedTool;
	//Call the mouseDrag method when scissor tool is selected
	if(currentTool.name == "scissor") {
		currentTool.onMouseDrag();
	}
}

function mouseReleased() {
	let currentTool = toolbox.selectedTool;
	//Call the mouseRelease method when scissor tool is selected
	if(currentTool.name == "scissor") {
		currentTool.onMouseRelease();
	}
}

