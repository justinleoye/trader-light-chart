
var lc = new TraderLightChart.LineChart({
      container_id: 'trader_line_chart_container',
    });
var cc = new TraderLightChart.CandleChart({
      container_id: 'trader_candle_chart_container',
    });

testChart(lc);
testChart(cc);

function testChart(tlc){
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

    var initData = feed.splice(0,180);
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
}
