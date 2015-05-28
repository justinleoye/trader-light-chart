
var tlc = new TraderLightChart();

d3.csv("data.csv", function(error, data) {
  var parseDate = d3.time.format("%d-%b-%y").parse;

  data = data.slice(0, 200).map(function(d) {
    return {
      date: parseDate(d.Date),
      open: +d.Open,
      high: +d.High,
      low: +d.Low,
      close: +d.Close,
      volume: +d.Volume
    };
  }).sort(function(a, b) { return d3.ascending(tlc.accessor.d(a), tlc.accessor.d(b)); });

  tlc.feedData(data);
  tlc.draw();

});
