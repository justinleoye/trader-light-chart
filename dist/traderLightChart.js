var TraderLightChart=TraderLightChart||{};TraderLightChart.core=TraderLightChart.core||{},function(a){a.CHART_GLOABLE_CSS="\n\n\n\npath.line {\n    fill: none;\n    stroke: #000000;\n    stroke-width: 1;\n}\n\n.axis path,\n.axis line {\n    fill: none;\n    stroke: #000;\n    shape-rendering: crispEdges;\n}\n\npath {\n    fill: none;\n    stroke-width: 1;\n}\n\npath.candle {\n    stroke: #000000;\n}\n\npath.candle.body {\n    stroke-width: 0;\n}\n\npath.candle.up {\n    fill: #00AA00;\n    stroke: #00AA00;\n}\n\npath.candle.down {\n    fill: #FF0000;\n    stroke: #FF0000;\n}\n\npath.ohlc {\n    stroke: #000000;\n    stroke-width: 1;\n}\n\npath.ohlc.up {\n    stroke: #00AA00;\n}\n\npath.ohlc.down {\n    stroke: #FF0000;\n}\n\n.close.annotation.up path {\n    fill: #00AA00;\n}\n\n.ma-0 path.line {\n    stroke: #1f77b4;\n}\n\n.ma-1 path.line {\n    stroke: #aec7e8;\n}\n\npath.volume {\n    fill: #EEEEEE;\n}\n\n.crosshair {\n    cursor: crosshair;\n}\n\n.crosshair path.wire {\n    stroke: #DDDDDD;\n    stroke-dasharray: 1, 1;\n}\n\n.crosshair .axisannotation path {\n    fill: #DDDDDD;\n}\n\n\n\n    "}(TraderLightChart.core);

/**
* Detect Element Resize
*
* https://github.com/sdecima/javascript-detect-element-resize
* Sebastian Decima
*
* version: 0.5.3
**/

