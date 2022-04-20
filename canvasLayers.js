//a feature that allows users to draw on multiple layers

function CanvasLayers() {

    this.layersCount = 0;
    //Background is the default layer that cannot be deleted by the user
    this.layers = [
        {
            layerNumber: 0,
            name: "Background", 
            actionIcon: "assets/properties/lock.svg",
            layerPixels: createGraphics(width, height),
            active: true
        }
    ];
    this.selectedLayer = this.layers[0];

    var self = this;

    //Add new layer
    this.addNewLayer = function() {
        let layers = self.layers;

        //Set all layers to inactive
        for(let iter = 0; iter < layers.length; ++iter) {
            layers[iter].active = false;
        }  

        //Create an object for each layer to track it's state
        let layer = {
                layerNumber: layers.length,
                name: "Layer " + layers.length,
                actionIcon: "assets/properties.delete.svg",
                layerPixels: createGraphics(width, height),
                active: true
            }

        layers.push(layer);
        self.selectedLayer = layer;

        //Update the colors from swatch
        colourP.updateColor();

        self.populateLayers();
    }

    //Load the existing layers to the section
    this.populateLayers = function() {

        //Get the Layer's sectin in DOM
        let layersContainer = select("#layers-container");
        layersContainer.html("");

        //Populate the layers into the Layers section
        let layers = this.layers;
        for(let iter = layers.length - 1; iter >= 0; --iter) {

            let layerRow = createDiv();
            layerRow.class("layer-row");
            
            //Set name and delete icon for each layer
            let layerName;
            let layerIcon;

            let current = layers[iter];

            //Check if it's the background layer
            if(current.name == "Background") {
                layerName = createP('Background');
                layerName.class('layer-name');

                layerIcon = createImg('assets/properties/lock.svg', 'locked layer icon');
                layerIcon.id('lock-icon');
                layerIcon.class('prop-square-btn');

            } 
            //If it's any other layer, give the ability to delete the layer
            else {
                layerName = createP('Layer ' + current.layerNumber);
                layerName.class('layer-name');
                layerName.id('layer-' + current.layerNumber);

                layerIcon = createImg('assets/properties/delete.svg', 'delete layer icon');
                layerIcon.id('delete-layer-' + current.layerNumber);
                layerIcon.class('prop-square-btn delete-icon');

                //Add event handler for deleting layer
                layerIcon.mouseClicked(function() {
                    self.deleteLayer(layers, current.layerNumber);
                });
            }

            layerName.parent(layerRow);
            layerIcon.parent(layerRow);
            layerRow.parent(layersContainer);

            if(current.active) {
                layerName.addClass('active');
            } 

            //Add event handler to set active state
            layerName.mouseClicked(function() {
                self.setActiveLayer(layers, current.layerNumber);
            });
        }
    }

    //Set the active layer based on user click
    //Any drawing made will go into the active layer's graphics buffer
    this.setActiveLayer = function(layers, clickedLayerNumber) {

        for(let iter = 0; iter < layers.length; ++iter) {
            layers[iter].active = false;
        }

        let activeLayer = layers[clickedLayerNumber];
        activeLayer.active = true;
        self.selectedLayer = activeLayer;

        //Update the colors from swatch
        colourP.updateColor();

        //Populate the new list of layers
        self.populateLayers();
    }

    //Delete a layer from the section
    this.deleteLayer = function(layers, clickedLayerNumber) {

        //Remove the particular layer
        layers.splice(clickedLayerNumber, 1);

        //Set all the layers to be inactive first
        for(let iter = 0; iter < layers.length; ++iter) {
            layers[iter].layerNumber = iter;
            layers[iter].active = false;
        }

        //Always set the top-most layer to be active when deleting a layer
        let activeLayer = layers[layers.length - 1];
        activeLayer.active = true;
        self.selectedLayer = activeLayer;

        //Populate the new list of layers
        self.populateLayers();
    }

    //Load initial background layer
    this.loadOptions = function() {
        //Get the Layer's section in DOM
        let layersSection = select("#layers");

        //Create container to hold layers
        let layersContainer = createDiv();
        layersContainer.id("layers-container");
        layersContainer.parent(layersSection);

        //Event handler to add a layer
        let addLayerIcon = select("#add-layer");
        addLayerIcon.mouseClicked(this.addNewLayer);

        //Populate the initial background layer
        this.populateLayers();
    }
    this.loadOptions();

}