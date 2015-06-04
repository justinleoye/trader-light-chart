
test();
//testIntrady();

function test(){
  var lc = new TraderLightChart.LineChart({
        container_id: 'trader_line_chart_container',
      });
  var cc = new TraderLightChart.CandleChart({
        container_id: 'trader_candle_chart_container',
      });

  cc.addStudy('Moving Average', [5]);
  cc.addStudy('Moving Average', [10]);
  cc.addStudy('Moving Average', [20]);
  cc.addStudy('Moving Average', [60]);
  cc.addStudy('Moving Average', [120]);
  cc.addStudy('Moving Average', [250]);

  //testChartWithCSV(lc);
  //testChartWithCSV(cc);

  //testChartWithJSON(lc,'intraday');
  //testChartWithJSON(cc, 'intraday');
  testChartWithJSON(lc,'week');
  testChartWithJSON(cc, 'week');
  //testChartWithJSON(lc,'month');
  //testChartWithJSON(cc, 'month');
}

function testIntrady(){
  var lcIntraday = new TraderLightChart.LineChart({
        container_id: 'trader_line_chart_container',
        interval: '1',
        maxVisiableBars: 240,
      });

  var ccIntraday = new TraderLightChart.CandleChart({
        container_id: 'trader_candle_chart_container',
        interval: '1',
        maxVisiableBars: 240,
      });

  testChartWithJSON(lcIntraday,'intraday');
  testChartWithJSON(ccIntraday, 'intraday');
}

function testChartWithCSV(tlc){
  d3.csv("data.csv", function(error, data) {
    var parseDate = d3.time.format("%d-%b-%y").parse;

    var feed = data.slice(0, 200).map(function(d) {
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
      }else{
        tlc.reInit();
      }
    }

  });
}

function testChartWithJSON(tlc, type){ // type: 'intraday'
  d3.json("portfolio_klines.json", function(error, data) {

    var feed = data['data'][type].slice(0, 200).map(function(d) {
      if(type=='intraday'){
        return {
          date: moment(d[0]).toDate(),
          open: +d[1],
          high: +d[1],
          low: +d[1],
          close: +d[1],
          volume: +d[2]
        };
      }else{
        return {
          date: moment(d[0]).toDate(),
          open: +d[1],
          high: +d[2],
          low: +d[3],
          close: +d[4],
          volume: +d[5]
        };
      }
    });

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
      }else{
        tlc.reInit();
      }
    }

  });
}

