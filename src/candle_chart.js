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
