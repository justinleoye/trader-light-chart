var TraderLightChart = TraderLightChart || {};

TraderLightChart.LineChart = (function(){

  function Chart(options){
    Chart.superClass.constructor.call(this, options);

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

    this.setAxisesSize();
  };

  Chart.prototype.bindData = function(){
    console.log('bindData');
    this.bindLineData(this.mainG.select("g.close"), this.data);
    //this.mainG.select("g.candlestick").datum(this.data);
    var lastDatum = this.data[this.data.length-1];
    console.log('lastDatum:', lastDatum);
    this.mainG.select("g.close.annotation").datum([lastDatum]);
    this.mainG.select("g.volume").datum(this.data);
  };

  Chart.prototype.draw = function(){
    this.bindData();
    console.log('draw');


    //this.xScale.domain(this.data.map(this.accessor.d)); // same as the following line
    this.xScale.domain(techan.scale.plot.time(this.data).domain());
    this.xScale.zoomable().domain(this.domainInVisiable());

    // Update y scale min max, only on viewable zoomable.domain()
    this.yScale.domain(techan.scale.plot.ohlc(this.dataInVisiable()).domain());
    this.yScaleOfVolume.domain(techan.scale.plot.volume(this.dataInVisiable()).domain());

    this.mainG.select('g.x.axis').call(this.xAxis);
    this.mainG.select('g.y.axis').call(this.yAxis);
    this.mainG.select("g.volume.axis").call(this.volumeAxis);

    this.mainG.select("g.close").call(this.mainPlot);
    //this.mainG.select("g.candlestick").call(this.mainPlot);
    this.mainG.select("g.close.annotation").call(this.closeAnnotation);
    this.mainG.select("g.volume").call(this.volume);
    this.mainG.select("g.crosshair.ohlc").call(this.crosshair);

    this.afterConbine();
  };
  
  return Chart;
})();
