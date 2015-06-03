var TraderLightChart = TraderLightChart || {};
TraderLightChart.core = TraderLightChart.core || {};

(function(core){
  core.CHART_GLOABLE_CSS = "



path.line {
    fill: none;
    stroke: #000000;
    stroke-width: 1;
}

.axis path,
.axis line {
    fill: none;
    stroke: #000;
    shape-rendering: crispEdges;
}

path {
    fill: none;
    stroke-width: 1;
}

path.candle {
    stroke: #000000;
}

path.candle.body {
    stroke-width: 0;
}

path.candle.up {
    fill: #00AA00;
    stroke: #00AA00;
}

path.candle.down {
    fill: #FF0000;
    stroke: #FF0000;
}

path.ohlc {
    stroke: #000000;
    stroke-width: 1;
}

path.ohlc.up {
    stroke: #00AA00;
}

path.ohlc.down {
    stroke: #FF0000;
}

.close.annotation.up path {
    fill: #00AA00;
}

.ma-0 path.line {
    stroke: #1f77b4;
}

.ma-1 path.line {
    stroke: #aec7e8;
}

path.volume {
    fill: #EEEEEE;
}

.crosshair {
    cursor: crosshair;
}

.crosshair path.wire {
    stroke: #DDDDDD;
    stroke-dasharray: 1, 1;
}

.crosshair .axisannotation path {
    fill: #DDDDDD;
}



    ";
})(TraderLightChart.core);
