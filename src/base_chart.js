var TraderLightChart = TraderLightChart || {};

TraderLightChart.BaseChart = (function(){
  function Chart(options){
    this.margin = {
      top: 0,
      bottom: 30,
      left: 1,
      right: 1
    };

    this.standardSize = {
      small: 320,
    };

    this.options = {
      container_id: 'trader_light_chart_container',
      interval: 'D', // '1', 'D', 'W', 'M', 'Y'
      maxVisiableBars: 120,
      zoomable: true
    };

    _.extend(this.options, options)

    this.maxVisiableBars = this.options.maxVisiableBars; // TODO: calculate it

    this.data = [];
    this.pending = [];
    this.isReady = false;
    this.canReInit = true;
    this.supstanceData = [];
    this.baseDatum = null;
    this.studies = [];
    this.zoomable = this.options.zoomable;
  }

  // should override
  Chart.prototype._init = function(){
  };

  Chart.prototype._handleInterval = function(){
  };

  Chart.prototype._createScale = function(){
    //console.log('_createScale');
    if(!this.isReady) return;

    this.timeScale = techan.scale.financetime()
      .outerPadding(0);

    this.yScale = d3.scale.linear();

    this.yPercentScale = this.yScale.copy();

    this.yScaleOfVolume = d3.scale.linear();

    this._setScales();
  };

  Chart.prototype._setScales = function(){
    //this._initSetXScale();
    this.timeScale.range([0, this.containerWidth - this.margin.left - this.margin.right]);
    this.yScale.range([this.containerHeight - this.margin.top - this.margin.bottom, 0]);
    this.yPercentScale.range([this.containerHeight - this.margin.top - this.margin.bottom, 0]);
    this.yScaleOfVolume.range([this.yScale(0), this.yScale(0.4)]);
  }

  Chart.prototype._createAxis = function(){
    //console.log('_createAxis');
    if(!this.isReady) return;

    this._createTimeAxis();
    this._createYAxis();
    //this._createVolumeAxis();
  };

  Chart.prototype._createTimeAxis = function(){
    this.timeAxis = d3.svg.axis()
      .scale(this.timeScale)
      .orient("bottom");
  };

  Chart.prototype._createYAxis = function(){
    this.yAxisRight = d3.svg.axis()
      .scale(this.yScale)
      .orient("right");
    this.yAxisLeft = d3.svg.axis()
      .scale(this.yScale)
      .orient("right");
  };

  Chart.prototype._createVolumeAxis = function(){
    this.volumeAxis = d3.svg.axis()
      .scale(this.yScaleOfVolume)
      .orient("right")
      .ticks(3)
      .tickFormat(d3.format(",.3s"));
  };

  // should override
  Chart.prototype._createMainPlot = function(){
  };

  ////////////////////// analysis supstance ///////////////////////////////////
  Chart.prototype._createSupstance = function(){
    this.supstance = techan.plot.supstance()
      .xScale(this.timeScale)
      .yScale(this.yScale);
  };

  Chart.prototype.addSupstance = function(data){
    //console.log('addSupstance');
    var _this = this;
    function addSupstance(){
      _this.supstanceData.push(data.price);
      _this._drawSupstances();
    }
    this._pendingExecute(addSupstance);
  };

  Chart.prototype._drawSupstances = function(){
    //console.log('_drawSupstances');
    var supstanceData = this._genSupstanceData(this.data[0], this.data[this.data.length-1]);
    if(supstanceData.length > 0)
      this.mainG.select("g.supstances").datum(supstanceData).call(this.supstance);
  };

  Chart.prototype._refreshSupstances = function(){
    //console.log('_refreshSupstances');
    var supstanceData = this._genSupstanceData(this.data[0], this.data[this.data.length-1]);
    if(supstanceData.length > 0)
      this.mainG.select("g.supstances").datum(supstanceData).call(this.supstance.refresh);
  };

  Chart.prototype._genSupstanceData = function(startDate, endDate){
    var l = [];
    for(var i=0; i < this.supstanceData.length; i++){
      l.push({
        start: startDate,
        end: endDate,
        value: this.supstanceData[i]
      });
    }
    return l;
  }
  ////////////////////// end of analysis supstance ///////////////////////////////////

  Chart.prototype._createAxisAnnotation = function(){
    if(!this.isReady) return;

    var timeAnnotationFormat = (function(interval){
      if(interval==='1') return d3.time.format('%H:%M');
      return d3.time.format('%Y-%m-%d');
    })(this.options.interval);

    //console.log('timeAnnotationFormat:', timeAnnotationFormat);
    this.timeAnnotation = techan.plot.axisannotation()
      .axis(this.timeAxis)
      .format(timeAnnotationFormat);

    this.ohlcAnnotationRight = techan.plot.axisannotation()
      .axis(this.yAxisRight)
      .format(d3.format(',.2fs'));

    this.ohlcAnnotationLeft= techan.plot.axisannotation()
      .axis(this.yAxisLeft)
      .format(d3.format(',.2fs'));

    this.closeAnnotation = techan.plot.axisannotation()
      .axis(this.yAxisRight)
      .accessor(this.accessor)
      .format(d3.format(',.2fs'));

    //this.volumeAnnotation = techan.plot.axisannotation()
    //  .axis(this.volumeAxis)
    //  .width(35);
  }

  Chart.prototype._setAxisAnnotation= function(){
    if(!this.isReady) return;

    var width = 65;
    this.timeAnnotation
      .width(width)
      .translate([0, this.containerHeight - this.margin.top - this.margin.bottom]);

    this.ohlcAnnotationRight
      .translate([this.timeScale(1), 0]);
    this.closeAnnotation
      .translate([this.timeScale(1), 0]);
  };

  Chart.prototype._createCrossHair = function(){
    if(!this.isReady) return;

    this.crosshair = techan.plot.crosshair()
      .xScale(this.timeScale)
      .yScale(this.yScale)
      .xAnnotation(this.timeAnnotation)
      //.yAnnotation([this.ohlcAnnotationRight, this.ohlcAnnotationLeft, this.volumeAnnotation]);
      .yAnnotation([this.ohlcAnnotationRight, this.ohlcAnnotationLeft]);
  }

  Chart.prototype._initContainer = function(){
    //console.log('_initContainer');
    
    this.containerElement = document.getElementById(this.options.container_id);
    // the container width or height is invalid
    if(this.containerElement.offsetWidth<=0 || this.containerElement.offsetHeight<=0){
      return ;
    }
    this.containerElement.classList.add("trader-light-chart");

    this.isReady = true;
    this._setChartBasics();
    var _this = this;
    window.onresize = function(){
      _this._onChartContainerResize();
    };

    this.containerSelector = d3.select("body div[id="+this.options.container_id+"]"); 
  };

  Chart.prototype._setChartBasics = function(){
    // for test

    this.containerWidth = this.containerElement.offsetWidth;
    this.containerHeight = this.containerElement.offsetHeight;

    this.containerWidth = (this.containerWidth - this.margin.left - this.margin.right) > 10 ? this.containerWidth : 400;
    this.containerHeight = (this.containerHeight - this.margin.top - this.margin.bottom) > 10 ? this.containerHeight : 300;

  };

  Chart.prototype._initMainSvg = function(){
    //console.log('_initMainSvg');
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

  Chart.prototype._conbine = function(){
    //console.log('_conbine');
    if(!this.isReady) return;

    this.ohlcSelection = this.mainG.append("g")
      .attr("class", "ohlc")
      .attr("transform", "translate(0,0)");

    this._conbineVolume();
    this._conbineMainPlot();
    this._conbineAxises();

    //this.mainG.append("g")
    //    .attr("class", "line-close annotation up");

    this._conbineCrosshair();
    this._conbineSupstances();

    this._afterConbine();
  };

  Chart.prototype._conbineVolume = function(){
    this.ohlcSelection.append("g")
      .attr("class", "volume")
      .attr("clip-path", "url(#ohlcClip)");
  };

  // should be override
  Chart.prototype._conbineMainPlot = function(){
  };

  Chart.prototype._conbineAxises = function(){
    this.mainG.append('g')
        .attr("class", "y axis right")

    this.mainG.append('g')
        .attr("class", "y axis left")

    this.mainG.append('g')
        .attr("class", "time axis");

    //this.mainG.append("g")
    //    .attr("class", "volume axis");
  };

  Chart.prototype._conbineCrosshair = function(){
    this.mainG.append('g')
        .attr("class", "crosshair ohlc");
  };

  Chart.prototype._conbineSupstances = function(){
    this.mainG.append("g")
            .attr("class", "supstances analysis")
            .attr("clip-path", "url(#ohlcClip)");
  };

  Chart.prototype._afterConbine = function(){
    this._setAxisesSize();
    this.canReInit = false;
    this._clearPending();
  };

  // should override
  Chart.prototype._setYScaleDomain = function(){
  };

  Chart.prototype._setTimeScaleDomain = function(){
    //console.log('_setTimeScaleDomain');
    var domain = techan.scale.plot.time(this.data).domain();
    var timeScaleDomain = this._genTimeScaleDomain(domain);
    this.timeScale.domain(timeScaleDomain);
    if(this.options.interval != '1'){
      // TODO: fix later
      var domainInVisiable = this._domainInVisiable();
      if(domainInVisiable[0]==0){
        this.timeScale.zoomable().domain([0, this.maxVisiableBars]);
      }else{
        this.timeScale.zoomable().domain(this._domainInVisiable());
      }
    }

  };

  Chart.prototype._setAxisesSize = function(){
    this.mainG.select('g.time.axis')
        .attr("transform", "translate(0," + (this.containerHeight - this.margin.top - this.margin.bottom) + ")");
    this.mainG.select('g.y.axis.right')
        .attr("transform", "translate(" + this.timeScale(1) + ",0)");
    this.mainG.select('g.y.axis.left')
        .attr("transform", "translate(0,0)");
  }; 

  Chart.prototype.feedData = function(data){
    //console.log('feedData');
    for(var i=0; i < data.length; i++){
      var datum = this._pretreatData(data[i]);
      if(this.data.length>0 && datum.date < this.data[this.data.length-1].date) continue;
      this.data.push(datum);
    }
  };

  Chart.prototype._bindData = function(){
    //console.log('_bindData');
    this._bindMainPlot();
    //var lastDatum = this.data[this.data.length-1];
    //console.log('lastDatum:', lastDatum);
    //this.mainG.select("g.line-close.annotation").datum([lastDatum]);
    this._bindStudies();
    this.mainG.select("g.volume").datum(this.data);
  };

  // should override
  Chart.prototype._bindMainPlot = function(){
  };

  Chart.prototype.draw = function(){
    if(!this.isReady) return;

    this._bindData();
    //console.log('draw');

    this._setTimeScaleDomain();
    this._setYScaleDomain();

    this._drawAxises();
    this._drawMainPlot();
    //this.mainG.select("g.line-close.annotation").call(this.closeAnnotation);
    this._drawStudies();
    this._drawVolume();
    this._drawCrosshair();
    this._drawSupstances();
  };

  Chart.prototype._drawAxises = function(){
    this.mainG.select('g.y.axis.right').call(this.yAxisRight);
    this.mainG.select('g.y.axis.left').call(this.yAxisLeft);
    this.mainG.select('g.time.axis').call(this.timeAxis);
    //this.mainG.select("g.volume.axis").call(this.volumeAxis);
  };

  // should override
  Chart.prototype._drawMainPlot = function(){
  };

  Chart.prototype._drawVolume = function(){
    this.mainG.select("g.volume").call(this.volume);
  };

  Chart.prototype._drawCrosshair = function(){
    this.mainG.select("g.crosshair.ohlc").call(this.crosshair);
  };

  // should override
  Chart.prototype._refreshMainPlot = function(){
  };

  Chart.prototype._refreshVolume = function(){
    this.mainG.select("g.volume").call(this.volume.refresh);
  };

  Chart.prototype._refreshCrosshair = function(){
    this.mainG.select("g.crosshair.ohlc").call(this.crosshair.refresh);
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
    //console.log('refreshIndicator');
    var datum = selection.datum();
    if(!datum){ // first time bind data
        selection.datum(data);
        return;
    }
    // Some trickery to remove old and insert new without changing array reference,
    // so no need to update __data__ in the DOM
    datum.splice.apply(datum, [0, datum.length].concat(data));
  };

  Chart.prototype._pretreatData = function(data) {
    return {
        date: moment(data.date || data.time).toDate(),
        open: data.open,
        high: data.high,
        low: data.low,
        close: data.close,
        volume: data.volume
      };
  };

  Chart.prototype.getBaseDatum = function(){
    if(this.baseDatum){
      return this.baseDatum;
    }else{
      return this.data[0];
    }
  };

  Chart.prototype.setBaseDatum = function(datum){
    if(datum && datum.high && datum.open && datum.low && datum.close){
      this.baseDatum = this._pretreatData(datum);
    }else{
      this.baseDatum = null;
    }
  };

  Chart.prototype.symmetrizeYScaleDomain = function(domain){
    var base = this.getBaseDatum().close;
    var distance = Math.max(Math.abs(domain[0] - base), Math.abs(domain[1] - base));
    return [base - distance, base + distance];
  };

  Chart.prototype.symmetrizePercentDomain = function(domain){
    var distance = Math.max(Math.abs(domain[0]), Math.abs(domain[1]));
    return [-distance, +distance];
  };

  Chart.prototype._genTimeScaleDomain = function(initialDomain){
    var _this = this;
    var domain = [];
    domain = domain.concat(initialDomain);

    var len = this.maxVisiableBars - domain.length;
    for(var i=0; i < len; i++){
      var startDate = domain[domain.length-1];
      var d = createOffsetedDate(startDate, 1);
      domain.push(d);
    }
    return domain;


    function createOffsetedDate(date, offset){
      var d = moment(date);
      switch(_this.options.interval){
        case '1':
          return d.add(offset, 'm').toDate();
        case 'D':
          return d.add(offset, 'd').toDate();
        case 'W':
          return d.add(offset, 'w').toDate();
        case 'M':
          return d.add(offset, 'M').toDate();
      }
    }
  };
  
  Chart.prototype._onChartContainerResize = function(){
    //console.log('_onChartContainerResize');
    return; // bugs
    this._setChartBasics();
    this._setMainSvgSize();
    this._setAxisesSize();
    this._setAxisAnnotation();
    this.draw();
  };

  Chart.prototype._setMargin = function(margin){
    _.extend(this.margin, margin);
  };

  Chart.prototype._pendingExecute = function(callback){
    if(this.isReady){
      callback();
    }else{
      this.pending.push(callback)
    }
  };

  Chart.prototype._clearPending = function(){
    while(this.pending.length > 0){
      var execution = this.pending.shift();
      execution();
    }
  };

  Chart.prototype.drawBars = function(bars){
    this.feedData(bars);
    this.draw();
  };

  Chart.prototype.drawBar = function(bar){
    this.feedData([bar]);
    this.draw();
  };

  Chart.prototype.addStudy = function(studyName, input, options){
    var _this = this;
    function addStudy(){
      if(studyName!="Moving Average") return;
      var study = techan.plot.sma()
          .xScale(_this.timeScale)
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

  Chart.prototype._refreshStudies = function(){
    for(var i=0; i < this.studies.length; i++){
      var selector = this.studies[i][0];
      var study = this.studies[i][1];
      var calculator = this.studies[i][2];
      selector.call(study.refresh);
    }
  };

  Chart.prototype.reInit = function(){
    //console.log('reInit');
    if(!this.canReInit) return;
    this._init();
    this.draw();
  };

  Chart.prototype.isSmallSize = function(){
    return this.containerWidth <= this.standardSize.small
  };

  return Chart;
})();

