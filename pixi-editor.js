
var Canvas = function(id, width, height){
	
	var stage = null;
	var renderer = null;

	var mode = 'draw';
	var drawing = false;
	var path = [];

	var graphics = new PIXI.Graphics();
	var liveGraphics = new PIXI.Graphics();

	var lineWidth = '10';
	var lineColor = '0xffd920';
	var lineDrawingColor = '0xffd920';
	var lineAlpha = '1';
	
	var enableDrawMode = function(){
		
		setDrawEvents();
	}

	var disableDrawMode = function(){
		
		dropDrawEvents();
	}

	var setDrawEvents = function(){
		stage.mousedown = stage.touchstart = function(e) {
			path = [];
			var position = e.global;
		    drawing = true;
		};

		stage.mousemove = stage.touchmove = function(e) {
			if(!drawing){return}
			var position = e.global;
			path.push(parseInt(position.x));
			path.push(parseInt(position.y));
		};

		stage.mouseup = stage.touchend = function(e){
			drawing = false;
			graphics.lineStyle(lineWidth, lineColor, lineAlpha);
			graphics.drawPath(path);
			path = [];
		}
	}

	var dropDrawEvents = function(){
		stage.mousedown = stage.touchstart = '';
		stage.mousemove = stage.touchmove = '';
		stage.mouseup = stage.touchend = '';
	}

	var animate = function() {

	    liveGraphics.clear();
		liveGraphics.lineStyle(lineWidth, lineDrawingColor, lineAlpha);
		liveGraphics.drawPath(path);
	    
	    renderer.render(stage);
	    requestAnimFrame(animate);
	}

	var setLineWidth = function(width){
		lineWidth = width;
	}

	var getLineWidth = function(){
		return lineWidth;
	}

	var setBackgroundColor = function(color){
		stage.setBackgroundColor(color);
	}

	var setLineColor = function(color){
		lineColor = color;
		lineDrawingColor = color;		
	}

	var setLineAlpha = function(alpha){
		lineAlpha = alpha;
	}

	var getLineAlpha = function(){
		return lineAlpha;
	}

	var getImage = function(){
		renderer.render(stage);
		return renderer.view.toDataURL();		
	}

	var clear = function(){
		graphics.clear();
	}

	var __construct = function(id, width, height) {
        stage = new PIXI.Stage(0x97c56e, true);
        
        renderer = new PIXI.autoDetectRenderer(width, height, null, false, true);
        
        stage.transparent = true;
        document.getElementById(id).appendChild(renderer.view);
        renderer.view.style.position = "relative";
        renderer.render(stage); 

        stage.addChild(graphics);
		stage.addChild(liveGraphics);


		animate();

    }(id, width, height);

	return {
		enableDrawMode: enableDrawMode,
		disableDrawMode: disableDrawMode,
		setLineWidth: setLineWidth,
		getLineWidth: getLineWidth,
		setBackgroundColor: setBackgroundColor,
		setLineColor: setLineColor,
		setLineAlpha: setLineAlpha,
		getLineAlpha: getLineAlpha,
		getImage: getImage,
		stage: stage,
		clear: clear,
	};
};




var editor = function(id, width, height){

	var Panel = function(id){

		var panel = [];

		var initTemplate = function(){
		
			panel.push($('<b />', {text: 'Line width '}));
			panel.push($('<input />', {id: 'linewidth-slider', type: 'text'}));			
			panel.push($('<b />', {text: ' alpha '}));		
			panel.push($('<input />', {id: 'linealpha-slider', type: 'text'}));
			panel.push($('<br/>'));
			panel.push(
				$('<button />', {id: 'save', text: 'save'})
					.addClass('btn btn-default')
					.attr('type','button')
				);
			panel.push(
				$('<button />', {id: 'clear', text: 'clear'})
					.addClass('btn btn-default')
					.attr('type','button')
				);
			panel.push(
				$('<input/>', {id: 'changeColorInput'})
					.attr('style', 'display:none;')
				);
			panel.push(
				$('<input/>', {id: 'changeBackgroundColorInput'})
					.attr('style', 'display:none;')
				);
		}();

		$('#view').prepend(panel);
		
		var initButtons = function(){

			$('#linewidth-slider').slider({
				min: 1, 
				max: 20,
				tooltip: 'hide',
				value: canvas2.getLineWidth(),
			}).on('slide', function(e){
				canvas2.setLineWidth(e.value)
			});

			$('#linealpha-slider').slider({
				min: 0.1, 
				max: 1.0,
				step: 0.1,
				tooltip: 'hide',
				value: canvas2.getLineAlpha(),
			}).on('slide', function(e){
				canvas2.setLineAlpha(e.value)
			});
			
			$("#save").click(function(){
				var data = canvas2.getImage();
				var win = window.open(data);
			});

			$("#clear").click(function(){
				canvas2.clear();
			});

			$("#changeColorInput").spectrum({
		   		color: "#ffd920",
		   		showPalette: true,
		    	palette: [
		       		['black', 'white', 'red'],
		        	['green', 'yellow', 'purple']
		    	],
		   		change: function(color) {
		 	   		canvas2.setLineColor(color.toHexString().replace('#','0x'));
				}
			});


			$("#changeBackgroundColorInput").spectrum({
		   		color: "#ffd920",
		   		showPalette: true,
		    	palette: [
		       		['black', 'white', 'red'],
		        	['green', 'yellow', 'purple']
		    	],
		   		change: function(color) {
		 	   		canvas2.setBackgroundColor(color.toHexString().replace('#','0x'));
				}
			});

		}();
		
	}	

	var canvas_params = {
		width: width,
		height: height
	} 

	var canvas_id = id + '_canvas';

	$('#'+id).append($('<div />',{id: canvas_id}));

	var canvas2 = new Canvas(canvas_id, canvas_params.width, canvas_params.height);
	canvas2.enableDrawMode();
	
	var panel = new Panel(id);
	
	return {
		getImage: canvas2.getImage
	}
}