(function () {
	var attachEvent = document.attachEvent,
		stylesCreated = false;
	
	if (!attachEvent) {
		var requestFrame = (function(){
			var raf = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame ||
								function(fn){ return window.setTimeout(fn, 20); };
			return function(fn){ return raf(fn); };
		})();
		
		var cancelFrame = (function(){
			var cancel = window.cancelAnimationFrame || window.mozCancelAnimationFrame || window.webkitCancelAnimationFrame ||
								   window.clearTimeout;
		  return function(id){ return cancel(id); };
		})();

		function resetTriggers(element){
			var triggers = element.__resizeTriggers__,
				expand = triggers.firstElementChild,
				contract = triggers.lastElementChild,
				expandChild = expand.firstElementChild;
			contract.scrollLeft = contract.scrollWidth;
			contract.scrollTop = contract.scrollHeight;
			expandChild.style.width = expand.offsetWidth + 1 + 'px';
			expandChild.style.height = expand.offsetHeight + 1 + 'px';
			expand.scrollLeft = expand.scrollWidth;
			expand.scrollTop = expand.scrollHeight;
		};

		function checkTriggers(element){
			return element.offsetWidth != element.__resizeLast__.width ||
						 element.offsetHeight != element.__resizeLast__.height;
		}
		
		function scrollListener(e){
			var element = this;
			resetTriggers(this);
			if (this.__resizeRAF__) cancelFrame(this.__resizeRAF__);
			this.__resizeRAF__ = requestFrame(function(){
				if (checkTriggers(element)) {
					element.__resizeLast__.width = element.offsetWidth;
					element.__resizeLast__.height = element.offsetHeight;
					element.__resizeListeners__.forEach(function(fn){
						fn.call(element, e);
					});
				}
			});
		};
		
		/* Detect CSS Animations support to detect element display/re-attach */
		var animation = false,
			animationstring = 'animation',
			keyframeprefix = '',
			animationstartevent = 'animationstart',
			domPrefixes = 'Webkit Moz O ms'.split(' '),
			startEvents = 'webkitAnimationStart animationstart oAnimationStart MSAnimationStart'.split(' '),
			pfx  = '';
		{
			var elm = document.createElement('fakeelement');
			if( elm.style.animationName !== undefined ) { animation = true; }    
			
			if( animation === false ) {
				for( var i = 0; i < domPrefixes.length; i++ ) {
					if( elm.style[ domPrefixes[i] + 'AnimationName' ] !== undefined ) {
						pfx = domPrefixes[ i ];
						animationstring = pfx + 'Animation';
						keyframeprefix = '-' + pfx.toLowerCase() + '-';
						animationstartevent = startEvents[ i ];
						animation = true;
						break;
					}
				}
			}
		}
		
		var animationName = 'resizeanim';
		var animationKeyframes = '@' + keyframeprefix + 'keyframes ' + animationName + ' { from { opacity: 0; } to { opacity: 0; } } ';
		var animationStyle = keyframeprefix + 'animation: 1ms ' + animationName + '; ';
	}
	
	function createStyles() {
		if (!stylesCreated) {
			//opacity:0 works around a chrome bug https://code.google.com/p/chromium/issues/detail?id=286360
			var css = (animationKeyframes ? animationKeyframes : '') +
					'.resize-triggers { ' + (animationStyle ? animationStyle : '') + 'visibility: hidden; opacity: 0; } ' +
					'.resize-triggers, .resize-triggers > div, .contract-trigger:before { content: \" \"; display: block; position: absolute; top: 0; left: 0; height: 100%; width: 100%; overflow: hidden; } .resize-triggers > div { background: #eee; overflow: auto; } .contract-trigger:before { width: 200%; height: 200%; }',
				head = document.head || document.getElementsByTagName('head')[0],
				style = document.createElement('style');
			
			style.type = 'text/css';
			if (style.styleSheet) {
				style.styleSheet.cssText = css;
			} else {
				style.appendChild(document.createTextNode(css));
			}

			head.appendChild(style);
			stylesCreated = true;
		}
	}
	
	window.addResizeListener = function(element, fn){
		if (attachEvent) element.attachEvent('onresize', fn);
		else {
			if (!element.__resizeTriggers__) {
				if (getComputedStyle(element).position == 'static') element.style.position = 'relative';
				createStyles();
				element.__resizeLast__ = {};
				element.__resizeListeners__ = [];
				(element.__resizeTriggers__ = document.createElement('div')).className = 'resize-triggers';
				element.__resizeTriggers__.innerHTML = '<div class="expand-trigger"><div></div></div>' +
																						'<div class="contract-trigger"></div>';
				element.appendChild(element.__resizeTriggers__);
				resetTriggers(element);
				element.addEventListener('scroll', scrollListener, true);
				
				/* Listen for a css animation to detect element display/re-attach */
				animationstartevent && element.__resizeTriggers__.addEventListener(animationstartevent, function(e) {
					if(e.animationName == animationName)
						resetTriggers(element);
				});
			}
			element.__resizeListeners__.push(fn);
		}
	};
	
	window.removeResizeListener = function(element, fn){
		if (attachEvent) element.detachEvent('onresize', fn);
		else {
			element.__resizeListeners__.splice(element.__resizeListeners__.indexOf(fn), 1);
			if (!element.__resizeListeners__.length) {
					element.removeEventListener('scroll', scrollListener);
					element.__resizeTriggers__ = !element.removeChild(element.__resizeTriggers__);
			}
		}
	}
})();

var TraderLightChart = TraderLightChart || {};
TraderLightChart.core = TraderLightChart.core || {};

(function(core){
  core.getContainerWidth = function(){
  };

  core.getContainerHeight = function(){
  };

  core.classExtend = function(subClass, superClass){
    var F = function(){};
    F.prototype = superClass.prototype;
    subClass.prototype = new F();
    subClass.prototype.constructor = subClass;

    subClass.superClass = superClass.prototype;
    if(superClass.prototype.constructor == Object.prototype.constructor){
      superClass.prototype.constructor = superClass;
    }
  };

  core.insertCSS = function(css){
    var style = document.createElement('style');
    style.innerHTML = css;
    document.body.appendChild(style);
  };

  core.insertChartCSSToGloable = function(){
    core.insertCSS(core.CHART_GLOABLE_CSS);
  };

})(TraderLightChart.core);

TraderLightChart.core.insertChartCSSToGloable();

