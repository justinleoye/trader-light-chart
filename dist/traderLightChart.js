var TraderLightChart=TraderLightChart||{};TraderLightChart.core=TraderLightChart.core||{},function(a){a.CHART_GLOABLE_CSS="\n\n\n.trader-light-chart {\n  border: 1px solid #DEDEDE;\n  font-size: 0.5rem;\n  overflow: hidden;\n}\n.trader-light-chart path.line {\n  fill: none;\n  stroke: #000000;\n  stroke-width: 1;\n}\n.trader-light-chart .axis path,\n.trader-light-chart .axis line {\n  fill: none;\n  stroke: #DEDEDE;\n  shape-rendering: crispEdges;\n}\n.trader-light-chart .axis g.tick text {\n  stroke: #808080;\n  stroke-width: 0.3;\n}\n.trader-light-chart path {\n  fill: none;\n  stroke-width: 1;\n}\n.trader-light-chart path.candle {\n  stroke: #000000;\n  shape-rendering: crispEdges;\n}\n.trader-light-chart path.candle.body {\n  stroke-width: 0;\n  shape-rendering: crispEdges;\n}\n.trader-light-chart path.candle.up {\n  fill: #d75442;\n  stroke: #d75442;\n  shape-rendering: crispEdges;\n}\n.trader-light-chart path.candle.down {\n  fill: #6ba583;\n  stroke: #6ba583;\n  shape-rendering: crispEdges;\n}\n.trader-light-chart path.ohlc {\n  stroke: #000000;\n  stroke-width: 1;\n}\n.trader-light-chart path.ohlc.up {\n  stroke: #d75442;\n}\n.trader-light-chart path.ohlc.down {\n  stroke: #6ba583;\n}\n.trader-light-chart .line-close.annotation.up path {\n  font-size: 0.5rem;\n  fill: #00AA00;\n}\n.trader-light-chart .ma-0 path.line {\n  stroke: #000000;\n}\n.trader-light-chart .ma-1 path.line {\n  stroke: #2679CB;\n}\n.trader-light-chart .ma-2 path.line {\n  stroke: #FA110F;\n}\n.trader-light-chart .ma-3 path.line {\n  stroke: #00A800;\n}\n.trader-light-chart .ma-4 path.line {\n  stroke: #C0C0C0;\n}\n.trader-light-chart .ma-5 path.line {\n  stroke: #0000FF;\n}\n.trader-light-chart path.volume {\n  fill: #AAAAAA;\n  opacity: 0.5;\n  shape-rendering: crispEdges;\n}\n.trader-light-chart path.volume.up {\n  fill: #FF0000;\n}\n.trader-light-chart path.volume.down {\n  fill: #00AA00;\n}\n.trader-light-chart .crosshair {\n  cursor: crosshair;\n}\n.trader-light-chart .crosshair path.wire {\n  stroke: #DDDDDD;\n  stroke-dasharray: 1, 1;\n}\n.trader-light-chart .crosshair .axisannotation path {\n  fill: #DDDDDD;\n}\n.trader-light-chart .analysis path,\n.trader-light-chart .analysis circle {\n  stroke: #7E7E7E;\n  stroke-width: 0.8;\n}\n.trader-light-chart .interaction path,\n.trader-light-chart .interaction circle {\n  pointer-events: all;\n}\n.trader-light-chart .interaction .body {\n  cursor: move;\n}\n.trader-light-chart .supstance path {\n  stroke-dasharray: 2, 2;\n}\n.trader-light-chart .supstances .interaction path {\n  pointer-events: none;\n  cursor: ns-resize;\n}\n.trader-light-chart .mouseover .supstance path {\n  stroke-width: 1.5;\n}\n.trader-light-chart .dragging .supstance path {\n  stroke: darkblue;\n}\n\n\n    "}(TraderLightChart.core);

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

