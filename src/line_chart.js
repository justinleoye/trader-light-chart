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
    this._createTrendline();
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
      .xScale(this.timeScale)
      .yScale(this.yScale);

    this.accessor = this.mainPlot.accessor();

    this.volume = techan.plot.volume()
      .accessor(techan.accessor.ohlc())
      .xScale(this.timeScale)
      .yScale(this.yScaleOfVolume);
  };

  Chart.prototype._createYAxis = function(){
    this.yAxisRight = d3.svg.axis()
      .scale(this.yScale)
      .orient("right");
    this.yAxisLeft = d3.svg.axis()
      .scale(this.yPercentScale)
      .orient("right")
      .tickFormat(d3.format('+.1%'));
  };

  Chart.prototype._conbineMainPlot = function(){
    this.ohlcSelection.append("g")
      .attr("class", "line-close")
      .attr("clip-path", "url(#ohlcClip)");
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
      if(this.data.length>0 && datum.date < this.data[this.data.length-1].date) continue;
      this.data.push(datum);
    }
  };

  Chart.prototype._bindMainPlot = function(){
    this._bindLineData(this.mainG.select("g.line-close"), this.data);
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

  Chart.prototype._drawMainPlot = function(){
    this.mainG.select("g.line-close").call(this.mainPlot);
  };

  return Chart;
})();
