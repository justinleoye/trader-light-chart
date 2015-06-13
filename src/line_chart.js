var TraderLightChart = TraderLightChart || {};

TraderLightChart.LineChart = (function(){

  function Chart(options){
    Chart.superClass.constructor.call(this, options);

    this.accessor = techan.plot.close().accessor();

    this._init();
  }

  TraderLightChart.core.classExtend(Chart, TraderLightChart.BaseChart);

  Chart.prototype._init = function(){
    //console.log('_init');

    this._initContainer();
    this._initMainSvg();
    this._createScale();
    this._createAxis();
    this._createMainPlot();
    this._createAxisAnnotation();
    this._setAxisAnnotation();
    this._createSupstance();
    this._createCrossHair();
    this._conbine();
  };

  Chart.prototype._createMainPlot = function(){
    //console.log('_createMainPlot');
    if(!this.isReady) return;

    this.mainPlot = techan.plot.close()
      .xScale(this.xScale)
      .yScale(this.yScale);

    this.accessor = this.mainPlot.accessor();

    this.volume = techan.plot.volume()
      .accessor(techan.accessor.ohlc())
      .xScale(this.xScale)
      .yScale(this.yScaleOfVolume);
  };

  Chart.prototype._createAxis = function(){
    //console.log('_createAxis');
    if(!this.isReady) return;

    console.log('this.timeScale:', this.timeScale);
    this.xAxis = d3.svg.axis()
      //.scale(this.xScale)
      .scale(this.timeScale)
      .orient("bottom");
    this.yAxisRight = d3.svg.axis()
      .scale(this.yScale)
      .orient("right");
    this.yAxisLeft = d3.svg.axis()
      .scale(this.yPercentScale)
      //.orient("left")
      .orient("right")
      .tickFormat(d3.format('+.1%'));

    //this.volumeAxis = d3.svg.axis()
    //  .scale(this.yScaleOfVolume)
    //  .orient("right")
    //  .ticks(3)
    //  .tickFormat(d3.format(",.3s"));
  };

  Chart.prototype._conbine = function(){
    //console.log('_conbine');
    if(!this.isReady) return;

    var ohlcSelection = this.mainG.append("g")
      .attr("class", "ohlc")
      .attr("transform", "translate(0,0)");


    ohlcSelection.append("g")
      .attr("class", "volume")
      .attr("clip-path", "url(#ohlcClip)");

    this._conbineAxises();

    ohlcSelection.append("g")
      //.attr("class", "candlestick")
      .attr("class", "close")
      .attr("clip-path", "url(#ohlcClip)");

    //this.mainG.append("g")
    //    .attr("class", "close annotation up");

    //this.mainG.append("g")
    //    .attr("class", "volume axis");

    this.mainG.append('g')
        .attr("class", "crosshair ohlc");

    this.mainG.append("g")
            .attr("class", "supstances analysis")
            .attr("clip-path", "url(#ohlcClip)");

    this._afterConbine();
  };

  Chart.prototype._conbineAxises = function(){
    this.mainG.append('g')
        .attr("class", "x axis");

    this.mainG.append('g')
        .attr("class", "y axis right")
      //.append("text")
      //  .attr("transform", "rotate(-90)")
      //  .attr("y", 6)
      //  .attr("dy", ".71em")
      //  .style("text-anchor", "end")
      //  .text("Price ($)");

    this.mainG.append('g')
        .attr("class", "y axis left")
  };

  Chart.prototype.feedData = function(data){
    for(var i=0; i < data.length; i++){
      var datum = this._pretreatData(data[i]);
      // TODO: isIntraday()
      if(this.options.interval == '1'){
        if(this.data.length > 0){
          datum.open = this.data[this.data.length-1].close;
        }else{ // the first feed datum
          datum.open = this.baseDatum&&this.baseDatum.close ? this.baseDatum.close : datum.close;
        }
      }
      this.data.push(datum);
    }
  };

  Chart.prototype._bindData = function(){
    //console.log('_bindData');
    this._bindLineData(this.mainG.select("g.close"), this.data);
    //this.mainG.select("g.candlestick").datum(this.data);
    var lastDatum = this.data[this.data.length-1];
    //console.log('lastDatum:', lastDatum);
    //this.mainG.select("g.close.annotation").datum([lastDatum]);
    this.mainG.select("g.volume").datum(this.data);
  };

  Chart.prototype._setYScaleDomain = function(){
    // Update y scale min max, only on viewable zoomable.domain()
    var yDomain = techan.scale.plot.ohlc(this._dataInVisiable()).domain();
    yDomain = this.symmetrizeYScaleDomain(yDomain);
    //console.log('yDomain:', yDomain);
    this.yScale.domain(yDomain);
    var percentDomain = techan.scale.plot.percent(this.yScale, this.accessor(this.getBaseDatum())).domain();
    percentDomain = this.symmetrizePercentDomain(percentDomain);
    //console.log('percentDomain:', percentDomain);
    this.yPercentScale.domain(percentDomain);
    this.yScaleOfVolume.domain(techan.scale.plot.volume(this._dataInVisiable(), this.accessor.v).domain());
  };

  Chart.prototype.draw = function(){
    if(!this.isReady) return;

    if(this.data.length < this.maxVisiableBars) this._setXScale();

    this._bindData();
    //console.log('draw');

    this._drawAxises();

    this.mainG.select("g.close").call(this.mainPlot);
    //this.mainG.select("g.candlestick").call(this.mainPlot);
    //this.mainG.select("g.close.annotation").call(this.closeAnnotation);
    this.mainG.select("g.volume").call(this.volume);
    this.mainG.select("g.crosshair.ohlc").call(this.crosshair);
    this._drawSupstances();
  };

  Chart.prototype._drawAxises = function(){

    this._setXScaleDomain();
    this._setTimeScaleDomain();
    this._setYScaleDomain();

    this.mainG.select('g.x.axis').call(this.xAxis);
    this.mainG.select('g.y.axis.right').call(this.yAxisRight);
    this.mainG.select('g.y.axis.left').call(this.yAxisLeft);
    //this.mainG.select("g.volume.axis").call(this.volumeAxis);

  };

  return Chart;
})();
