var TraderLightChart = TraderLightChart || {};

TraderLightChart.CandleChart = (function(){
  var margin = {
    top: 20,
    bottom: 30,
    left: 50,
    right: 50
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
    this.zoomAssociated = false;

    this.initContainer();
    this.initMainSvg();
    this.createBehavior();
    this.createScale();
    this.createAxis();
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
      .orient("right");
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
      .translate([0, this.containerHeight-margin.top-margin.bottom]);

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

  CandleChart.prototype.feedData = function(data){
    console.log('feedData');
    this.data = this.data.concat(data);
    console.log('data:', this.data);
  };

  CandleChart.prototype.bindData = function(){
    console.log('bindData');
    this.mainSvg.select("g.candlestick").datum(this.data);
    var lastDatum = this.data[this.data.length-1];
    console.log('lastDatum:', lastDatum);
    this.mainSvg.select("g.close.annotation").datum([lastDatum]);
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

  CandleChart.prototype.dataInVisiable = function(){
    var domain = this.domainInVisiable();
    return this.data.slice(domain[0], domain[1]);
  };

  CandleChart.prototype.domainInVisiable = function(){
    if(this.maxVisiableBars > this.data.length){
      return [0,this.data.length];
    }else{
      return [this.data.length - this.maxVisiableBars,this.data.length];
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
    this.mainSvg.select("g.volume").call(this.volume.refresh);
    this.mainSvg.select("g.crosshair.ohlc").call(this.crosshair.refresh);
  };

  return CandleChart;
})();
