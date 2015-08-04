var TraderLightChart=TraderLightChart||{};TraderLightChart.core=TraderLightChart.core||{},function(a){a.CHART_GLOABLE_CSS="\n\n\n.trader-light-chart {\n  border: 1px solid #DEDEDE;\n  font-size: 0.5rem;\n  overflow: hidden;\n}\n.trader-light-chart path.line {\n  fill: none;\n  stroke: #000000;\n  stroke-width: 1;\n}\n.trader-light-chart .axis path,\n.trader-light-chart .axis line {\n  fill: none;\n  stroke: #DEDEDE;\n}\n.trader-light-chart .axis g.tick text {\n  stroke: #808080;\n  stroke-width: 0.3;\n}\n.trader-light-chart path {\n  fill: none;\n  stroke-width: 1;\n}\n.trader-light-chart path.candle {\n  stroke: #000000;\n}\n.trader-light-chart path.candle.body {\n  stroke-width: 0;\n  shape-rendering: auto;\n}\n.trader-light-chart path.candle.up {\n  fill: #d75442;\n  stroke: #d75442;\n}\n.trader-light-chart path.candle.down {\n  fill: #6ba583;\n  stroke: #6ba583;\n}\n.trader-light-chart line.candle.body {\n  shape-rendering: auto;\n}\n.trader-light-chart path.ohlc {\n  stroke: #000000;\n  stroke-width: 1;\n}\n.trader-light-chart path.ohlc.up {\n  stroke: #d75442;\n}\n.trader-light-chart path.ohlc.down {\n  stroke: #6ba583;\n}\n.trader-light-chart .line-close.annotation.up path {\n  font-size: 0.5rem;\n  fill: #00AA00;\n}\n.trader-light-chart .ma-0 path.line {\n  stroke: #000000;\n}\n.trader-light-chart .ma-1 path.line {\n  stroke: #2679CB;\n}\n.trader-light-chart .ma-2 path.line {\n  stroke: #FA110F;\n}\n.trader-light-chart .ma-3 path.line {\n  stroke: #00A800;\n}\n.trader-light-chart .ma-4 path.line {\n  stroke: #C0C0C0;\n}\n.trader-light-chart .ma-5 path.line {\n  stroke: #0000FF;\n}\n.trader-light-chart path.volume {\n  fill: #AAAAAA;\n  opacity: 0.5;\n  shape-rendering: auto;\n}\n.trader-light-chart path.volume.up {\n  fill: #FF0000;\n}\n.trader-light-chart path.volume.down {\n  fill: #00AA00;\n}\n.trader-light-chart .crosshair {\n  cursor: crosshair;\n}\n.trader-light-chart .crosshair path.wire {\n  stroke: #DDDDDD;\n  stroke-dasharray: 1, 1;\n}\n.trader-light-chart .crosshair .axisannotation path {\n  fill: #DDDDDD;\n}\n.trader-light-chart .analysis path,\n.trader-light-chart .analysis circle {\n  stroke: #7E7E7E;\n  stroke-width: 0.8;\n}\n.trader-light-chart .interaction path,\n.trader-light-chart .interaction circle {\n  pointer-events: all;\n}\n.trader-light-chart .interaction .body {\n  cursor: move;\n}\n.trader-light-chart .supstance path {\n  stroke-dasharray: 2, 2;\n}\n.trader-light-chart .supstances .interaction path {\n  pointer-events: none;\n  cursor: ns-resize;\n}\n.trader-light-chart .mouseover .supstance path {\n  stroke-width: 1.5;\n}\n.trader-light-chart .dragging .supstance path {\n  stroke: darkblue;\n}\n.trader-light-chart .trendline {\n  stroke: blue;\n  stroke-width: 0.8;\n}\n.trader-light-chart .interaction path,\n.trader-light-chart .interaction circle {\n  pointer-events: all;\n}\n.trader-light-chart .interaction .body {\n  cursor: move;\n}\n.trader-light-chart .interaction .start,\n.trader-light-chart .interaction .end {\n  cursor: nwse-resize;\n}\n\n\n    "}(TraderLightChart.core);

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

  core.insertCSS = function(css){
    var style = document.createElement('style');
    style.innerHTML = css;
    document.body && document.body.appendChild(style);
  };

  core.insertChartCSSToGloable = function(){
    core.insertCSS(core.CHART_GLOABLE_CSS);
  };

  // TODO
  core.locale = function(locale){
  };

})(TraderLightChart.core);

