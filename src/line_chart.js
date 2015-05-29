var TraderLightChart = TraderLightChart || {};

TraderLightChart.LineChart = (function(){
  var margin = {
    top: 50,
    bottom: 5,
    left: 5,
    right: 5
  };

  function LineChart(options){
    this.options = {
      container_id: 'trader_line_chart_container',
    };

    this.init();
  }

  LineChart.prototype.init = function(){
    console.log('init');
    this.data = [];

    this.initContainer();
    this.initMainSvg();
    this.createScale();
    this.createAxis();
    this.createMainPlot();
    this.conbine();
  };

  LineChart.prototype.createScale = function(){
    console.log('createScale');
    this.xScale = techan.scale.financetime()
      .range([0, this.containerWidth])
      .outerPadding(0);
    this.yScale = d3.scale.linear()
      .range([this.containerHeight, 0]);
  };

  LineChart.prototype.createAxis = function(){
    console.log('createAxis');
    this.xAxis = d3.svg.axis()
      .scale(this.xScale)
      .orient("top");
    this.yAxis = d3.svg.axis()
      .scale(this.yScale)
      .orient("right");
  };

  LineChart.prototype.createMainPlot = function(){
    console.log('createMainPlot');
    this.mainPlot = techan.plot.close()
      .xScale(this.xScale)
      .yScale(this.yScale);

    this.accessor = this.mainPlot.accessor();
  };


  LineChart.prototype.initContainer = function(){
    console.log('initContainer');
    this.containerSelector = d3.select("body div[id="+this.options.container_id+"]"); 
    //this.containerSelector = d3.select("body"); 
    //this.containerWidth = this.containerSelector.clientWidth;
    this.containerWidth = 600;
    //this.containerHeight = this.containerSelector.clientHeight;
    this.containerHeight = 300;
    console.log('containerWidth:',this.containerWidth);
    console.log('containerHeight:',this.containerHeight);
  };

  LineChart.prototype.initMainSvg = function(){
    console.log('initMainSvg');
    this.mainSvg = this.containerSelector.append("svg")
      .attr("width", this.containerWidth)
      .attr("height", this.containerHeight)
      .append("g")
      .attr("transform", "translate("+margin.left+","+margin.top+")");
  };

  LineChart.prototype.conbine = function(){
    console.log('conbine');

    this.mainSvg.append('g')
      .attr("class", "close");

    this.mainSvg.append('g')
        .attr("class", "x axis")
        .attr("transform", "translate(0," + (this.containerHeight - margin.top) + ")");

    this.mainSvg.append('g')
        .attr("class", "y axis")
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Price ($)");
  };

  LineChart.prototype.feedData = function(data){
    console.log('feedData');
    this.data = this.data.concat(data);
    console.log('data:', this.data);
  };

  LineChart.prototype.bindData = function(){
    console.log('bindData');
    this.mainSvg.select('g.close').datum(this.data);
  };

  LineChart.prototype.draw = function(){
    console.log('draw');
    this.bindData();

    this.xScale.domain(this.data.map(this.accessor.d));
    this.yScale.domain(techan.scale.plot.ohlc(this.data, this.accessor).domain());

    this.mainSvg.select('g.x.axis').call(this.xAxis);
    this.mainSvg.select('g.y.axis').call(this.yAxis);
    this.mainSvg.select('g.close').call(this.mainPlot);
  };

  return LineChart;
})();