TraderLightChart.BaseChart = (function(){
  function Chart(options){
    this.margin = {
      top: 20,
      bottom: 30,
      left: 50,
      right: 50
    };

    this.options = {
      container_id: 'trader_light_chart_container',
      interval: 'D'
    };

    _.extend(this.options, options)

    this.data = [];
    this.isReady = false;
    this.canReInit = true;
  }

  // should override
  Chart.prototype._init = function(){
  };

  Chart.prototype._createScale = function(){
    console.log('_createScale');
    if(!this.isReady) return;

    this.xScale = techan.scale.financetime()
      .outerPadding(0);
    this.yScale = d3.scale.linear();

    this.yScaleOfVolume = d3.scale.linear();

    this._setScales();
  };

  Chart.prototype._setScales = function(){
    this.xScale.range([0, this.containerWidth - this.margin.left - this.margin.right]);
    this.yScale.range([this.containerHeight - this.margin.top - this.margin.bottom, 0]);
    this.yScaleOfVolume.range([this.yScale(0), this.yScale(0.2)]);
  }

  Chart.prototype._createAxis = function(){
    console.log('_createAxis');
    if(!this.isReady) return;

    this.xAxis = d3.svg.axis()
      .scale(this.xScale)
      .orient("bottom");
    this.yAxis = d3.svg.axis()
      .scale(this.yScale)
      .orient("right");
    this.volumeAxis = d3.svg.axis()
      .scale(this.yScaleOfVolume)
      .orient("right")
      .ticks(3)
      .tickFormat(d3.format(",.3s"));
  };

  // should override
  Chart.prototype._createMainPlot = function(){
  };

  Chart.prototype._createAxisAnnotation = function(){
    if(!this.isReady) return;

    this.timeAnnotation = techan.plot.axisannotation()
      .axis(this.xAxis)
      .format(d3.time.format('%Y-%m-%d'))
      .width(65)
      .translate([0, this.containerHeight - this.margin.top - this.margin.bottom]);

    this.ohlcAnnotation = techan.plot.axisannotation()
      .axis(this.yAxis)
      .format(d3.format(',.2fs'))
      .translate([this.xScale(1), 0]);

    this.closeAnnotation = techan.plot.axisannotation()
      .axis(this.yAxis)
      .accessor(this.accessor)
      .format(d3.format(',.2fs'))
      .translate([this.xScale(1), 0]);

    this.volumeAnnotation = techan.plot.axisannotation()
      .axis(this.volumeAxis)
      .width(35);
  }

  Chart.prototype._createCrossHair = function(){
    if(!this.isReady) return;

    this.crosshair = techan.plot.crosshair()
      .xScale(this.xScale)
      .yScale(this.yScale)
      .xAnnotation(this.timeAnnotation)
      .yAnnotation([this.ohlcAnnotation, this.volumeAnnotation]);
  }

  Chart.prototype._initContainer = function(){
    console.log('_initContainer');
    
    this.containerElement = document.getElementById(this.options.container_id);
    // the container width or height is invalid
    if(this.containerElement.offsetWidth<=0 || this.containerElement.offsetHeight<=0){
      return ;
    }

    this.isReady = true;
    this._setChartBasics();
    var _this = this;
    window.onresize = function(){
      _this._onChartContainerResize();
    };

    this.containerSelector = d3.select("body div[id="+this.options.container_id+"]"); 
    this.maxVisiableBars = 120; // TODO: calculate it
  };

  Chart.prototype._setChartBasics = function(){
    // for test
    //var width = document.body.clientWidth * 0.9;
    //var height = document.body.clientHeight * 0.5;
    //this.containerElement.setAttribute("style","width:"+width+"px;"+"height:"+height+"px");

    this.containerWidth = this.containerElement.offsetWidth;
    this.containerHeight = this.containerElement.offsetHeight;
    var scrollWidth = this.containerElement.scrollWidth;
    var clientWidth = this.containerElement.clientWidth;
    console.log('offsetWidth: ' + this.containerWidth + ' ,offsetHeight: ' + this.containerHeight);
    console.log('scrollWidth: ' + scrollWidth);
    console.log('clientWidth: ' + clientWidth);

    this.containerWidth = (this.containerWidth - this.margin.left - this.margin.right) > 10 ? this.containerWidth : 400;
    this.containerHeight = (this.containerHeight - this.margin.top - this.margin.bottom) > 10 ? this.containerHeight : 300;

    console.log('containerWidth: ' + this.containerWidth + ' ,containerHeight: ' + this.containerHeight);
  };

  Chart.prototype._initMainSvg = function(){
    console.log('_initMainSvg');
    if(!this.isReady) return;

    this.mainSvg = this.containerSelector.append("svg")

    var defs = this.mainSvg.append("defs");
    this.rect = defs.append("clipPath")
          .attr("id", "ohlcClip")
      .append("rect")
          .attr("x", 0)
          .attr("y", 0);

    this.mainG  = this.mainSvg.append("g");
    this._setMainSvgSize();
  };

  Chart.prototype._setMainSvgSize = function(){
    this.mainSvg
      .attr("width", this.containerWidth)
      .attr("height", this.containerHeight);
    //this.mainSvg.select("defs clipPath#ohlcClip rect")
    this.rect
      .attr("width", this.containerWidth - this.margin.left - this.margin.right)
      .attr("height", this.containerHeight - this.margin.top - this.margin.bottom);
    this.mainG
      .attr("transform", "translate("+this.margin.left+","+this.margin.top+")");
  };

  // should override
  Chart.prototype._conbine = function(){
  };

  Chart.prototype._afterConbine = function(){
    this._setAxisesSize();
    this.canReInit = false;
  };

  Chart.prototype._setAxisesSize = function(){
    this.mainG.select('g.x.axis')
        .attr("transform", "translate(0," + (this.containerHeight - this.margin.top - this.margin.bottom) + ")");
    this.mainG.select('g.y.axis')
        .attr("transform", "translate(" + this.xScale(1) + ",0)");
  }; 

  Chart.prototype.feedData = function(data){
    console.log('feedData');
    for(var i=0; i < data.length; i++){
      var datum = {
        date: moment(data[i].date || data[i].time).toDate(),
        open: data[i].open,
        high: data[i].high,
        low: data[i].low,
        close: data[i].close,
        volume: data[i].volume
      };
      this.data.push(datum);
    }
    console.log('data:', this.data);
  };

  // should override
  Chart.prototype._bindData = function(){
  };

  // should override
  Chart.prototype.draw = function(){
  };

  Chart.prototype._dataInVisiable = function(){
    var domain = this._domainInVisiable();
    return this.data.slice(domain[0], domain[1]);
  };

  Chart.prototype._domainInVisiable = function(){
    if(this.maxVisiableBars > this.data.length){
      return [0,this.data.length];
    }else{
      return [this.data.length - this.maxVisiableBars,this.data.length];
    }
  };

  Chart.prototype._bindLineData  = function(selection, data) {
    console.log('refreshIndicator');
    var datum = selection.datum();
    if(!datum){ // first time bind data
        selection.datum(data);
        return;
    }
    console.log('data len before bind:', datum.length);
    // Some trickery to remove old and insert new without changing array reference,
    // so no need to update __data__ in the DOM
    datum.splice.apply(datum, [0, datum.length].concat(data));
    console.log('data len after bind:', datum.length);
  }

  Chart.prototype._onChartContainerResize = function(){
    console.log('on resize');
    console.log('_onChartContainerResize');
    this._setChartBasics();
    this._setMainSvgSize();
    this.draw();
  };

  Chart.prototype.drawBars = function(bars){
    this.feedData(bars);
    this.draw();
  };

  Chart.prototype.drawBar = function(bar){
    this.feedData([bar]);
    this.draw();
  };
  Chart.prototype.reInit = function(){
    if(!this.canReInit) return;
    this._init();
    this.draw();
  };

  return Chart;
})();



