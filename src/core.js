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

})(TraderLightChart.core);

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
  }

  // should override
  Chart.prototype.init = function(){
  };

  Chart.prototype.createScale = function(){
    console.log('createScale');
    this.xScale = techan.scale.financetime()
      .outerPadding(0);
    this.yScale = d3.scale.linear();

    this.yScaleOfVolume = d3.scale.linear();

    this.setScales();
  };

  Chart.prototype.setScales = function(){
    this.xScale.range([0, this.containerWidth - this.margin.left - this.margin.right]);
    this.yScale.range([this.containerHeight - this.margin.top - this.margin.bottom, 0]);
    this.yScaleOfVolume.range([this.yScale(0), this.yScale(0.2)]);
  }

  Chart.prototype.createAxis = function(){
    console.log('createAxis');
    this.xAxis = d3.svg.axis()
      .scale(this.xScale)
      .orient("bottom");
    this.yAxis = d3.svg.axis()
      .scale(this.yScale)
      .orient("right");
    this.volumeAxis = d3.svg.axis()
      .scale(this.yScaleOfVolume)
      .orient("right")
      .ticks(3)
      .tickFormat(d3.format(",.3s"));
  };

  // should override
  Chart.prototype.createMainPlot = function(){
  };

  Chart.prototype.createAxisAnnotation = function(){
    this.timeAnnotation = techan.plot.axisannotation()
      .axis(this.xAxis)
      .format(d3.time.format('%Y-%m-%d'))
      .width(65)
      .translate([0, this.containerHeight - this.margin.top - this.margin.bottom]);

    this.ohlcAnnotation = techan.plot.axisannotation()
      .axis(this.yAxis)
      .format(d3.format(',.2fs'))
      .translate([this.xScale(1), 0]);

    this.closeAnnotation = techan.plot.axisannotation()
      .axis(this.yAxis)
      .accessor(this.accessor)
      .format(d3.format(',.2fs'))
      .translate([this.xScale(1), 0]);

    this.volumeAnnotation = techan.plot.axisannotation()
      .axis(this.volumeAxis)
      .width(35);
  }

  Chart.prototype.createCrossHair = function(){
    this.crosshair = techan.plot.crosshair()
      .xScale(this.xScale)
      .yScale(this.yScale)
      .xAnnotation(this.timeAnnotation)
      .yAnnotation([this.ohlcAnnotation, this.volumeAnnotation]);
  }

  Chart.prototype.initContainer = function(){
    console.log('initContainer');
    
    this.containerElement = document.getElementById(this.options.container_id);
    this.setChartBasics();

    var _this = this;
    //this.containerElement.onresize = function(){
    window.onresize = function(){
      _this.onChartContainerResize();
    };

    this.containerSelector = d3.select("body div[id="+this.options.container_id+"]"); 
    this.maxVisiableBars = 120; // TODO: calculate it
  };

  Chart.prototype.setChartBasics = function(){
    // for test
    //var width = document.body.clientWidth * 0.9;
    //var height = document.body.clientHeight * 0.5;
    //this.containerElement.setAttribute("style","width:"+width+"px;"+"height:"+height+"px");

    this.containerWidth = this.containerElement.offsetWidth;
    this.containerHeight = this.containerElement.offsetHeight;

    console.log('offsetWidth: ' + this.containerWidth + ' ,offsetHeight: ' + this.containerHeight);
  };

  Chart.prototype.initMainSvg = function(){
    console.log('initMainSvg');
    this.mainSvg = this.containerSelector.append("svg")

    var defs = this.mainSvg.append("defs");
    this.rect = defs.append("clipPath")
          .attr("id", "ohlcClip")
      .append("rect")
          .attr("x", 0)
          .attr("y", 0);

    this.mainG  = this.mainSvg.append("g");
    this.setMainSvgSize();
  };

  Chart.prototype.setMainSvgSize = function(){
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
  Chart.prototype.conbine = function(){
  };

  Chart.prototype.setAxisesSize = function(){
    this.mainG.select('g.x.axis')
        .attr("transform", "translate(0," + (this.containerHeight - this.margin.top - this.margin.bottom) + ")");
    this.mainG.select('g.y.axis')
        .attr("transform", "translate(" + this.xScale(1) + ",0)");
  }; 

  Chart.prototype.feedData = function(data){
    console.log('feedData');
    for(var i=0; i < data.length; i++){
      var datum = {
        date: data[i].date || data[i].time,
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
  Chart.prototype.bindData = function(){
  };

  // should override
  Chart.prototype.draw = function(){
  };

  Chart.prototype.dataInVisiable = function(){
    var domain = this.domainInVisiable();
    return this.data.slice(domain[0], domain[1]);
  };

  Chart.prototype.domainInVisiable = function(){
    if(this.maxVisiableBars > this.data.length){
      return [0,this.data.length];
    }else{
      return [this.data.length - this.maxVisiableBars,this.data.length];
    }
  };

  Chart.prototype.bindLineData  = function(selection, data) {
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

  Chart.prototype.onChartContainerResize = function(){
    console.log('on resize');
    console.log('onChartContainerResize');
    this.setChartBasics();
    this.setMainSvgSize();
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

  return Chart;
})();

