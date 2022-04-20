//a tool for coloring the screen with a spray effect

function SprayCanTool(){
    
    //set an icon and a name for the object
	this.name = "sprayCan";
	this.icon = "assets/tools/sprayCan.svg";
    
    //Slider options to configure - Points and Spread
	this.sliders = [
        {
            name: "points",
            min: 1,
            max: 300,
            default: 40,
            step: 1,
            inputElement: null
        },
        {
            name: "spread",
            min: 1,
            max: 250,
            default: 20,
            step: 1,
            inputElement: null
        }
    ];

	this.draw = function(){
        //Get the current layer's graphics buffer
		let currentLayerPixels = canvasLayers.selectedLayer.layerPixels;

        //Get the points and spread values before drawing
		let points = this.sliders[0].inputElement.value();
		let spread = this.sliders[1].inputElement.value();

		if(mouseIsPressed){
            //Loop based on number of points to be drawn
			for(var i = 0; i < points; i++){
				currentLayerPixels.point(random(mouseX - spread, mouseX + spread), random(mouseY - spread, mouseY + spread));
			}
        }
        
        //After the drawing is done, save the current state of canvas
		currentLayerPixels.loadPixels();
	};

	this.loadSliders = function() {

        //Create a container for the slider
        let sliderContainer = createDiv("");
        sliderContainer.id("slider-container");

        for(let iter = 0; iter < this.sliders.length; ++iter) {

            let slider = this.sliders[iter];

            //Create slider input element
            slider.inputElement = createSlider(slider.min, slider.max, slider.default, slider.step);

            //Create container to place slider and it's label
            let sliderDiv = createDiv("<span class='property-label'>"+ slider.name +"</span>");
            sliderDiv.class("slider-input");
            slider.inputElement.parent(sliderDiv);
            sliderDiv.parent(sliderContainer);

            //Label to show slider value
            let sliderValue = createSpan(slider.inputElement.value());
            sliderValue.class("slider-value");
            sliderValue.id("silder-" + slider.name);
            sliderValue.parent(sliderDiv);

            //Add event listener for slider
            slider.inputElement.input(function() {
                select("#silder-" + slider.name).html(slider.inputElement.value());
            });
		}
		
		let optionsSection = select("#toolOptions");
        sliderContainer.parent(optionsSection);
    }
    
	//Load the options into the Section
	this.populateOptions = function() {    
        this.loadSliders();
    }
    
    //when another tool is selected, update the pixels to just show the drawing
	//Also clear options frmo properties section
    this.unselectTool = function() {
        let currentLayerPixels = canvasLayers.selectedLayer.layerPixels;
        currentLayerPixels.updatePixels();
        
		//clear options
        select("#toolOptions").html("");
    };
}