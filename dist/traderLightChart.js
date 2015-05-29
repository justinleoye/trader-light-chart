var TraderLightChart = TraderLightChart || {};
TraderLightChart.core = TraderLightChart.core || {};

(function(core){
  core.getContainerWidth = function(){
  };

  core.getContainerHeight = function(){
  };


})(TraderLightChart.core);


var TraderLightChart = TraderLightChart || {};

TraderLightChart.LineChart = (function(){
  var margin = {
    top: 50,
    bottom: 5,
    left: 5,
    right: 5
  };

  function LineChart(options){
    this.options = {
      container_id: 'trader_line_chart_container',
    };

    this.init();
  }

  LineChart.prototype.init = function(){
    console.log('init');
    this.data = [];

    this.initContainer();
    this.initMainSvg();
    this.createScale();
    this.createAxis();
    this.createMainPlot();
    this.conbine();
  };

  LineChart.prototype.createScale = function(){
    console.log('createScale');
    this.xScale = techan.scale.financetime()
      .range([0, this.containerWidth])
      .outerPadding(0);
    this.yScale = d3.scale.linear()
      .range([this.containerHeight, 0]);
  };

  LineChart.prototype.createAxis = function(){
    console.log('createAxis');
    this.xAxis = d3.svg.axis()
      .scale(this.xScale)
      .orient("top");
    this.yAxis = d3.svg.axis()
      .scale(this.yScale)
      .orient("right");
  };

  LineChart.prototype.createMainPlot = function(){
    console.log('createMainPlot');
    this.mainPlot = techan.plot.close()
      .xScale(this.xScale)
      .yScale(this.yScale);

    this.accessor = this.mainPlot.accessor();
  };


  LineChart.prototype.initContainer = function(){
    console.log('initContainer');
    this.containerSelector = d3.select("body div[id="+this.options.container_id+"]"); 
    //this.containerSelector = d3.select("body"); 
    //this.containerWidth = this.containerSelector.clientWidth;
    this.containerWidth = 600;
    //this.containerHeight = this.containerSelector.clientHeight;
    this.containerHeight = 300;
    console.log('containerWidth:',this.containerWidth);
    console.log('containerHeight:',this.containerHeight);
  };

  LineChart.prototype.initMainSvg = function(){
    console.log('initMainSvg');
    this.mainSvg = this.containerSelector.append("svg")
      .attr("width", this.containerWidth)
      .attr("height", this.containerHeight)
      .append("g")
      .attr("transform", "translate("+margin.left+","+margin.top+")");
  };

  LineChart.prototype.conbine = function(){
    console.log('conbine');

    this.mainSvg.append('g')
      .attr("class", "close");

    this.mainSvg.append('g')
        .attr("class", "x axis")
        .attr("transform", "translate(0," + (this.containerHeight - margin.top) + ")");

    this.mainSvg.append('g')
        .attr("class", "y axis")
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Price ($)");
  };

  LineChart.prototype.feedData = function(data){
    console.log('feedData');
    this.data = this.data.concat(data);
    console.log('data:', this.data);
  };

  LineChart.prototype.bindData = function(){
    console.log('bindData');
    this.mainSvg.select('g.close').datum(this.data);
  };

  LineChart.prototype.draw = function(){
    console.log('draw');
    this.bindData();

    this.xScale.domain(this.data.map(this.accessor.d));
    this.yScale.domain(techan.scale.plot.ohlc(this.data, this.accessor).domain());

    this.mainSvg.select('g.x.axis').call(this.xAxis);
    this.mainSvg.select('g.y.axis').call(this.yAxis);
    this.mainSvg.select('g.close').call(this.mainPlot);
  };

  return LineChart;
})();


var TraderLightChart = TraderLightChart || {};