var TraderLightChart = TraderLightChart || {};

TraderLightChart.LineChart = (function(){

  function Chart(options){
    Chart.superClass.constructor.call(this, options);

    this.accessor = techan.plot.close().accessor();

    this._init();
  }

  TraderLightChart.core.classExtend(Chart, TraderLightChart.BaseChart);

  Chart.prototype._init = function(){
    console.log('_init');

    this._initContainer();
    this._initMainSvg();
    this._createScale();
    this._createAxis();
    this._createMainPlot();
    this._createAxisAnnotation();
    this._createCrossHair()
    this._conbine();
  };

  Chart.prototype._createMainPlot = function(){
    console.log('_createMainPlot');
    if(!this.isReady) return;

    this.mainPlot = techan.plot.close()
      .xScale(this.xScale)
      .yScale(this.yScale);

    this.accessor = this.mainPlot.accessor();

    this.volume = techan.plot.volume()
      .accessor(this.accessor)
      .xScale(this.xScale)
      .yScale(this.yScaleOfVolume);
  };

  Chart.prototype._conbine = function(){
    console.log('_conbine');
    if(!this.isReady) return;

    var ohlcSelection = this.mainG.append("g")
      .attr("class", "ohlc")
      .attr("transform", "translate(0,0)");


    ohlcSelection.append("g")
      .attr("class", "volume")
      .attr("clip-path", "url(#ohlcClip)");

    ohlcSelection.append("g")
      //.attr("class", "candlestick")
      .attr("class", "close")
      .attr("clip-path", "url(#ohlcClip)");

    this.mainG.append('g')
        .attr("class", "x axis");

    this.mainG.append('g')
        .attr("class", "y axis")
      //.append("text")
      //  .attr("transform", "rotate(-90)")
      //  .attr("y", 6)
      //  .attr("dy", ".71em")
      //  .style("text-anchor", "end")
      //  .text("Price ($)");

    this.mainG.append("g")
        .attr("class", "close annotation up");

    this.mainG.append("g")
        .attr("class", "volume axis");

    this.mainG.append('g')
        .attr("class", "crosshair ohlc");

    this._afterConbine();
  };

  Chart.prototype._bindData = function(){
    console.log('_bindData');
    this._bindLineData(this.mainG.select("g.close"), this.data);
    //this.mainG.select("g.candlestick").datum(this.data);
    var lastDatum = this.data[this.data.length-1];
    console.log('lastDatum:', lastDatum);
    this.mainG.select("g.close.annotation").datum([lastDatum]);
    this.mainG.select("g.volume").datum(this.data);
  };

  Chart.prototype.draw = function(){
    if(!this.isReady) return;

    this._bindData();
    console.log('draw');


    //this.xScale.domain(this.data.map(this.accessor.d)); // same as the following line
    this.xScale.domain(techan.scale.plot.time(this.data).domain());
    this.xScale.zoomable().domain(this._domainInVisiable());

    // Update y scale min max, only on viewable zoomable.domain()
    this.yScale.domain(techan.scale.plot.ohlc(this._dataInVisiable()).domain());
    this.yScaleOfVolume.domain(techan.scale.plot.volume(this._dataInVisiable()).domain());

    this.mainG.select('g.x.axis').call(this.xAxis);
    this.mainG.select('g.y.axis').call(this.yAxis);
    this.mainG.select("g.volume.axis").call(this.volumeAxis);

    this.mainG.select("g.close").call(this.mainPlot);
    //this.mainG.select("g.candlestick").call(this.mainPlot);
    this.mainG.select("g.close.annotation").call(this.closeAnnotation);
    this.mainG.select("g.volume").call(this.volume);
    this.mainG.select("g.crosshair.ohlc").call(this.crosshair);
  };
  
  return Chart;
})();


