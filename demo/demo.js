
//test('D', {zoomable: true, movable: true});
//test('W');
//test('M');
testIntrady();

function test(interval, options){
  var lc = new TraderLightChart.LineChart({
        container_id: 'trader_line_chart_container',
        interval: interval,
      });
  var cc = new TraderLightChart.CandleChart({
        container_id: 'trader_candle_chart_container',
        interval: interval,
        zoomable: options.zoomable,
        movable: options.movable
      });

  lc.addSupstance({price: 14.03});
  lc.addSupstance({price: 8.03});
  lc.addTrendline({
    start: {
      time: '2014-05-23',
      price: 10.0
    },
    end: {
      time: '2014-06-30',
      price: 12.5
    }
  });

  cc.addStudy('Moving Average', [5]);
  cc.addStudy('Moving Average', [10]);
  cc.addStudy('Moving Average', [20]);
  cc.addStudy('Moving Average', [60]);
  cc.addStudy('Moving Average', [120]);
  cc.addStudy('Moving Average', [250]);
  cc.addSupstance({price: 14.03});
  cc.addSupstance({price: 8.03});
  cc.addTrendline({
    start: {
      time: '2014-05-23',
      price: 10.0
    },
    end: {
      time: '2014-06-30',
      price: 12.5
    }
  });

  //testChartWithCSV(lc);
  //testChartWithCSV(cc);

  switch(interval){
    case 'D':
      testChartWithJSON(lc,'day');
      testChartWithJSON(cc, 'day');
      break;
    case 'W':
      testChartWithJSON(lc,'week');
      testChartWithJSON(cc, 'week');
      break;
    case 'M':
      testChartWithJSON(lc,'month');
      testChartWithJSON(cc, 'month');
      break;
  }
}

var lcIntradayDebug, ccIntradayDebug;

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


  lcIntradayDebug = lcIntraday;
  ccIntradayDebug = ccIntraday;

  lcIntraday.addSupstance({price: 20.03});
  lcIntraday.addSupstance({price: 17.03});
  ccIntraday.addSupstance({price: 20.03});
  ccIntraday.addSupstance({price: 17.03});

  lcIntraday.setSuspended(true);
  ccIntraday.setSuspended(true);

  lcIntraday.setBaseDatum({time: "2015-05-13T15:00:00+08:00", high: 20.03, open: 20.03, low: 17.03, close: 17.03, volume: 0});
  ccIntraday.setBaseDatum({time: "2015-05-13T15:00:00+08:00", high: 20.03, open: 20.03, low: 17.03, close: 17.03, volume: 0});

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

    var feed = data['data'][type].map(function(d) {
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

    var initData = feed.splice(0, 230);
    //var initData = feed.splice(0, 1000000);
    console.log('feed length:', feed.length);
    //tlc.feedData(initData);
    tlc.draw();


    //drawBarsOneByOne();

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