TraderLightChart.BaseChart = (function(){
  function Chart(options){
    this.margin = {
      top: 0,
      bottom: 30,
      //left: 50,
      left: 1,
      right: 1
      //right: 50
    };

    this.options = {
      container_id: 'trader_light_chart_container',
      interval: 'D', // '1', 'D', 'W', 'M', 'Y'
      maxVisiableBars: 120,
    };

    _.extend(this.options, options)

    this.maxVisiableBars = this.options.maxVisiableBars; // TODO: calculate it

    this.data = [];
    this.pending = [];
    this.isReady = false;
    this.canReInit = true;
    this.supstanceData = [];
    this.baseDatum = null;
  }

  // should override
  Chart.prototype._init = function(){
  };

  Chart.prototype._handleInterval = function(){
  };

  Chart.prototype._createScale = function(){
    //console.log('_createScale');
    if(!this.isReady) return;

    this.xScale = techan.scale.financetime()
      .outerPadding(0);

    this.timeScale = techan.scale.financetime()
      .outerPadding(0);

    this.yScale = d3.scale.linear();

    this.yPercentScale = this.yScale.copy();

    this.yScaleOfVolume = d3.scale.linear();

    this._setScales();
  };

  Chart.prototype._setScales = function(){
    this._initSetXScale();
    this.timeScale.range([0, this.containerWidth - this.margin.left - this.margin.right]);
    this.yScale.range([this.containerHeight - this.margin.top - this.margin.bottom, 0]);
    this.yPercentScale.range([this.containerHeight - this.margin.top - this.margin.bottom, 0]);
    this.yScaleOfVolume.range([this.yScale(0), this.yScale(0.4)]);
  }

  Chart.prototype._initSetXScale = function(){
      this.xScale.range([0, this.containerWidth - this.margin.left - this.margin.right]);
  }

  Chart.prototype._setXScale = function(){
    if(this.data.length < this.maxVisiableBars){
      var times = this.data.length / this.maxVisiableBars;
      this.xScale.range([0, (this.containerWidth - this.margin.left - this.margin.right)*times]);
    }else{
      this.xScale.range([0, this.containerWidth - this.margin.left - this.margin.right]);
    }
  }

  Chart.prototype._createAxis = function(){
    //console.log('_createAxis');
    if(!this.isReady) return;

    this.xAxis = d3.svg.axis()
      //.scale(this.xScale)
      .scale(this.timeScale)
      .orient("bottom");
    this.yAxisRight = d3.svg.axis()
      .scale(this.yScale)
      .orient("right");
    this.yAxisLeft = d3.svg.axis()
      .scale(this.yScale)
      //.orient("left");
      .orient("right");
    //this.volumeAxis = d3.svg.axis()
    //  .scale(this.yScaleOfVolume)
    //  .orient("right")
    //  .ticks(3)
    //  .tickFormat(d3.format(",.3s"));
  };

  // should override
  Chart.prototype._createMainPlot = function(){
  };

  ////////////////////// analysis supstance ///////////////////////////////////
  Chart.prototype._createSupstance = function(){
    this.supstance = techan.plot.supstance()
      .xScale(this.xScale)
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
      .axis(this.xAxis)
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

    this.timeAnnotation
      .width(65)
      .translate([0, this.containerHeight - this.margin.top - this.margin.bottom]);

    this.ohlcAnnotationRight
      .translate([this.xScale(1), 0]);
    this.closeAnnotation
      .translate([this.xScale(1), 0]);
  };

  Chart.prototype._createCrossHair = function(){
    if(!this.isReady) return;

    this.crosshair = techan.plot.crosshair()
      .xScale(this.xScale)
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
    //var width = document.body.clientWidth * 0.9;
    //var height = document.body.clientHeight * 0.5;
    //this.containerElement.setAttribute("style","width:"+width+"px;"+"height:"+height+"px");

    this.containerWidth = this.containerElement.offsetWidth;
    this.containerHeight = this.containerElement.offsetHeight;

    //if(this.containerElement.offsetWidth < 360){
    //  this._setMargin({left:30});
    //}

    this.containerWidth = (this.containerWidth - this.margin.left - this.margin.right) > 10 ? this.containerWidth : 400;
    this.containerHeight = (this.containerHeight - this.margin.top - this.margin.bottom) > 10 ? this.containerHeight : 300;

    //console.log('containerWidth: ' + this.containerWidth + ' ,containerHeight: ' + this.containerHeight);
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

  // should override
  Chart.prototype._conbine = function(){
  };

  Chart.prototype._afterConbine = function(){
    this._setAxisesSize();
    this.canReInit = false;
    this._clearPending();
  };

  Chart.prototype._setXScaleDomain = function(){
    var domain = techan.scale.plot.time(this.data).domain();
    this.xScale.domain(domain);
    this.xScale.zoomable().domain(this._domainInVisiable());
  };

  // should override
  Chart.prototype._setYScaleDomain = function(){
  };

  Chart.prototype._setTimeScaleDomain = function(){
    var domain = techan.scale.plot.time(this.data).domain();
    if(this.options.interval === '1'){
      var timeScaleDomain = this._genTimeScaleDomain(domain[0]);
      this.timeScale.domain(timeScaleDomain);
      //this.timeScale.zoomable().domain(timeScaleDomain);
    }else{
      this.timeScale.domain(domain);
      this.timeScale.zoomable().domain(this._domainInVisiable());
    }

  };

  Chart.prototype._setAxisesSize = function(){
    this.mainG.select('g.x.axis')
        .attr("transform", "translate(0," + (this.containerHeight - this.margin.top - this.margin.bottom) + ")");
    this.mainG.select('g.y.axis.right')
        .attr("transform", "translate(" + this.xScale(1) + ",0)");
    this.mainG.select('g.y.axis.left')
        .attr("transform", "translate(0,0)");
  }; 

  Chart.prototype.feedData = function(data){
    //console.log('feedData');
    for(var i=0; i < data.length; i++){
      var datum = this._pretreatData(data[i]);
      this.data.push(datum);
    }
    //console.log('data:', this.data);
  };

  // should override
  Chart.prototype._bindData = function(){
  };

  // should override
  Chart.prototype.draw = function(){
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

  Chart.prototype._genTimeScaleDomain = function(initialDate){
    var domain = [];
    var len = this.maxVisiableBars;
    for(var i=0; i < len; i++){
      var d = createOffsetedDate(initialDate, i);
      domain.push(d);
    }
    return domain;

    function createOffsetedDate(date, offset){
      var d = moment(date);
      return d.add(offset, 'm').toDate();
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
  Chart.prototype.reInit = function(){
    //console.log('reInit');
    if(!this.canReInit) return;
    this._init();
    this.draw();
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
      .attr("class", "line-close")
      .attr("clip-path", "url(#ohlcClip)");

    //this.mainG.append("g")
    //    .attr("class", "line-close annotation up");

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
    this._bindLineData(this.mainG.select("g.line-close"), this.data);
    //this.mainG.select("g.candlestick").datum(this.data);
    var lastDatum = this.data[this.data.length-1];
    //console.log('lastDatum:', lastDatum);
    //this.mainG.select("g.line-close.annotation").datum([lastDatum]);
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

    this.mainG.select("g.line-close").call(this.mainPlot);
    //this.mainG.select("g.candlestick").call(this.mainPlot);
    //this.mainG.select("g.line-close.annotation").call(this.closeAnnotation);
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
    //    .attr("class", "line-close annotation up");

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
    //this.mainG.select("g.line-close.annotation").datum([lastDatum]);
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
    //this.mainG.select("g.line-close.annotation").call(this.closeAnnotation);
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
    //this.mainG.select("g.line-close.annotation").call(this.closeAnnotation.refresh);
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