var TraderLightChart = TraderLightChart || {};

TraderLightChart.CandleChart = (function(){

  function CandleChart(options){
    CandleChart.superClass.constructor.call(this, options);

    this._init();
  }

  TraderLightChart.core.classExtend(CandleChart, TraderLightChart.BaseChart);

  CandleChart.prototype._init = function(){
    console.log('_init');
    this.zoomAssociated = false;

    this._initContainer();
    this._initMainSvg();
    this.createBehavior();
    this._createScale();
    this._createAxis();
    this.createIndicators();
    this._createMainPlot();
    this._createAxisAnnotation();
    this._createCrossHair()
    this._conbine();
  };

  CandleChart.prototype.createBehavior = function(){
    var _this = this;
    this.zoom = d3.behavior.zoom()
      .on("zoom", function(){
        _this.zoomed();
      });
  };

  CandleChart.prototype.createIndicators = function(){
    this.sma = techan.plot.sma()
        .xScale(this.xScale)
        .yScale(this.yScale);

    this.smaCalculator = techan.indicator.sma()
        .period(10);
  };

  CandleChart.prototype._createMainPlot = function(){
    console.log('_createMainPlot');
    if(!this.isReady) return;

    this.mainPlot = techan.plot.ohlc()
      .xScale(this.xScale)
      .yScale(this.yScale);

    this.accessor = this.mainPlot.accessor();

    this.volume = techan.plot.volume()
      .accessor(this.accessor)
      .xScale(this.xScale)
      .yScale(this.yScaleOfVolume);
  };

  CandleChart.prototype._conbine = function(){
    console.log('_conbine');
    if(!this.isReady) return;

    var ohlcSelection = this.mainG.append("g")
      .attr("class", "ohlc")
      .attr("transform", "translate(0,0)");

    ohlcSelection.append("g")
      .attr("class", "volume")
      .attr("clip-path", "url(#ohlcClip)");

    ohlcSelection.append("g")
      .attr("class", "candlestick")
      .attr("clip-path", "url(#ohlcClip)");

    ohlcSelection.append("g")
      .attr("class", "indicator sma ma-0")
      .attr("clip-path", "url(#ohlcClip)");

    this.mainG.append('g')
        .attr("class", "x axis");

    this.mainG.append('g')
        .attr("class", "y axis")
      //.append("text")
      //  .attr("transform", "rotate(-90)")
      //  .attr("y", 6)
      //  .attr("dy", ".71em")
      //  .style("text-anchor", "end")
      //  .text("Price ($)");

    this.mainG.append("g")
        .attr("class", "close annotation up");

    this.mainG.append("g")
        .attr("class", "volume axis");

    this.mainG.append('g')
        .attr("class", "crosshair ohlc");

    this._afterConbine();
  };

  CandleChart.prototype._bindData = function(){
    console.log('_bindData');
    this.mainG.select("g.candlestick").datum(this.data);
    var lastDatum = this.data[this.data.length-1];
    console.log('lastDatum:', lastDatum);
    this.mainG.select("g.close.annotation").datum([lastDatum]);
    this._bindLineData(this.mainG.select("g.sma.ma-0"), this.smaCalculator(this.data));
    this.mainG.select("g.volume").datum(this.data);
  };

  CandleChart.prototype.draw = function(){
    if(!this.isReady) return;

    this._bindData();
    console.log('draw');

    //this.xScale.domain(this.data.map(this.accessor.d)); // same as the following line
    this.xScale.domain(techan.scale.plot.time(this.data).domain());
    this.xScale.zoomable().domain(this._domainInVisiable());

    // Update y scale min max, only on viewable zoomable.domain()
    this.yScale.domain(techan.scale.plot.ohlc(this._dataInVisiable()).domain());
    this.yScaleOfVolume.domain(techan.scale.plot.volume(this._dataInVisiable()).domain());

    this.mainG.select('g.x.axis').call(this.xAxis);
    this.mainG.select('g.y.axis').call(this.yAxis);
    this.mainG.select("g.volume.axis").call(this.volumeAxis);

    this.mainG.select("g.candlestick").call(this.mainPlot);
    this.mainG.select("g.close.annotation").call(this.closeAnnotation);
    this.mainG.select("g .sma.ma-0").call(this.sma);
    this.mainG.select("g.volume").call(this.volume);
    this.mainG.select("g.crosshair.ohlc").call(this.crosshair).call(this.zoom);

    // Associate the zoom with the scale after a domain has been applied
    if(!this.zoomAssociated){
      console.log('zoomAssociated');
      console.log('zoomable:', this.xScale.zoomable());
      console.log('zoomable:', this.xScale.zoomable());
      this.zoom.x(this.xScale.zoomable()).y(this.yScale);
      this.zoomAssociated = true;
    }
  };

  CandleChart.prototype.zoomed = function(rect){
    console.log('zoomed');
    this.zoom.translate();
    //this.zoom.scale();

    this.mainG.select('g.x.axis').call(this.xAxis);
    this.mainG.select('g.y.axis').call(this.yAxis);
    this.mainG.select("g.volume.axis").call(this.volumeAxis);

    this.mainG.select("g.candlestick").call(this.mainPlot.refresh);
    this.mainG.select("g.close.annotation").call(this.closeAnnotation.refresh);
    this.mainG.select("g .sma.ma-0").call(this.sma.refresh);
    this.mainG.select("g.volume").call(this.volume.refresh);
    this.mainG.select("g.crosshair.ohlc").call(this.crosshair.refresh);
  };

  return CandleChart;
})();
