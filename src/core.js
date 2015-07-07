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
