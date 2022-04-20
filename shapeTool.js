//a tool for drawing basic shapes - rectangle, ellipse and triangle

function ShapeTool() {
    //set an icon and a name for the object
    this.icon = 'assets/tools/shapes.svg';
    this.name = 'shapes';

    //the current selected shape to draw
    this.selectedShape = 'rectangle';

    var self = this;

    //Set the initial start location to -1
    var startMouseX = -1;
    var startMouseY = -1;

    this.draw = function() {
        //Get the current layer's graphics buffer
        let currentLayerPixels = canvasLayers.selectedLayer.layerPixels;

        if(mouseIsPressed) {

            if(startMouseX == -1) {
                startMouseX = mouseX;
                startMouseY = mouseY;
                //save the current pixel Array
                currentLayerPixels.loadPixels();
            }

            else {
                currentLayerPixels.updatePixels();
                
                //determine the width and height of ellipse
                let width = mouseX - startMouseX;
                let height = mouseY - startMouseY;
                
                //draw the selected shape
                if(this.selectedShape == "ellipse") {
                    currentLayerPixels.ellipse(startMouseX + (width / 2), startMouseY + (height / 2), width, height);
                } else if (this.selectedShape == "rectangle") {
                    currentLayerPixels.rect(startMouseX, startMouseY, width, height);
                } else {
                    currentLayerPixels.triangle(startMouseX, startMouseY, startMouseX - width, startMouseY + height, startMouseX + width, startMouseY + height);
                }
            }
        }

        else {
            //save the pixels with the most recent line and reset the start locations
            startMouseX = -1;
            startMouseY = -1;
        }
    }

    //Get the Options Section in DOM
    let optionsSection = select("#toolOptions");

    //Setting active state for an option
    this.setActiveState = function(options, propOption) {
        for (var i = 0; i < options.length; i++) {
            options[i].prop.removeClass('active');
        }
        //Add the active state to the clicked option
        propOption.addClass('active');
    }

    //Create the shape options to be loaded
    this.loadShapes = function() {

        //Create options for three shapes
		let rectangleShape = createDiv("<img src='assets/properties/rectangle.svg' alt='rectangle shape icon'/>");
		let ellipseShape = createDiv("<img src='assets/properties/ellipse.svg' alt='ellipse shape icon'/>");
		let triangleShape = createDiv("<img src='assets/properties/triangle.svg' alt='triangle shape icon'/>");

        //Create container for the shapes
		let shapesContainer = createDiv("");
		shapesContainer.id("shape-container");
        shapesContainer.parent(optionsSection);

        //Add a label for the options
        let label = createSpan('Shapes: ');
        label.class("property-label");
        label.parent(shapesContainer);

        //Create an array of shapes so it's easy to traverse when adding attributes and event handlers
        let options = [ 
            {
                prop: rectangleShape,
                value: 'rectangle'
            }, 
            {
                prop: ellipseShape,
                value: 'ellipse'
            },
            {
                prop: triangleShape,
                value: 'triangle'
            }
        ];

        //Add attributes and event handlers to options
        for(let option = 0; option < options.length; ++option) {

            let currentOption = options[option];

			currentOption.prop.parent(shapesContainer);
            currentOption.prop.addClass("prop-square-btn");
            
            //Event listeners for the options
            currentOption.prop.mouseClicked(function() {
                self.selectedShape = currentOption.value;
                self.setActiveState(options, currentOption.prop);
            });

        }

        //Setting the default option
        switch(this.selectedShape) {
            case "ellipse":
                ellipseShape.addClass('active');
                break;
            case "triangle":
                triangleShape.addClass('active');
                break;
            default:
                rectangleShape.addClass('active');
                break;
        }

    }

    //Load the options into the Section. When clicked toggle between options
    this.populateOptions = function() {
        this.loadShapes();
    }

    //When another tool is selected, update the pixels to just show the drawing
	//Also clear options from properties section
    this.unselectTool = function() {
        let currentLayerPixels = canvasLayers.selectedLayer.layerPixels;
        currentLayerPixels.updatePixels();
        
		//clear options
        select("#toolOptions").html("");
    };

}