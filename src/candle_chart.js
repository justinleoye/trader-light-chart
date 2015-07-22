var TraderLightChart = TraderLightChart || {};

TraderLightChart.CandleChart = (function(){

  function Chart(options){
    Chart.superClass.constructor.call(this, options);

    this._init();
  }

  TraderLightChart.core.classExtend(Chart, TraderLightChart.BaseChart);

  Chart.prototype._init = function(){
    //console.log('_init');

    this._initContainer();
    this._initMainSvg();
    this.createBehavior();
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

  Chart.prototype.createBehavior = function(){
    var _this = this;
    this.zoom = d3.behavior.zoom()
      .on("zoom", function(){
        _this.zoomed();
      });
    this.xyZoom = d3.behavior.zoom();
  };

  Chart.prototype._createMainPlot = function(){
    //console.log('_createMainPlot');
    if(!this.isReady) return;

    //this.mainPlot = techan.plot.ohlc()
    this.mainPlot = techan.plot.candlestick()
      .xScale(this.timeScale)
      .yScale(this.yScale);

    this.accessor = this.mainPlot.accessor();

    this.volume = techan.plot.volume()
      .accessor(techan.accessor.ohlc())
      .xScale(this.timeScale)
      .yScale(this.yScaleOfVolume);
  };

  Chart.prototype._conbineMainPlot = function(){
    this.ohlcSelection.append("g")
      .attr("class", "candlestick")
      .attr("clip-path", "url(#ohlcClip)");
  };

  Chart.prototype._bindMainPlot = function(){
    this.mainG.select("g.candlestick").datum(this.data);
  };

  Chart.prototype._setYScaleDomain = function(){
    // Update y scale min max, only on viewable zoomable.domain()
    this.yScale.domain(techan.scale.plot.ohlc(this._dataInVisiable()).domain());
    this.yScaleOfVolume.domain(techan.scale.plot.volume(this._dataInVisiable(), this.accessor.v).domain());
  };

  Chart.prototype.draw = function(){
    if(!this.isReady) return;
    Chart.superClass.draw.call(this);

    // Associate the zoom with the scale after a domain has been applied
    this._setXyZoom();
  };
  Chart.prototype._drawMainPlot = function(){
    this.mainG.select("g.candlestick").call(this.mainPlot);
  };

  Chart.prototype._drawCrosshair = function(){
    if(this.zoomable || this.movable){
      this.mainG.select("g.crosshair.ohlc").call(this.crosshair).call(this.zoom);
    }
    else
      Chart.superClass._drawCrosshair.call(this);
  };

  Chart.prototype.zoomed = function(){

    var tran = this.zoom.translate();
    console.log('tran:',tran);
    if(this.movable)
      this._setRightOffset(this._widthToBarOffset(tran[0]));
    if(this.zoomable)
      this.xyZoom.scale(this.zoom.scale());

    this._setYScaleDomain();
    this._drawAxises();

    this._refreshMainPlot();
    //this.mainG.select("g.line-close.annotation").call(this.closeAnnotation.refresh);
    //this.mainG.select("g .sma.ma-0").call(this.sma.refresh);
    this._refreshStudies();
    this._refreshVolume();
    this._refreshCrosshair();
    this._refreshSupstances();
    this._refreshTrendline();
  };

  Chart.prototype._refreshMainPlot = function(){
    this.mainG.select("g.candlestick").call(this.mainPlot.refresh);
  };

  Chart.prototype.enableZoomable = function(zoomable){
    if(typeof zoomable != 'boolean') return;
    this.zoomable = zoomable;
  };

  Chart.prototype.enableMovable = function(movable){
    if(typeof movable != 'boolean') return;
    this.movable = movable;
  };

  return Chart;
})();
