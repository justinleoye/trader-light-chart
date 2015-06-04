var TraderLightChart=TraderLightChart||{};TraderLightChart.core=TraderLightChart.core||{},function(a){a.CHART_GLOABLE_CSS="\n\n\n.trader-light-chart {\n  font-size: 0.5rem;\n}\n.trader-light-chart path.line {\n  fill: none;\n  stroke: #000000;\n  stroke-width: 1;\n}\n.trader-light-chart .axis path,\n.trader-light-chart .axis line {\n  fill: none;\n  stroke: #555555;\n  shape-rendering: crispEdges;\n}\n.trader-light-chart path {\n  fill: none;\n  stroke-width: 1;\n}\n.trader-light-chart path.candle {\n  stroke: #000000;\n}\n.trader-light-chart path.candle.body {\n  stroke-width: 0;\n}\n.trader-light-chart path.candle.up {\n  fill: #d75442;\n  stroke: #d75442;\n}\n.trader-light-chart path.candle.down {\n  fill: #6ba583;\n  stroke: #6ba583;\n}\n.trader-light-chart path.ohlc {\n  stroke: #000000;\n  stroke-width: 1;\n}\n.trader-light-chart path.ohlc.up {\n  stroke: #d75442;\n}\n.trader-light-chart path.ohlc.down {\n  stroke: #6ba583;\n}\n.trader-light-chart .close.annotation.up path {\n  font-size: 0.5rem;\n  fill: #00AA00;\n}\n.trader-light-chart .ma-0 path.line {\n  stroke: #000000;\n}\n.trader-light-chart .ma-1 path.line {\n  stroke: #2679CB;\n}\n.trader-light-chart .ma-2 path.line {\n  stroke: #FA110F;\n}\n.trader-light-chart .ma-3 path.line {\n  stroke: #00A800;\n}\n.trader-light-chart .ma-4 path.line {\n  stroke: #C0C0C0;\n}\n.trader-light-chart .ma-5 path.line {\n  stroke: #0000FF;\n}\n.trader-light-chart path.volume {\n  fill: #EEEEEE;\n}\n.trader-light-chart .crosshair {\n  cursor: crosshair;\n}\n.trader-light-chart .crosshair path.wire {\n  stroke: #DDDDDD;\n  stroke-dasharray: 1, 1;\n}\n.trader-light-chart .crosshair .axisannotation path {\n  fill: #DDDDDD;\n}\n\n\n    "}(TraderLightChart.core);

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
    document.body.appendChild(style);
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
      top: 20,
      bottom: 30,
      left: 50,
      right: 50
    };

    this.options = {
      container_id: 'trader_light_chart_container',
      interval: 'D'
    };

    _.extend(this.options, options)

    this.data = [];
    this.isReady = false;
    this.canReInit = true;
  }

  // should override
  Chart.prototype._init = function(){
  };

  Chart.prototype._createScale = function(){
    console.log('_createScale');
    if(!this.isReady) return;

    this.xScale = techan.scale.financetime()
      .outerPadding(0);
    this.yScale = d3.scale.linear();

    this.yScaleOfVolume = d3.scale.linear();

    this._setScales();
  };

  Chart.prototype._setScales = function(){
    this.xScale.range([0, this.containerWidth - this.margin.left - this.margin.right]);
    this.yScale.range([this.containerHeight - this.margin.top - this.margin.bottom, 0]);
    this.yScaleOfVolume.range([this.yScale(0), this.yScale(0.4)]);
  }

  Chart.prototype._createAxis = function(){
    console.log('_createAxis');
    if(!this.isReady) return;

    this.xAxis = d3.svg.axis()
      .scale(this.xScale)
      .orient("bottom");
    this.yAxisRight = d3.svg.axis()
      .scale(this.yScale)
      .orient("right");
    this.yAxisLeft = d3.svg.axis()
      .scale(this.yScale)
      .orient("left");
    this.volumeAxis = d3.svg.axis()
      .scale(this.yScaleOfVolume)
      .orient("right")
      .ticks(3)
      .tickFormat(d3.format(",.3s"));
  };

  // should override
  Chart.prototype._createMainPlot = function(){
  };

  Chart.prototype._createAxisAnnotation = function(){
    if(!this.isReady) return;

    var timeAnnotationFormat = (function(interval){
      console.log('timeAnnotationFormat');
      console.log('interval:',interval);
      if(interval==='1') return d3.time.format('%H:%M');
      return d3.time.format('%Y-%m-%d');
    })(this.options.interval);

    console.log('timeAnnotationFormat:', timeAnnotationFormat);
    this.timeAnnotation = techan.plot.axisannotation()
      .axis(this.xAxis)
      .format(timeAnnotationFormat)
      .width(65)
      .translate([0, this.containerHeight - this.margin.top - this.margin.bottom]);

    this.ohlcAnnotationRight = techan.plot.axisannotation()
      .axis(this.yAxisRight)
      .format(d3.format(',.2fs'))
      .translate([this.xScale(1), 0]);

    this.ohlcAnnotationLeft= techan.plot.axisannotation()
      .axis(this.yAxisLeft)
      .format(d3.format(',.2fs'));

    this.closeAnnotation = techan.plot.axisannotation()
      .axis(this.yAxisRight)
      .accessor(this.accessor)
      .format(d3.format(',.2fs'))
      .translate([this.xScale(1), 0]);

    this.volumeAnnotation = techan.plot.axisannotation()
      .axis(this.volumeAxis)
      .width(35);
  }

  Chart.prototype._createCrossHair = function(){
    if(!this.isReady) return;

    this.crosshair = techan.plot.crosshair()
      .xScale(this.xScale)
      .yScale(this.yScale)
      .xAnnotation(this.timeAnnotation)
      .yAnnotation([this.ohlcAnnotationRight, this.ohlcAnnotationLeft, this.volumeAnnotation]);
  }

  Chart.prototype._initContainer = function(){
    console.log('_initContainer');
    
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
    this.maxVisiableBars = 120; // TODO: calculate it
  };

  Chart.prototype._setChartBasics = function(){
    // for test
    //var width = document.body.clientWidth * 0.9;
    //var height = document.body.clientHeight * 0.5;
    //this.containerElement.setAttribute("style","width:"+width+"px;"+"height:"+height+"px");

    this.containerWidth = this.containerElement.offsetWidth;
    this.containerHeight = this.containerElement.offsetHeight;
    var scrollWidth = this.containerElement.scrollWidth;
    var clientWidth = this.containerElement.clientWidth;
    console.log('offsetWidth: ' + this.containerWidth + ' ,offsetHeight: ' + this.containerHeight);
    console.log('scrollWidth: ' + scrollWidth);
    console.log('clientWidth: ' + clientWidth);

    this.containerWidth = (this.containerWidth - this.margin.left - this.margin.right) > 10 ? this.containerWidth : 400;
    this.containerHeight = (this.containerHeight - this.margin.top - this.margin.bottom) > 10 ? this.containerHeight : 300;

    console.log('containerWidth: ' + this.containerWidth + ' ,containerHeight: ' + this.containerHeight);
  };

  Chart.prototype._initMainSvg = function(){
    console.log('_initMainSvg');
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
  };

  Chart.prototype._setAxisesSize = function(){
    this.mainG.select('g.x.axis')
        .attr("transform", "translate(0," + (this.containerHeight - this.margin.top - this.margin.bottom) + ")");
    this.mainG.select('g.y.axis')
        .attr("transform", "translate(" + this.xScale(1) + ",0)");
  }; 

  Chart.prototype.feedData = function(data){
    console.log('feedData');
    for(var i=0; i < data.length; i++){
      var datum = {
        date: moment(data[i].date || data[i].time).toDate(),
        open: data[i].open,
        high: data[i].high,
        low: data[i].low,
        close: data[i].close,
        volume: data[i].volume
      };
      this.data.push(datum);
    }
    console.log('data:', this.data);
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
    console.log('refreshIndicator');
    var datum = selection.datum();
    if(!datum){ // first time bind data
        selection.datum(data);
        return;
    }
    console.log('data len before bind:', datum.length);
    // Some trickery to remove old and insert new without changing array reference,
    // so no need to update __data__ in the DOM
    datum.splice.apply(datum, [0, datum.length].concat(data));
    console.log('data len after bind:', datum.length);
  }

  Chart.prototype._onChartContainerResize = function(){
    console.log('on resize');
    console.log('_onChartContainerResize');
    this._setChartBasics();
    this._setMainSvgSize();
    this.draw();
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
    console.log('reInit');
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
    console.log('_init');

    this._initContainer();
    this._initMainSvg();
    this._createScale();
    this._createAxis();
    this._createMainPlot();
    this._createAxisAnnotation();
    this._createCrossHair()
    this._conbine();
  };

  Chart.prototype._createMainPlot = function(){
    console.log('_createMainPlot');
    if(!this.isReady) return;

    this.mainPlot = techan.plot.close()
      .xScale(this.xScale)
      .yScale(this.yScale);

    this.accessor = this.mainPlot.accessor();

    this.volume = techan.plot.volume()
      .accessor(this.accessor)
      .xScale(this.xScale)
      .yScale(this.yScaleOfVolume);
  };

  Chart.prototype._conbine = function(){
    console.log('_conbine');
    if(!this.isReady) return;

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
        .attr("class", "y axis right")
      //.append("text")
      //  .attr("transform", "rotate(-90)")
      //  .attr("y", 6)
      //  .attr("dy", ".71em")
      //  .style("text-anchor", "end")
      //  .text("Price ($)");

    this.mainG.append('g')
        .attr("class", "y axis left")

    this.mainG.append("g")
        .attr("class", "close annotation up");

    this.mainG.append("g")
        .attr("class", "volume axis");

    this.mainG.append('g')
        .attr("class", "crosshair ohlc");

    this._afterConbine();
  };

  Chart.prototype._bindData = function(){
    console.log('_bindData');
    this._bindLineData(this.mainG.select("g.close"), this.data);
    //this.mainG.select("g.candlestick").datum(this.data);
    var lastDatum = this.data[this.data.length-1];
    console.log('lastDatum:', lastDatum);
    this.mainG.select("g.close.annotation").datum([lastDatum]);
    this.mainG.select("g.volume").datum(this.data);
  };

  Chart.prototype.draw = function(){
    if(!this.isReady) return;

    this._bindData();
    console.log('draw');


    //this.xScale.domain(this.data.map(this.accessor.d)); // same as the following line
    this.xScale.domain(techan.scale.plot.time(this.data).domain());
    this.xScale.zoomable().domain(this._domainInVisiable());

    // Update y scale min max, only on viewable zoomable.domain()
    this.yScale.domain(techan.scale.plot.ohlc(this._dataInVisiable()).domain());
    this.yScaleOfVolume.domain(techan.scale.plot.volume(this._dataInVisiable()).domain());

    this.mainG.select('g.x.axis').call(this.xAxis);
    this.mainG.select('g.y.axis.right').call(this.yAxisRight);
    this.mainG.select('g.y.axis.left').call(this.yAxisLeft);
    this.mainG.select("g.volume.axis").call(this.volumeAxis);

    this.mainG.select("g.close").call(this.mainPlot);
    //this.mainG.select("g.candlestick").call(this.mainPlot);
    this.mainG.select("g.close.annotation").call(this.closeAnnotation);
    this.mainG.select("g.volume").call(this.volume);
    this.mainG.select("g.crosshair.ohlc").call(this.crosshair);
  };
  
  return Chart;
})();


