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

    //this.xAxis = d3.svg.axis()
    //  .scale(this.xScale)
    //  .orient("bottom");
    this.yAxisRight = d3.svg.axis()
      .scale(this.yScale)
      .orient("right");
    this.yAxisLeft = d3.svg.axis()
      .scale(this.yScale)
      .orient("right");
    this.timeAxis = d3.svg.axis()
      .scale(this.timeScale)
      .orient("bottom");
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
      .translate([this.xScale(1), 0]);
    this.closeAnnotation
      .translate([this.xScale(1), 0]);
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
    //console.log('_setTimeScaleDomain');
    var domain = techan.scale.plot.time(this.data).domain();
    var timeScaleDomain = this._genTimeScaleDomain(domain);
    this.timeScale.domain(timeScaleDomain);
    if(this.options.interval != '1'){
      //console.log('zoom');
      //console.log('_domainInVisiable:', this._domainInVisiable());
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
        .attr("transform", "translate(" + this.xScale(1) + ",0)");
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

