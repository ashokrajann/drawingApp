//a tool that allows custom stamps to be drawn

function StampTool(stampCollection) {
    //Get the stamp images from the initial preload
    let stamps = stampCollection;

    //set an icon and a name for the object
    this.icon = "assets/tools/stamp.svg";
    this.name = "stampTool";

    //The current chosen stamp to draw
    this.currentStamp = stamps[0];

    //Slider configurations - Size, Count and Spread
    this.sliders = [
        {
            name: "size",
            min: 10,
            max: 120,
            default: 40,
            step: 1,
            inputElement: null
        },
        {
            name: "count",
            min: 1,
            max: 20,
            default: 2,
            step: 1,
            inputElement: null
        },
        {
            name: "spread",
            min: 1,
            max: 100,
            default: 1,
            step: 1,
            inputElement: null
        },
    ];

    var self = this;

    //Get the Options Section in DOM
    let optionsSection = select("#toolOptions");


    this.draw = function() {
        let currentLayerPixels = canvasLayers.selectedLayer.layerPixels;

        let stampSize = this.sliders[0].inputElement;
        let stampCount = this.sliders[1].inputElement;
        let stampSpread = this.sliders[2].inputElement;
        
        //When the mouse is pressed, drap the selected stamp on canvas
        if(mouseIsPressed) {

            let spreadValue = (stampCount.value() > 1) ? stampSpread.value() : 1;

            for(let stamp = 0; stamp < stampCount.value(); ++stamp) {
                let stampPosX = random((mouseX - stampSize.value() / 2) - spreadValue, (mouseX - stampSize.value() / 2) + spreadValue);
                let stampPosY = random((mouseY - stampSize.value() / 2) - spreadValue, (mouseY - stampSize.value() / 2) + spreadValue);
                currentLayerPixels.image(this.currentStamp, stampPosX, stampPosY, stampSize.value(), stampSize.value());
            }
        }

        //after the drawing is done save the pixel state.
        currentLayerPixels.loadPixels();

    }    

    //Create the stamp options to be loaded
    this.loadStamps = function() {
        let stampsContainer = createDiv("");
        stampsContainer.id("stamps-container");

        //Setting active state for an option
		function setActiveState(propOption) {
            let thumbnails = selectAll(".prop-square-btn");
			for (var i = 0; i < thumbnails.length; ++i) {
				thumbnails[i].removeClass('active');
			}
			
			propOption.addClass('active');
		}

        //Setting the event listeners to options
        for(let stamp = 0; stamp < stamps.length; ++stamp) {
            
            let thumbnail = createDiv("<img src='assets/stamps/"+ (stamp + 1) +".svg' alt='stamp thumbnail'/>");
            thumbnail.parent(stampsContainer);
            thumbnail.addClass("prop-square-btn");

            thumbnail.mouseClicked(function() {
                self.currentStamp = stamps[stamp];
                setActiveState(thumbnail);
            });

        }

        stampsContainer.parent(optionsSection);
    }

    //Create the stamp configuration options to be loaded
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

                //Spread slider should be enabled only when count > 1
                if(self.sliders[1].inputElement.value() > 1) {
                    self.sliders[2].inputElement.removeAttribute('disabled');
                } else {
                    self.sliders[2].inputElement.attribute('disabled', '');
                }
            });
        }
        sliderContainer.parent(optionsSection);
    }

    //Load the options into the Section. When clicked toggle between options
    this.populateOptions = function() {
        
        this.loadStamps();
        this.loadSliders();

    }
    
    //when the tool is deselected update the pixels to just show the drawing
	//Also clear options from properties section
    this.unselectTool = function() {
        let currentLayerPixels = canvasLayers.selectedLayer.layerPixels;
        currentLayerPixels.updatePixels();
        
		//clear options
        select("#toolOptions").html("");
        this.currentStamp = stamps[0];
    };
}