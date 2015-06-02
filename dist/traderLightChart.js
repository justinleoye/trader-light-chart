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

})(TraderLightChart.core);

TraderLightChart.BaseChart = (function(){
  function Chart(options){

    this.margin = {
      top: 20,
      bottom: 30,
      left: 50,
      right: 50
    };

    this.data = [];
  }

  // should override
  Chart.prototype.init = function(){
  };

  Chart.prototype.createScale = function(){
    console.log('createScale');
    this.xScale = techan.scale.financetime()
      .range([0, this.containerWidth - this.margin.left - this.margin.right])
      .outerPadding(0);
    this.yScale = d3.scale.linear()
      .range([this.containerHeight - this.margin.top - this.margin.bottom, 0]);

    this.yScaleOfVolume = d3.scale.linear() 
      .range([this.yScale(0), this.yScale(0.2)]);
  };

  Chart.prototype.createAxis = function(){
    console.log('createAxis');
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
  Chart.prototype.createMainPlot = function(){
  };

  Chart.prototype.createAxisAnnotation = function(){
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

  Chart.prototype.createCrossHair = function(){
    this.crosshair = techan.plot.crosshair()
      .xScale(this.xScale)
      .yScale(this.yScale)
      .xAnnotation(this.timeAnnotation)
      .yAnnotation([this.ohlcAnnotation, this.volumeAnnotation]);
  }

  Chart.prototype.initContainer = function(){
    console.log('initContainer');
    var containerElement = document.getElementById(this.options.container_id);
    this.containerWidth = containerElement.getAttribute('width');
    this.containerHeight = containerElement.getAttribute('height');;

    this.containerSelector = d3.select("body div[id="+this.options.container_id+"]"); 
    this.maxVisiableBars = 120; // TODO: calculate it
  };

  Chart.prototype.initMainSvg = function(){
    console.log('initMainSvg');
    var svg = this.containerSelector.append("svg")
      .attr("width", this.containerWidth)
      .attr("height", this.containerHeight);

    var defs = svg.append("defs");
    defs.append("clipPath")
          .attr("id", "ohlcClip")
      .append("rect")
          .attr("x", 0)
          .attr("y", 0)
          .attr("width", this.containerWidth - this.margin.left - this.margin.right)
          .attr("height", this.containerHeight - this.margin.top - this.margin.bottom);

    this.mainSvg  = svg.append("g")
      .attr("transform", "translate("+this.margin.left+","+this.margin.top+")");
  };

  // should override
  Chart.prototype.conbine = function(){
  };

  Chart.prototype.feedData = function(data){
    console.log('feedData');
    this.data = this.data.concat(data);
    console.log('data:', this.data);
  };

  // should override
  Chart.prototype.bindData = function(){
  };

  // should override
  Chart.prototype.draw = function(){
  };

  Chart.prototype.dataInVisiable = function(){
    var domain = this.domainInVisiable();
    return this.data.slice(domain[0], domain[1]);
  };

  Chart.prototype.domainInVisiable = function(){
    if(this.maxVisiableBars > this.data.length){
      return [0,this.data.length];
    }else{
      return [this.data.length - this.maxVisiableBars,this.data.length];
    }
  };

  Chart.prototype.bindLineData  = function(selection, data) {
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

  return Chart;
})();



var TraderLightChart = TraderLightChart || {};

TraderLightChart.LineChart = (function(){

  function Chart(options){
    Chart.superClass.constructor.call(this, options);
    this.options = {
      container_id: 'trader_line_chart_container',
    };

    this.init();
  }

  TraderLightChart.core.classExtend(Chart, TraderLightChart.BaseChart);

  Chart.prototype.init = function(){
    console.log('init');

    this.initContainer();
    this.initMainSvg();
    this.createScale();
    this.createAxis();
    this.createMainPlot();
    this.createAxisAnnotation();
    this.createCrossHair()
    this.conbine();
  };

  Chart.prototype.createMainPlot = function(){
    console.log('createMainPlot');
    this.mainPlot = techan.plot.close()
      .xScale(this.xScale)
      .yScale(this.yScale);

    this.accessor = this.mainPlot.accessor();

    this.volume = techan.plot.volume()
      .accessor(this.accessor)
      .xScale(this.xScale)
      .yScale(this.yScaleOfVolume);
  };

  Chart.prototype.conbine = function(){
    console.log('conbine');

    var ohlcSelection = this.mainSvg.append("g")
      .attr("class", "ohlc")
      .attr("transform", "translate(0,0)");


    ohlcSelection.append("g")
      .attr("class", "volume")
      .attr("clip-path", "url(#ohlcClip)");

    ohlcSelection.append("g")
      //.attr("class", "candlestick")
      .attr("class", "close")
      .attr("clip-path", "url(#ohlcClip)");

    this.mainSvg.append('g')
        .attr("class", "x axis")
        .attr("transform", "translate(0," + (this.containerHeight - this.margin.top - this.margin.bottom) + ")");

    this.mainSvg.append('g')
        .attr("class", "y axis")
        .attr("transform", "translate(" + this.xScale(1) + ",0)")
      //.append("text")
      //  .attr("transform", "rotate(-90)")
      //  .attr("y", 6)
      //  .attr("dy", ".71em")
      //  .style("text-anchor", "end")
      //  .text("Price ($)");

    this.mainSvg.append("g")
        .attr("class", "close annotation up");

    this.mainSvg.append("g")
        .attr("class", "volume axis");

    this.mainSvg.append('g')
        .attr("class", "crosshair ohlc");
  };

  Chart.prototype.bindData = function(){
    console.log('bindData');
    this.bindLineData(this.mainSvg.select("g.close"), this.data);
    //this.mainSvg.select("g.candlestick").datum(this.data);
    var lastDatum = this.data[this.data.length-1];
    console.log('lastDatum:', lastDatum);
    this.mainSvg.select("g.close.annotation").datum([lastDatum]);
    this.mainSvg.select("g.volume").datum(this.data);
  };

  Chart.prototype.draw = function(){
    console.log('draw');

    this.bindData();

    //this.xScale.domain(this.data.map(this.accessor.d)); // same as the following line
    this.xScale.domain(techan.scale.plot.time(this.data).domain());
    this.xScale.zoomable().domain(this.domainInVisiable());

    // Update y scale min max, only on viewable zoomable.domain()
    this.yScale.domain(techan.scale.plot.ohlc(this.dataInVisiable()).domain());
    this.yScaleOfVolume.domain(techan.scale.plot.volume(this.dataInVisiable()).domain());

    this.mainSvg.select('g.x.axis').call(this.xAxis);
    this.mainSvg.select('g.y.axis').call(this.yAxis);
    this.mainSvg.select("g.volume.axis").call(this.volumeAxis);

    this.mainSvg.select("g.close").call(this.mainPlot);
    //this.mainSvg.select("g.candlestick").call(this.mainPlot);
    this.mainSvg.select("g.close.annotation").call(this.closeAnnotation);
    this.mainSvg.select("g.volume").call(this.volume);
    this.mainSvg.select("g.crosshair.ohlc").call(this.crosshair);

  };
  
  return Chart;
})();


var TraderLightChart = TraderLightChart || {};

TraderLightChart.CandleChart = (function(){

  function CandleChart(options){
    CandleChart.superClass.constructor.call(this, options);
    this.options = {
      container_id: 'trader_candle_chart_container',
    };

    this.init();
  }

  TraderLightChart.core.classExtend(CandleChart, TraderLightChart.BaseChart);

  CandleChart.prototype.init = function(){
    console.log('init');
    this.zoomAssociated = false;

    this.initContainer();
    this.initMainSvg();
    this.createBehavior();
    this.createScale();
    this.createAxis();
    this.createIndicators();
    this.createMainPlot();
    this.createAxisAnnotation();
    this.createCrossHair()
    this.conbine();
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

  CandleChart.prototype.createMainPlot = function(){
    console.log('createMainPlot');
    this.mainPlot = techan.plot.ohlc()
      .xScale(this.xScale)
      .yScale(this.yScale);

    this.accessor = this.mainPlot.accessor();

    this.volume = techan.plot.volume()
      .accessor(this.accessor)
      .xScale(this.xScale)
      .yScale(this.yScaleOfVolume);
  };

  CandleChart.prototype.conbine = function(){
    console.log('conbine');

    var ohlcSelection = this.mainSvg.append("g")
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

    this.mainSvg.append('g')
        .attr("class", "x axis")
        .attr("transform", "translate(0," + (this.containerHeight - this.margin.top - this.margin.bottom) + ")");

    this.mainSvg.append('g')
        .attr("class", "y axis")
        .attr("transform", "translate(" + this.xScale(1) + ",0)")
      //.append("text")
      //  .attr("transform", "rotate(-90)")
      //  .attr("y", 6)
      //  .attr("dy", ".71em")
      //  .style("text-anchor", "end")
      //  .text("Price ($)");

    this.mainSvg.append("g")
        .attr("class", "close annotation up");

    this.mainSvg.append("g")
        .attr("class", "volume axis");

    this.mainSvg.append('g')
        .attr("class", "crosshair ohlc");
  };

  CandleChart.prototype.bindData = function(){
    console.log('bindData');
    this.mainSvg.select("g.candlestick").datum(this.data);
    var lastDatum = this.data[this.data.length-1];
    console.log('lastDatum:', lastDatum);
    this.mainSvg.select("g.close.annotation").datum([lastDatum]);
    this.bindLineData(this.mainSvg.select("g.sma.ma-0"), this.smaCalculator(this.data));
    this.mainSvg.select("g.volume").datum(this.data);
  };

  CandleChart.prototype.draw = function(){
    console.log('draw');

    this.bindData();

    //this.xScale.domain(this.data.map(this.accessor.d)); // same as the following line
    this.xScale.domain(techan.scale.plot.time(this.data).domain());
    this.xScale.zoomable().domain(this.domainInVisiable());

    // Update y scale min max, only on viewable zoomable.domain()
    this.yScale.domain(techan.scale.plot.ohlc(this.dataInVisiable()).domain());
    this.yScaleOfVolume.domain(techan.scale.plot.volume(this.dataInVisiable()).domain());

    this.mainSvg.select('g.x.axis').call(this.xAxis);
    this.mainSvg.select('g.y.axis').call(this.yAxis);
    this.mainSvg.select("g.volume.axis").call(this.volumeAxis);

    this.mainSvg.select("g.candlestick").call(this.mainPlot);
    this.mainSvg.select("g.close.annotation").call(this.closeAnnotation);
    this.mainSvg.select("g .sma.ma-0").call(this.sma);
    this.mainSvg.select("g.volume").call(this.volume);
    this.mainSvg.select("g.crosshair.ohlc").call(this.crosshair).call(this.zoom);

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

    this.mainSvg.select('g.x.axis').call(this.xAxis);
    this.mainSvg.select('g.y.axis').call(this.yAxis);
    this.mainSvg.select("g.volume.axis").call(this.volumeAxis);

    this.mainSvg.select("g.candlestick").call(this.mainPlot.refresh);
    this.mainSvg.select("g.close.annotation").call(this.closeAnnotation.refresh);
    this.mainSvg.select("g .sma.ma-0").call(this.sma.refresh);
    this.mainSvg.select("g.volume").call(this.volume.refresh);
    this.mainSvg.select("g.crosshair.ohlc").call(this.crosshair.refresh);
  };

  return CandleChart;
})();
