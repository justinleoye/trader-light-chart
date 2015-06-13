var TraderLightChart = TraderLightChart || {};

TraderLightChart.CandleChart = (function(){

  function Chart(options){
    Chart.superClass.constructor.call(this, options);

    this._init();
    this.studies = [];
  }

  TraderLightChart.core.classExtend(Chart, TraderLightChart.BaseChart);

  Chart.prototype._init = function(){
    //console.log('_init');
    this.zoomAssociated = false;

    this._initContainer();
    this._initMainSvg();
    this.createBehavior();
    this._createScale();
    this._createAxis();
    this._createMainPlot();
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
  };

  Chart.prototype._createMainPlot = function(){
    //console.log('_createMainPlot');
    if(!this.isReady) return;

    //this.mainPlot = techan.plot.ohlc()
    this.mainPlot = techan.plot.candlestick()
      .xScale(this.xScale)
      .yScale(this.yScale);

    this.accessor = this.mainPlot.accessor();

    this.volume = techan.plot.volume()
      .accessor(techan.accessor.ohlc())
      .xScale(this.xScale)
      .yScale(this.yScaleOfVolume);
  };

  Chart.prototype._conbine = function(){
    //console.log('_conbine');
    if(!this.isReady) return;

    this.ohlcSelection = this.mainG.append("g")
      .attr("class", "ohlc")
      .attr("transform", "translate(0,0)");

    this.ohlcSelection.append("g")
      .attr("class", "volume")
      .attr("clip-path", "url(#ohlcClip)");

    this.ohlcSelection.append("g")
      .attr("class", "candlestick")
      .attr("clip-path", "url(#ohlcClip)");

    //this.ohlcSelection.append("g")
    //  .attr("class", "indicator sma ma-0")
    //  .attr("clip-path", "url(#ohlcClip)");

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

  Chart.prototype._bindData = function(){
    //console.log('_bindData');
    this.mainG.select("g.candlestick").datum(this.data);
    var lastDatum = this.data[this.data.length-1];
    //console.log('lastDatum:', lastDatum);
    //this.mainG.select("g.close.annotation").datum([lastDatum]);
    //this._bindLineData(this.mainG.select("g.sma.ma-0"), this.smaCalculator(this.data));
    this._bindStudies();
    this.mainG.select("g.volume").datum(this.data);
  };

  Chart.prototype._setYScaleDomain = function(){
    // Update y scale min max, only on viewable zoomable.domain()
    this.yScale.domain(techan.scale.plot.ohlc(this._dataInVisiable()).domain());
    this.yScaleOfVolume.domain(techan.scale.plot.volume(this._dataInVisiable(), this.accessor.v).domain());
  };

  Chart.prototype.draw = function(){
    if(!this.isReady) return;

    if(this.data.length < this.maxVisiableBars) this._setXScale();

    this._bindData();
    //console.log('draw');

    this._setXScaleDomain();
    this._setTimeScaleDomain();
    this._setYScaleDomain();


    this.mainG.select('g.x.axis').call(this.xAxis);
    this.mainG.select('g.y.axis.right').call(this.yAxisRight);
    this.mainG.select('g.y.axis.left').call(this.yAxisLeft);
    //this.mainG.select("g.volume.axis").call(this.volumeAxis);

    this.mainG.select("g.candlestick").call(this.mainPlot);
    //this.mainG.select("g.close.annotation").call(this.closeAnnotation);
    //this.mainG.select("g .sma.ma-0").call(this.sma);
    this._drawStudies();
    this.mainG.select("g.volume").call(this.volume);
    this.mainG.select("g.crosshair.ohlc").call(this.crosshair).call(this.zoom);
    this._drawSupstances();

    // Associate the zoom with the scale after a domain has been applied
    if(!this.zoomAssociated){
      //console.log('zoomAssociated');
      this.zoom.x(this.xScale.zoomable()).y(this.yScale);
      this.zoomAssociated = true;
    }
  };

  Chart.prototype.zoomed = function(rect){
    //console.log('zoomed');
    this.zoom.translate();
    //this.zoom.scale();

    this.mainG.select('g.x.axis').call(this.xAxis);
    this.mainG.select('g.y.axis.right').call(this.yAxisRight);
    this.mainG.select('g.y.axis.left').call(this.yAxisLeft);
    //this.mainG.select("g.volume.axis").call(this.volumeAxis);

    this.mainG.select("g.candlestick").call(this.mainPlot.refresh);
    //this.mainG.select("g.close.annotation").call(this.closeAnnotation.refresh);
    //this.mainG.select("g .sma.ma-0").call(this.sma.refresh);
    this._zoomStudies();
    this.mainG.select("g.volume").call(this.volume.refresh);
    this.mainG.select("g.crosshair.ohlc").call(this.crosshair.refresh);
    this._refreshSupstances();
  };

  Chart.prototype.addStudy = function(studyName, input, options){
    var _this = this;
    function addStudy(){
      if(studyName!="Moving Average") return;
      var study = techan.plot.sma()
          .xScale(_this.xScale)
          .yScale(_this.yScale);
      var calculator = techan.indicator.sma()
          .period(input[0]);

      var cnt = _this.studies.length;
      var studyClass = "ma-"+cnt;
      _this.ohlcSelection.append("g")
        .attr("class", "indicator sma "+ studyClass)
        .attr("clip-path", "url(#ohlcClip)");

      var selector = _this.mainG.select("g .sma." + studyClass);
      _this.studies.push([selector, study, calculator]);
    }
    this._pendingExecute(addStudy);
  };

  Chart.prototype._bindStudies = function(){
    for(var i=0; i < this.studies.length; i++){
      var selector = this.studies[i][0];
      var study = this.studies[i][1];
      var calculator = this.studies[i][2];
      this._bindLineData(selector, calculator(this.data));
    }
  };

  Chart.prototype._drawStudies = function(){
    for(var i=0; i < this.studies.length; i++){
      var selector = this.studies[i][0];
      var study = this.studies[i][1];
      var calculator = this.studies[i][2];
      selector.call(study);
    }
  };

  Chart.prototype._zoomStudies = function(){
    for(var i=0; i < this.studies.length; i++){
      var selector = this.studies[i][0];
      var study = this.studies[i][1];
      var calculator = this.studies[i][2];
      selector.call(study.refresh);
    }
  };

  return Chart;
})();
