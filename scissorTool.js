//a tool for cutting and relocating parts of drawing

function ScissorTool() {
    //set an icon and a name for the object
    this.icon = "assets/tools/scissor.svg";
    this.name = "scissor";

    //Inital variables to track the mouse state and chosen canvas region to cut
    this.toolMode = "searching";
    this.selectedArea = { x: 0, y: 0, w: 0, h: 0};
    this.selectedPixels = null;

    //Create separate graphicsBuffer for the rectangle drawn during area selection
    let selectionBuffer = createGraphics(width, height);

    this.draw = function() {
        //UpdatePixels to avoid rectangles of previous frames from being visible
        selectionBuffer.updatePixels();

        if(this.toolMode == "cutting") {
            //Draw a rectangle in selection buffer to show the area being cut            
            selectionBuffer.push();
            selectionBuffer.strokeWeight(2);
            selectionBuffer.stroke(10,10,10,50);
            selectionBuffer.fill(10,10,10,20);
            selectionBuffer.rect(this.selectedArea.x, this.selectedArea.y, this.selectedArea.w, this.selectedArea.h);
            selectionBuffer.pop();
            image(selectionBuffer, 0, 0);

        } else if(this.toolMode == "pasting") {
            //Display the cut area as the user drags the mouse for pasting
            image(this.selectedPixels, mouseX, mouseY);
        }
    }

    //Event handlers based on user interaction with Scissor tool
    this.onMouseClick = function() {

        //Get the current layer's graphics buffer
        let currentLayerPixels = canvasLayers.selectedLayer.layerPixels;

        //If user is searching, click to drag and select area to be cut
        if(this.toolMode == "searching") {
            //Save the pixels before starting the cut operation
            currentLayerPixels.loadPixels();
            selectionBuffer.loadPixels();

            //Set the start position for area to be cut
            this.selectedArea.x = mouseX;
            this.selectedArea.y = mouseY;
            this.toolMode = "cutting";
        }

        //If the user is pasting, click to paste the cut out area
        else if(this.toolMode == "pasting") {
            //Paste the cut out region
            currentLayerPixels.image(this.selectedPixels, mouseX, mouseY);
            
            //Save the pixels after pasting the image
            currentLayerPixels.loadPixels();

            //Reset the selected area
            this.selectedArea.x = 0;
            this.selectedArea.y = 0;
            this.selectedArea.w = 0;
            this.selectedArea.h = 0;
            this.toolMode = "searching";
        }
    }

    this.onMouseDrag = function() {
        if(this.toolMode == "cutting") {
            //Calculate the area to be cut on mouseDrag
            let width = mouseX - this.selectedArea.x;
            let height = mouseY - this.selectedArea.y;
            this.selectedArea.w = width;
            this.selectedArea.h = height;
        }
    }

    this.onMouseRelease = function() {
        //Get the current layer's graphics buffer
        let currentLayerPixels = canvasLayers.selectedLayer.layerPixels;

        //Prevent entering pasting mode unless user performs a drag
        if(this.selectedArea.w == 0) {
            this.toolMode = "searching";
            
		} else if(this.toolMode == "cutting") {

            //Set the X, Y, width & height values for selectedArea based on mouseDrag direction
            let startX = this.selectedArea.x;
            let startY = this.selectedArea.y;
            let widthX = this.selectedArea.w;
            let heightY = this.selectedArea.h;

            if(mouseX < this.selectedArea.x && mouseY < this.selectedArea.y) {

                startX = startX + this.selectedArea.w;
                startY = startY + this.selectedArea.h;
                widthX = abs(this.selectedArea.w);
                heightY = abs(this.selectedArea.h);

            } else if(mouseX > this.selectedArea.x && mouseY < this.selectedArea.y) {

                heightY = abs(this.selectedArea.h);
                startY = startY - heightY;

            } else if(mouseX < this.selectedArea.x && mouseY > this.selectedArea.y) {

                widthX = abs(this.selectedArea.w);
                startX = startX - widthX;

            }

            //Get the selected area image
			this.selectedPixels = currentLayerPixels.get(startX, startY, widthX, heightY);

            //Clear the selected area by updating the pixels
            let areaHeight = startY + heightY;
            let areaWidth = startX + widthX;

            for(let y = startY; y < areaHeight; ++y) {
                for(let x = startX; x < areaWidth; ++x) {
                    currentLayerPixels.set(x, y, color(0,0,0,0));
                }
            }

            //UpdatePixels after setting the color values to transparent
            currentLayerPixels.updatePixels();
            
			this.toolMode = "pasting";	
		} 
	
    }
}