var TraderLightChart = TraderLightChart || {};

TraderLightChart.CandleChart = (function(){

  function CandleChart(options){
    CandleChart.superClass.constructor.call(this, options);

    this._init();
    this.studies = [];
  }

  TraderLightChart.core.classExtend(CandleChart, TraderLightChart.BaseChart);

  CandleChart.prototype._init = function(){
    console.log('_init');
    this.zoomAssociated = false;

    this._initContainer();
    this._initMainSvg();
    this.createBehavior();
    this._createScale();
    this._createAxis();
    //this.createIndicators();
    this._createMainPlot();
    this._createAxisAnnotation();
    this._createCrossHair()
    this._conbine();
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

  CandleChart.prototype._createMainPlot = function(){
    console.log('_createMainPlot');
    if(!this.isReady) return;

    //this.mainPlot = techan.plot.ohlc()
    this.mainPlot = techan.plot.candlestick()
      .xScale(this.xScale)
      .yScale(this.yScale);

    this.accessor = this.mainPlot.accessor();

    this.volume = techan.plot.volume()
      .accessor(this.accessor)
      .xScale(this.xScale)
      .yScale(this.yScaleOfVolume);
  };

  CandleChart.prototype._conbine = function(){
    console.log('_conbine');
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

    this.mainG.append("g")
        .attr("class", "close annotation up");

    this.mainG.append("g")
        .attr("class", "volume axis");

    this.mainG.append('g')
        .attr("class", "crosshair ohlc");

    this._afterConbine();
  };

  CandleChart.prototype._bindData = function(){
    console.log('_bindData');
    this.mainG.select("g.candlestick").datum(this.data);
    var lastDatum = this.data[this.data.length-1];
    console.log('lastDatum:', lastDatum);
    this.mainG.select("g.close.annotation").datum([lastDatum]);
    //this._bindLineData(this.mainG.select("g.sma.ma-0"), this.smaCalculator(this.data));
    this._bindStudies();
    this.mainG.select("g.volume").datum(this.data);
  };

  CandleChart.prototype.draw = function(){
    if(!this.isReady) return;

    this._bindData();
    console.log('draw');

    //this.xScale.domain(this.data.map(this.accessor.d)); // same as the following line
    this.xScale.domain(techan.scale.plot.time(this.data).domain());
    this.xScale.zoomable().domain(this._domainInVisiable());

    // Update y scale min max, only on viewable zoomable.domain()
    this.yScale.domain(techan.scale.plot.ohlc(this._dataInVisiable()).domain());
    this.yScaleOfVolume.domain(techan.scale.plot.volume(this._dataInVisiable()).domain());

    this.mainG.select('g.x.axis').call(this.xAxis);
    this.mainG.select('g.y.axis.right').call(this.yAxisRight);
    this.mainG.select('g.y.axis.left').call(this.yAxisLeft);
    this.mainG.select("g.volume.axis").call(this.volumeAxis);

    this.mainG.select("g.candlestick").call(this.mainPlot);
    this.mainG.select("g.close.annotation").call(this.closeAnnotation);
    //this.mainG.select("g .sma.ma-0").call(this.sma);
    this._drawStudies();
    this.mainG.select("g.volume").call(this.volume);
    this.mainG.select("g.crosshair.ohlc").call(this.crosshair).call(this.zoom);

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

    this.mainG.select('g.x.axis').call(this.xAxis);
    this.mainG.select('g.y.axis.right').call(this.yAxisRight);
    this.mainG.select('g.y.axis.left').call(this.yAxisLeft);
    this.mainG.select("g.volume.axis").call(this.volumeAxis);

    this.mainG.select("g.candlestick").call(this.mainPlot.refresh);
    this.mainG.select("g.close.annotation").call(this.closeAnnotation.refresh);
    //this.mainG.select("g .sma.ma-0").call(this.sma.refresh);
    this._zoomStudies();
    this.mainG.select("g.volume").call(this.volume.refresh);
    this.mainG.select("g.crosshair.ohlc").call(this.crosshair.refresh);
  };

  CandleChart.prototype.addStudy = function(studyName, input, options){
    if(studyName!="Moving Average") return;
    var study = techan.plot.sma()
        .xScale(this.xScale)
        .yScale(this.yScale);
    var calculator = techan.indicator.sma()
        .period(input[0]);

    var cnt = this.studies.length;
    var studyClass = "ma-"+cnt;
    this.ohlcSelection.append("g")
      .attr("class", "indicator sma "+ studyClass)
      .attr("clip-path", "url(#ohlcClip)");

    var selector = this.mainG.select("g .sma." + studyClass);
    this.studies.push([selector, study, calculator]);
  };

  CandleChart.prototype._bindStudies = function(){
    for(var i=0; i < this.studies.length; i++){
      var selector = this.studies[i][0];
      var study = this.studies[i][1];
      var calculator = this.studies[i][2];
      this._bindLineData(selector, calculator(this.data));
    }
  };

  CandleChart.prototype._drawStudies = function(){
    for(var i=0; i < this.studies.length; i++){
      var selector = this.studies[i][0];
      var study = this.studies[i][1];
      var calculator = this.studies[i][2];
      selector.call(study);
    }
  };

  CandleChart.prototype._zoomStudies = function(){
    for(var i=0; i < this.studies.length; i++){
      var selector = this.studies[i][0];
      var study = this.studies[i][1];
      var calculator = this.studies[i][2];
      selector.call(study.refresh);
    }
  };

  return CandleChart;
})();
