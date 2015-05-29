
//var tlc = new TraderLightChart.LineChart();
var tlc = new TraderLightChart.CandleChart();

d3.csv("data.csv", function(error, data) {
  var parseDate = d3.time.format("%d-%b-%y").parse;

  feed = data.slice(0, 200).map(function(d) {
    return {
      date: parseDate(d.Date),
      open: +d.Open,
      high: +d.High,
      low: +d.Low,
      close: +d.Close,
      volume: +d.Volume
    };
  }).sort(function(a, b) { return d3.ascending(tlc.accessor.d(a), tlc.accessor.d(b)); });

  var initData = feed.splice(0,80);
  tlc.feedData(initData);
  tlc.draw();

  drawBarsOneByOne();

  function drawBarsOneByOne(){
    if(feed.length){
      tlc.feedData([feed.shift()]);
      tlc.draw();

      setTimeout(function(){
        drawBarsOneByOne();
      }, 1000);
    }
  }

});