TraderLightChart.core.insertChartCSSToGloable();

TraderLightChart.core.locale({
  "decimal": ".",
  "thousands": ",",
  "grouping": [3],
  "currency": ["￥", ""],
  "dateTime": "%Y-%m-%d %H:%M:%S",
  "date": "%Y-%m-%d",
  "time": "%H:%M:%S",
  "periods": ["AM", "PM"],
  "days": ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
  "shortDays": ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
  "months": ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
  "shortMonths": ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
});


var TraderLightChart = TraderLightChart || {};

TraderLightChart.BaseChart = (function(){
  function Chart(options){
    this.margin = {
      top: 0,
      bottom: 30,
      left: 0,
      right: 10
    };

    this.padding = {
      right: 5,
      left: 5
    };

    this.standardSize = {
      small: 320,
    };

    this.options = {
      container_id: 'trader_light_chart_container',
      interval: 'D', // '1', 'D', 'W', 'M', 'Y'
      maxVisiableBars: 100,
      zoomable: true,
      movable: true,
      suspended: false 
    };

    _.extend(this.options, options)

    this.maxVisiableBars = this.options.maxVisiableBars; // TODO: calculate it
    this._initRightOffset();

    this.data = [];
    this.pending = [];
    this.isReady = false;
    this.canReInit = true;
    this.supstanceData = [];
    this.baseDatum = null;
    this.studies = [];
    this.trendlineData = [];
    this.zoomable = this.options.zoomable;
    this.movable = this.options.movable;
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
    this.timeScale.range([this.padding.left, this.containerWidth - this.margin.left - this.margin.right - this.padding.right]);
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
      .translate([this.timeScale(1) + this.margin.right + this.padding.right, 0]);
    this.closeAnnotation
      .translate([this.timeScale(1) + this.margin.right + this.padding.right, 0]);
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

  Chart.prototype._createTrendline = function(){
    this.trendline = techan.plot.trendline()
        .xScale(this.timeScale)
        .yScale(this.yScale);
  };

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
    this._conbineTrendline();
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

  Chart.prototype._conbineTrendline = function(){
    this.mainG.append("g")
      .attr("class", "trendlines");
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
        .attr("transform", "translate(" + (this.timeScale(1) + this.margin.right + this.padding.right) + ",0)");
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
    this._bindTrendline();
    this.mainG.select("g.volume").datum(this.data);
  };

  // should override
  Chart.prototype._bindMainPlot = function(){
  };

  Chart.prototype.draw = function(){
    if(!this.isReady) return;

    if(this.options.interval === '1' && this.options.suspended)
      this._setSuspendedMode();

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
    this._drawTrendline();
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
    //console.log('_dataInVisiable');
    var domain = this._domainInVisiable();
    return this.data.slice(domain[0], domain[1]);
  };

  Chart.prototype._domainInVisiable = function(){
    if(this.maxVisiableBars > this.data.length){
      var d0 = 0 - this._rightOffset;
      if(this._rightOffset <= this.maxVisiableBars - this.data.length){
        var d1 = this.data.length;
      }else{
        var d1 = this.data.length - (this._rightOffset - (this.maxVisiableBars - this.data.length));
      }
    }else{
      var d0 = this.data.length - this.maxVisiableBars - this._rightOffset;
      if(this._rightOffset < 0){
        var d1 = this.data.length;
      }else{
        var d1 = this.data.length - this._rightOffset;
      }
    }
    if(d0 < 0) d0 = 0;
    if(d1 > this.data.length) d1 = this.data.length;
    //console.log('_dataInVisiable:' + d0 + ', ', + d1);
    return [d0,d1];
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

  //////////////// study ////////////////////////
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

  //////////////// end of study ////////////////////////

  //////////////// trendline ////////////////////////

  Chart.prototype.addTrendlines = function(data){
    var _this = this;
    function addTrendlines(){
      _.each(data, function(datum){
        var d = _this._pretreatTrendlineDatum(datum)
        _this.trendlineData.push(d);
      });
    }

    addTrendlines();
  };

  Chart.prototype.addTrendline = function(datum){
    this.addTrendlines([datum]);
  };

  Chart.prototype._bindTrendline = function(){
    this.mainG.select("g.trendlines").datum(this.trendlineData);
  };

  Chart.prototype._drawTrendline = function(){
    this.mainG.select("g.trendlines").call(this.trendline);
  };

  Chart.prototype._refreshTrendline = function(){
    this.mainG.select("g.trendlines").call(this.trendline.refresh);
  };

  Chart.prototype._pretreatTrendlineDatum = function(d){
    return {
      start: {
        date: moment(d.start.time || d.start.date).toDate(),
        value: d.start.price || d.start.value
      },
      end: {
        date: moment(d.end.time || d.end.date).toDate(),
        value: d.end.price || d.end.value
      }
    };
  };

  //////////////// end of trendline ////////////////////////

  Chart.prototype.reInit = function(){
    //console.log('reInit');
    if(!this.canReInit) return;
    this._init();
    this.draw();
  };

  Chart.prototype.isSmallSize = function(){
    return this.containerWidth <= this.standardSize.small
  };

  //////////////// zoom and translate //////////////
  Chart.prototype._setXyZoom = function(){
    this.xyZoom.x(this.timeScale.zoomable().clamp(false)).y(this.yScale);
    this._initRightOffset();
  }

  //////////////// bars physical info //////////////
  Chart.prototype._barWidth = function(){
    return (this.containerWidth - this.margin.left - this.margin.right - this.padding.left - this.padding.right) / this.maxVisiableBars;
  };

  Chart.prototype._widthToBarOffset = function(width){
    var barCnt = width / this._barWidth();
    if(barCnt >= 0)
      return Math.ceil(barCnt);
    else
      return Math.floor(barCnt);
  };

  Chart.prototype._initRightOffset = function(){
    this._rightOffset = 0;
  };

  Chart.prototype._getRightOffset = function(){
    return this._rightOffset;
  };


  Chart.prototype._setRightOffset = function(offset){
    //console.log('offset:', offset);
    var minVisibleBars = 3;

    var max = Math.max(this.maxVisiableBars, this.data.length);
    var min = Math.min(this.maxVisiableBars, this.data.length);

    if(offset < 0){
      var maxOffset = - (min - minVisibleBars);
      maxOffset = maxOffset <= 0 ? maxOffset : 0;
    }else{
      var maxOffset = max - minVisibleBars;
    }
    offset = Math.abs(offset) > Math.abs(maxOffset) ? maxOffset : offset;

    this._rightOffset = offset;

    var tranX = offset * this._barWidth();

    this.xyZoom.translate([tranX,0]);
  };

  Chart.prototype._setMaxVisiableBars = function(scale){
    if(scale < 0.1 || scale > 5) return;
    this.maxVisiableBars = Math.floor(this.maxVisiableBars * scale);
  };

  Chart.prototype._scaleChart = function(scale, offset){
    if(scale < 0.1 || scale > 5) return;
    this._setMaxVisiableBars(scale);
    this.xyZoom.scale(scale);
    //this._setRightOffset(offset);
  };

  // stock suspended
  Chart.prototype._setSuspendedMode = function(){
    var datum = this.getBaseDatum();
    this.data = [datum];
  };

  Chart.prototype.setSuspended = function(suspended){
    this.options.suspended = suspended || false;
  };

  return Chart;
})();



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
    if(this.options.interval == '1'){
      this.yAxisLeft = d3.svg.axis()
        .scale(this.yPercentScale)
        .orient("right")
        .tickFormat(d3.format('+.1%'));
    }else{
      this.yAxisLeft = d3.svg.axis()
        .scale(this.yScale)
        .orient("right");
    }
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
    if(this.options.interval == '1')
      yDomain = this.symmetrizeYScaleDomain(yDomain);
    this.yScale.domain(yDomain);
    if(this.options.interval == '1') this._setYPercentScaleDomain();
    this.yScaleOfVolume.domain(techan.scale.plot.volume(this._dataInVisiable(), this.accessor.v).domain());
  };

  Chart.prototype._setYPercentScaleDomain = function(){
    var percentDomain = techan.scale.plot.percent(this.yScale, this.accessor(this.getBaseDatum())).domain();
    percentDomain = this.symmetrizePercentDomain(percentDomain);
    //console.log('percentDomain:', percentDomain);
    this.yPercentScale.domain(percentDomain);
  };

  Chart.prototype._drawMainPlot = function(){
    this.mainG.select("g.line-close").call(this.mainPlot);
  };

  return Chart;
})();


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
    //console.log('tran:',tran);
    var offset =  this._widthToBarOffset(tran[0]);
    if(this.movable)
      this._setRightOffset(offset);

    // FIXME: bug of scale
    //var scal = this.zoom.scale();
    //console.log('scal:', scal);
    //if(this.zoomable)
      //this._scaleChart(scal, offset);

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
