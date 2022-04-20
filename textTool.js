//a tool that allows user to add text to the drawing

function TextTool() {
    //set an icon and a name for the object
    this.icon = 'assets/tools/text.svg',
    this.name = "text",

    //A tool mode allows user to edit and then place the text anywhere on the screen
    this.toolMode = "searching";

    //Text style properties
    this.textContent = "Enter text";
    this.currentTextFont = 'Verdana';
    this.currentTextSize = 48;
    this.boldTextStyle = true;
    this.italicTextStyle = false;

    var self = this;

    this.draw = function() {
        //Get the current layer's graphics buffer
        let currentLayerPixels = canvasLayers.selectedLayer.layerPixels;
        currentLayerPixels.updatePixels();

        //Display relevant cursor based on the mode entered into by the user
        if(this.toolMode == "searching") {
            cursor(TEXT);
        } else if(this.toolMode == "editing"){
            cursor(MOVE);
        };

        //After the drawing is done, save the current state of canvas
		currentLayerPixels.loadPixels();
    }

    //Setting active state for an option
    this.setActiveState = function(options, propOption) {
        for (var i = 0; i < options.length; i++) {
            options[i].prop.removeClass('active');
        }
        
        propOption.addClass('active');
    }

    //Get the Options Section in DOM
    let optionsSection = select("#toolOptions");
    
    //Create the font options to be loaded
    this.loadFontOptions = function() {

        //Create options for three sizes
        let fontOptions = createSelect();

        fontOptions.id("text-fonts-container");
        fontOptions.parent(optionsSection);

        fontOptions.option('Verdana');
        fontOptions.option('Georgia');
        fontOptions.option('Times New Roman');
        fontOptions.option('Arial');
        fontOptions.option('Tahoma');
        fontOptions.option('Courier New');
        fontOptions.selected('Verdana');
        
         //Event listener for the options
        fontOptions.changed(function() {
            self.currentTextFont = fontOptions.value();
        });

    }

    //Create the text size options to be loaded
    this.loadSizeOptions = function() {

        //Create options for three sizes
		let smallTextSize = createDiv("<img src='assets/properties/small-text.svg' alt='small text icon'/>");
		let mediumTextSize = createDiv("<img src='assets/properties/medium-text.svg' alt='medium text icon'/>");
		let largeTextSize = createDiv("<img src='assets/properties/large-text.svg' alt='large text icon'/>");

		//Create container for the size option
		let textSizeContainer = createDiv("");
		textSizeContainer.id("text-size-container");
        textSizeContainer.parent(optionsSection);

        let label = createSpan('Size: ');
        label.class("property-label");
        label.parent(textSizeContainer);

        let options = [ 
            {
                prop: smallTextSize,
                value: 24
            }, 
            {
                prop: mediumTextSize,
                value: 48
            },
            {
                prop: largeTextSize,
                value: 80
            }
        ];

        for(let option = 0; option < options.length; ++option) {

            let currentOption = options[option];

			currentOption.prop.parent(textSizeContainer);
            currentOption.prop.addClass("prop-square-btn");
            
            //Event listeners for the options
            currentOption.prop.mouseClicked(function() {
                self.currentTextSize = currentOption.value;
                self.setActiveState(options, currentOption.prop);
            });

        }
        
        //Setting Medium text to be active by default
		mediumTextSize.addClass('active');

    }

    //Create the text style options to be loaded
    this.loadStyleOptions = function() {

        //Create options for three sizes
		let boldTextStyle = createDiv("<img src='assets/properties/bold-text.svg' alt='bold text icon'/>");
		let italicTextStyle = createDiv("<img src='assets/properties/italic-text.svg' alt='bold text icon'/>");

		//Create container for the two mirrors
		let textStyleContainer = createDiv("");
		textStyleContainer.id("text-style-container");
        textStyleContainer.parent(optionsSection);

        let label = createSpan('Style: ');
        label.class("property-label");
        label.parent(textStyleContainer);

        let options = [ boldTextStyle, italicTextStyle ];

        for(let option = 0; option < options.length; ++option) {

            let currentOption = options[option];

			currentOption.parent(textStyleContainer);
            currentOption.addClass("prop-square-btn");

        }

        //Event listeners for the options
        boldTextStyle.mouseClicked(function() {
            boldTextStyle.toggleClass('active');
            self.boldTextStyle = boldTextStyle.hasClass('active') ? true : false;
        });

        italicTextStyle.mouseClicked(function() {
            italicTextStyle.toggleClass('active');
            self.italicTextStyle = italicTextStyle.hasClass('active') ? true : false;
        });
        
        //Setting Medium text to be active by deafault
		boldTextStyle.addClass('active');

    }

    //Load the options into the Section. When clicked toggle between options
    this.populateOptions = function() {
        this.loadFontOptions();
        this.loadSizeOptions();
        this.loadStyleOptions();
    }

    //Based on the mode, either create a text input field for editing 
    //or create a text to be loaded into the graphics buffer
    this.onMouseClick = function() {

        let currentLayerPixels = canvasLayers.selectedLayer.layerPixels;

        //Store the mouseClick so they can place the text by pointing to location
        let clickPosX = mouseX;
        let clickPosY = mouseY;

        //If user adds a text and wants to edit it
        if(self.toolMode == "searching") {

            //Create container to hold DOM input elements
            let inputTextContainer = createDiv('');
            inputTextContainer.id('inputTextContainer');
            inputTextContainer.parent(select('#canvasContainer'));

            //Create editable input text element on canvas
            textContainer = createSpan(this.textContent);
            textContainer.position(clickPosX,clickPosY);
            textContainer.class('text-tool-input-container');
            textContainer.parent(select('#inputTextContainer'));
            textContainer.attribute('contenteditable', true);

            self.updateTextStyle(textContainer);

            //Update text style when user edits input
            textContainer.input(function() {
                self.toolMode = "editing";
                self.updateTextStyle(textContainer);
            });

        } 
        //To prevent new textContainter by mouseClick after editing text
        else if (self.toolMode = "pasting") {

            let inputEdited = select('.text-tool-input-container');

            //Replicate the text content into the GraphicsBuffer
            currentLayerPixels.push();
            currentLayerPixels.textFont(self.currentTextFont);
            currentLayerPixels.stroke(select("#fillColor").value());
            currentLayerPixels.textSize(self.currentTextSize);            
            
            //Determine the combination of font style to be set
            let styleConst;
            if(self.boldTextStyle && self.italicTextStyle) {
                styleConst = BOLDITALIC;
            } else if(self.boldTextStyle) {
                styleConst = BOLD;
            } else if(self.italicTextStyle){
                styleConst = ITALIC;
            } else {
                styleConst = NORMAL;
            }       
            currentLayerPixels.textStyle(styleConst);
            currentLayerPixels.text(inputEdited.elt.innerHTML, clickPosX, clickPosY);
            currentLayerPixels.pop();
            
            //Save the pixels into buffer on clicking outside textBox
            currentLayerPixels.loadPixels();

            //Delete the DOM element after text has been addded to buffer
            select('#inputTextContainer').html('');

            self.toolMode = "searching"
        }
    }

    //Update text style as user configures style
    this.updateTextStyle = function(textContainer) {
        textContainer.style('color', select("#fillColor").value());
        textContainer.style('font-family', self.currentTextFont);
        textContainer.style('font-size', self.currentTextSize + 'px');
        textContainer.style('font-weight', self.boldTextStyle ? 'bold' : 'normal');
        textContainer.style('font-style', self.italicTextStyle ? 'italic' : 'normal');
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