var TraderLightChart = TraderLightChart || {};
TraderLightChart.core = TraderLightChart.core || {};

(function(core){
  core.CHART_GLOABLE_CSS = "


.trader-light-chart {
  font-size: 0.5rem;
}
.trader-light-chart path.line {
  fill: none;
  stroke: #000000;
  stroke-width: 1;
}
.trader-light-chart .axis path,
.trader-light-chart .axis line {
  fill: none;
  stroke: #555555;
  shape-rendering: crispEdges;
}
.trader-light-chart path {
  fill: none;
  stroke-width: 1;
}
.trader-light-chart path.candle {
  stroke: #000000;
  shape-rendering: crispEdges;
}
.trader-light-chart path.candle.body {
  stroke-width: 0;
  shape-rendering: crispEdges;
}
.trader-light-chart path.candle.up {
  fill: #d75442;
  stroke: #d75442;
  shape-rendering: crispEdges;
}
.trader-light-chart path.candle.down {
  fill: #6ba583;
  stroke: #6ba583;
  shape-rendering: crispEdges;
}
.trader-light-chart path.ohlc {
  stroke: #000000;
  stroke-width: 1;
}
.trader-light-chart path.ohlc.up {
  stroke: #d75442;
}
.trader-light-chart path.ohlc.down {
  stroke: #6ba583;
}
.trader-light-chart .close.annotation.up path {
  font-size: 0.5rem;
  fill: #00AA00;
}
.trader-light-chart .ma-0 path.line {
  stroke: #000000;
}
.trader-light-chart .ma-1 path.line {
  stroke: #2679CB;
}
.trader-light-chart .ma-2 path.line {
  stroke: #FA110F;
}
.trader-light-chart .ma-3 path.line {
  stroke: #00A800;
}
.trader-light-chart .ma-4 path.line {
  stroke: #C0C0C0;
}
.trader-light-chart .ma-5 path.line {
  stroke: #0000FF;
}
.trader-light-chart path.volume {
  fill: #EEEEEE;
}
.trader-light-chart .crosshair {
  cursor: crosshair;
}
.trader-light-chart .crosshair path.wire {
  stroke: #DDDDDD;
  stroke-dasharray: 1, 1;
}
.trader-light-chart .crosshair .axisannotation path {
  fill: #DDDDDD;
}
.trader-light-chart .analysis path,
.trader-light-chart .analysis circle {
  stroke: #7E7E7E;
  stroke-width: 0.8;
}
.trader-light-chart .interaction path,
.trader-light-chart .interaction circle {
  pointer-events: all;
}
.trader-light-chart .interaction .body {
  cursor: move;
}
.trader-light-chart .supstance path {
  stroke-dasharray: 2, 2;
}
.trader-light-chart .supstances .interaction path {
  pointer-events: all;
  cursor: ns-resize;
}
.trader-light-chart .mouseover .supstance path {
  stroke-width: 1.5;
}
.trader-light-chart .dragging .supstance path {
  stroke: darkblue;
}


    ";
})(TraderLightChart.core);
