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
    this.pending = [];
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
    this._clearPending();
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
    console.log('reInit');
    if(!this.canReInit) return;
    this._init();
    this.draw();
  };

  return Chart;
})();