TraderLightChart.CandleChart = (function(){
  var margin = {
    top: 20,
    bottom: 30,
    left: 50,
    right: 20
  };

  function CandleChart(options){
    this.options = {
      container_id: 'trader_candle_chart_container',
    };

    this.init();
  }

  CandleChart.prototype.init = function(){
    console.log('init');
    this.data = [];

    this.initContainer();
    this.initMainSvg();
    this.createScale();
    this.createAxis();
    this.createMainPlot();
    this.createAxisAnnotation();
    this.createCrossHair()
    this.conbine();
  };

  CandleChart.prototype.createScale = function(){
    console.log('createScale');
    this.xScale = techan.scale.financetime()
      .range([0, this.containerWidth-margin.left-margin.right])
      .outerPadding(0);
    this.yScale = d3.scale.linear()
      .range([this.containerHeight-margin.top-margin.bottom, 0]);

    this.yScaleOfVolume = d3.scale.linear() 
      .range([this.yScale(0), this.yScale(0.2)]);
  };

  CandleChart.prototype.createAxis = function(){
    console.log('createAxis');
    this.xAxis = d3.svg.axis()
      .scale(this.xScale)
      .orient("bottom");
    this.yAxis = d3.svg.axis()
      .scale(this.yScale)
      .orient("left");
    this.volumeAxis = d3.svg.axis()
      .scale(this.yScaleOfVolume)
      .orient("right")
      .ticks(3)
      .tickFormat(d3.format(",.3s"));
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

  CandleChart.prototype.createAxisAnnotation = function(){
    this.timeAnnotation = techan.plot.axisannotation()
      .axis(this.xAxis)
      .format(d3.time.format('%Y-%m-%d'))
      .width(65)
      .translate([0, this.containerHeight]);

    this.ohlcAnnotation = techan.plot.axisannotation()
      .axis(this.yAxis)
      .format(d3.format(',.2fs'));

    this.volumeAnnotation = techan.plot.axisannotation()
      .axis(this.volumeAxis)
      .width(35);
  }

  CandleChart.prototype.createCrossHair = function(){
    this.crosshair = techan.plot.crosshair()
      .xScale(this.xScale)
      .yScale(this.yScale)
      .xAnnotation(this.timeAnnotation)
      .yAnnotation([this.ohlcAnnotation, this.volumeAnnotation]);
  }

  CandleChart.prototype.initContainer = function(){
    console.log('initContainer');
    this.containerSelector = d3.select("body div[id="+this.options.container_id+"]"); 
    //this.containerSelector = d3.select("body"); 
    //this.containerWidth = this.containerSelector.clientWidth;
    this.containerWidth = 600;
    //this.containerHeight = this.containerSelector.clientHeight;
    this.containerHeight = 300;
    console.log('containerWidth:',this.containerWidth);
    console.log('containerHeight:',this.containerHeight);
    this.maxVisiableBars = 120; // TODO: calculate it
  };

  CandleChart.prototype.initMainSvg = function(){
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
          .attr("width", this.containerWidth-margin.left-margin.right)
          .attr("height", this.containerHeight-margin.top-margin.bottom);

    this.mainSvg  = svg.append("g")
      .attr("transform", "translate("+margin.left+","+margin.top+")");
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

    this.mainSvg.append('g')
        .attr("class", "x axis")
        .attr("transform", "translate(0," + (this.containerHeight - margin.top - margin.bottom) + ")");

    this.mainSvg.append('g')
        .attr("class", "y axis")
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Price ($)");

    this.mainSvg.append("g")
            .attr("class", "volume axis");

    this.mainSvg.append('g')
            .attr("class", "crosshair ohlc");
  };

  CandleChart.prototype.feedData = function(data){
    console.log('feedData');
    this.data = this.data.concat(data);
    console.log('data:', this.data);
  };

  CandleChart.prototype.bindData = function(){
    console.log('bindData');
    this.mainSvg.select("g.candlestick").datum(this.data);
    this.mainSvg.select("g.volume").datum(this.data);
  };

  CandleChart.prototype.draw = function(){
    console.log('draw');
    var barWidth = this.xScale.band()*this.data.length;
    console.log('barWidth:', barWidth);

    this.bindData();

    this.xScale.domain(this.data.map(this.accessor.d));
    this.xScale.zoomable().domain([0, this.maxVisiableBars]);
    this.yScale.domain(techan.scale.plot.ohlc(this.data.slice(this.data.length-this.maxVisiableBars, this.data.length)).domain());
    this.yScaleOfVolume.domain(techan.scale.plot.volume(this.data.slice(this.data.length-this.maxVisiableBars, this.data.length)).domain());

    this.mainSvg.select('g.x.axis').call(this.xAxis);
    this.mainSvg.select('g.y.axis').call(this.yAxis);
    this.mainSvg.select("g.volume.axis").call(this.volumeAxis);

    this.mainSvg.select("g.candlestick").call(this.mainPlot);
    this.mainSvg.select("g.volume").call(this.volume);
    this.mainSvg.select("g.crosshair.ohlc").call(this.crosshair);
  };

  return CandleChart;
})();
