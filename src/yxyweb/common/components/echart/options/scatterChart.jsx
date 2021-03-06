import * as  eChartDemoData from '../eChartDemoData';
import * as  eChartCommon from '../eChartCommon';
// import 'echarts/map/js/china';
// import 'echarts/map/js/province/shandong';
import _ from 'lodash';
export function setOption(chartDisplayType, option, yySetting, data, skinConfig, panelType) {

  let dimensionCodeFileld = eChartCommon.eChartLabel.unionedXCode;///store_code
  let dimensionNameFileld = eChartCommon.eChartLabel.unionedXName;//store_name

  let measureValueFileld = yySetting.dataField.measure[0].valueField;//fMoney
  let LngAndLat = yySetting.dataField.LngAndLat;
  let symbolConfig = yySetting.symbolConfig;
  let seriesData = [];
  let maxValue = 0;
  let minValue = 99999999999;
  // if (yySetting.regionInfo && yySetting.regionInfo.geoName) {
  //   option.geo.map = yySetting.regionInfo.geoName;
  // }
  // else {
  //   eChartCommon.LogChartInfo("scatterChart setOption err yySetting中没有找到地图信息  yySetting ", JSON.stringify(yySetting), 999);
  // }
  // let diffSize = [];
  data.forEach(item => {
    // { name: "鄂尔多斯", value: [109.781327, 39.608266, 12] }
    let name = item[dimensionNameFileld];
    let longitude = item[LngAndLat.longitude.longitudeField];
    let latitude = item[LngAndLat.latitude.latitudeField];
    let value = item[measureValueFileld];
    if (!!name && isNaN(longitude) == false && isNaN(latitude) == false && isNaN(value) == false) {
      seriesData.push({ name: name, value: [longitude, latitude, value] });
      if (Number(value) > maxValue)
        maxValue = Number(value);
      if (Number(value) < minValue)
        minValue = Number(value);
      // if (diffSize.indexOf(value) < 0)
      //   diffSize.push(value);
    }
  });

  option.series[0].data = seriesData;
  if (symbolConfig.bShowSymbolBySize == true) {
    let zoomNum = 1;
    if (maxValue > 0) {
      zoomNum = maxValue / (symbolConfig.symbolMaxSize - symbolConfig.symbolMinSize + 1);
      option.series[0].symbolSize = function (val) {
        return (val[2] > 0 ? val[2] : 0) / zoomNum + symbolConfig.symbolMinSize;
      }
      option.series[1].symbolSize = function (val) {
        return (val[2] > 0 ? val[2] : 0) / zoomNum + symbolConfig.symbolMinSize;
      }
      // if (minValue < 0) {
      //   option.visualMap.inRange.color[0] = "white";
      // }
    }
    else {
      // maxValue =< 0 && minValue <= 0
      zoomNum = Math.abs(minValue) / (symbolConfig.symbolMaxSize - symbolConfig.symbolMinSize + 1);
      option.series[0].symbolSize = function (val) {
        return Math.abs(val[2]) / zoomNum + symbolConfig.symbolMinSize;
      }
      option.series[1].symbolSize = function (val) {
        return Math.abs(val[2]) / zoomNum + symbolConfig.symbolMinSize;
      }
    }

  }
  else {
    option.series[0].symbolSize = symbolConfig.symbolCommonSize;
    option.series[1].symbolSize = symbolConfig.symbolCommonSize;
  }

  if (symbolConfig.bShowSymbolByColor == true) {
    option.visualMap.min = minValue;
    option.visualMap.max = maxValue;
  }
  else {
    option.visualMap = undefined;
  }

  // option.bmap = {
  //   center: [104.114129, 37.550339],
  //   zoom: 5,
  //   roam: true,

  // }
  // option.geo = undefined;
  // option.series[0].coordinateSystem = 'bmap';
  // option.series[1].coordinateSystem = 'bmap';

  if (symbolConfig.bShowEffect) {
    option.series[1].data = seriesData.sort(function (a, b) {
      return b.value[2] - a.value[2];
    }).slice(0, symbolConfig.effectQty);
  }
  else {
    option.series = option.series.slice(0, 1);
  }
  // if (yySetting.orderInfo.orderBy == "asc")
  //   seriesData = seriesData.sort(function (a, b) { return a.value - b.value; });
  // if (yySetting.orderInfo.orderBy == "desc")
  //   seriesData = seriesData.sort(function (a, b) { return b.value - a.value; });
  // if (yySetting.rowNumber < seriesData.length)
  //   seriesData = seriesData.slice(0, yySetting.rowNumber);

  // option.calculable = true;
  // let series = [
  //   {
  //     data: seriesData,
  //     itemStyle: {
  //       normal: {
  //         color: function (params) { return colorList[params.dataIndex] }
  //       }
  //     }
  //   }
  // ]
  // option.series[0] = cb.utils.extend({}, option.series[0], series[0]);
  // option.series[0].label.lineHeight = 30;
  // option.series[0].label.padding = [24, 4, 24, 4];
  option.tooltip.formatter = function (params) {
    var result = '';
    // result = params.seriesName + "<br/>" + params.name + ":" + params.value[2];
    result = params.name + ":" + params.value[2];
    return result;
  };

  option.tooltip.fontSize = 12;
  // option.geo.label.emphasis.show = true;
  // option.geo.label.emphasis.color ='red';
  if (chartDisplayType == "panel")//如果在大屏展现，则需要特殊调整参数
  {
    if (panelType == 1) {
      delete option.backgroundColor;
      option.geo.roam = true;//可以缩放
      option.geo.itemStyle.normal.areaColor = 'rgba(128, 128, 128, 0.1)';
      _.set(option.series[1], "label.normal.show", false);//涟漪图不显示文字
      option.visualMap.inRange.color = ['#FFDA57', '#FFA334'];
    }
    else if (panelType == 2) {
      // _.set(option, "geo.label.emphasis.color", "#C6D9F9");//选中子区域时的文字颜色
      // option.geo.itemStyle.normal.areaColor = '#C6D9F9';//地图各省区的面积颜色
      _.set(option, "geo.itemStyle.emphasis.areaColor", "#C6D9F9");//选中子区域时的子区域颜色
    }
    else if (panelType == 3) {
      delete option.backgroundColor;
      option.geo.roam = false;//缩放
      option.geo.itemStyle.normal.areaColor = '#F2F3F6';//地图各省区的面积颜色
      option.geo.itemStyle.normal.borderColor = "#D5D7DD";//地图区域描边颜色
      _.set(option, "geo.itemStyle.emphasis.areaColor", "#98B9FA");//选中子区域时的颜色
      _.set(option, "geo.label.emphasis.color", "#333333");//选中子区域时的文字颜色
      option.visualMap.itemWidth = 8;
      option.visualMap.itemHeight = 50;
      option.geo.zoom = 1.2;
    }
  }
  else if (chartDisplayType == "mobile")//如果在移动端展现，则需要特殊调整参数
  {
    delete option.backgroundColor;
    option.geo.roam = false;//缩放
    option.geo.itemStyle.normal.areaColor = '#F2F3F6';//地图各省区的面积颜色
    option.geo.itemStyle.normal.borderColor = "#D5D7DD";//地图区域描边颜色
    _.set(option, "geo.itemStyle.emphasis.areaColor", "#98B9FA");//选中子区域时的颜色
    _.set(option, "geo.label.emphasis.color", "#333333");//选中子区域时的文字颜色
    option.visualMap.itemWidth = 8;
    option.visualMap.itemHeight = 65;
    option.geo.zoom = 1.2;
    // _.set(option, "visualMap.orient", "horizontal");
  }
  // else if (panelType == 2) {
  //   delete option.backgroundColor;
  //   option.geo.roam = true;//可以缩放
  //   option.geo.itemStyle.normal.areaColor = '#F0F1F4';//地图各省区的面积颜色
  //   // _.set(option, "title.textStyle.color", skinConfig.displaySkin.textColor);
  //   // _.set(option, "visualMap.textStyle.color", "blue");//颜色条的文字颜色
  //   // option.visualMap.inRange.color = ['#FFDA57', '#FFA334'];//颜色条的颜色区间
  //   // _.set(option, "geo.label.emphasis.color", "#C6D9F9");//选中子区域时的文字颜色
  //   _.set(option, "geo.itemStyle.emphasis.areaColor", "#98B9FA");//选中子区域时的颜色
  //   // _.set(option.series[1], "label.normal.textStyle.color", "blue");//气泡标注文字的颜色
  //   option.geo.itemStyle.normal.borderColor = "#D5D7DD";//地图区域描边颜色
  //   option.geo.itemStyle.normal.borderWidth = 2;
  // }
  if (!!skinConfig && skinConfig.displaySkin) {
    _.set(option, "title.textStyle.color", skinConfig.displaySkin.textColor);
    _.set(option, "visualMap.textStyle.color", skinConfig.displaySkin.textColor);
    // _.set(option, "geo.label.emphasis.color", skinConfig.displaySkin.textColor);
    // _.set(option.series[1], "itemStyle.normal.color", skinConfig.displaySkin.textColor);
    _.set(option.series[0], "label.normal.textStyle.color", skinConfig.displaySkin.textColor);
    _.set(option.series[1], "label.normal.textStyle.color", skinConfig.displaySkin.textColor);


    _.set(option, "geo.label.emphasis.color", skinConfig.displaySkin.scatterChart_LabelEmphasisColor);
    _.set(option, "geo.itemStyle.emphasis.opacity", skinConfig.displaySkin.scatterChart_ItemStyleEmphasisOpacity);
  }



  // option.geo.label.emphasis.color = scatterChart_LabelEmphasisColor;
  // option.geo.label.emphasis.fontSize = 12;
  // option.geo.itemStyle.normal.borderColor = "blue";
  // option.geo.itemStyle.emphasis.areaColor = 'red';
  // option.geo.itemStyle.emphasis.opacity = scatterChart_ItemStyleEmphasisOpacity;


  return option;
  // option = {
  //   backgroundColor: '#404a59',
  //   title: {
  //     text: '全国主要城市空气质量',
  //     subtext: 'data from PM25.in',
  //     sublink: 'http://www.pm25.in',
  //     x: 'center',
  //     textStyle: {
  //       color: '#fff'
  //     }
  //   },
  //   tooltip: {
  //     trigger: 'item',
  //     formatter: function (params) {
  //       return params.name + '  : ' + params.value[2];
  //     }
  //   },
  //   legend: {
  //     orient: 'vertical',
  //     y: 'bottom',
  //     x: 'right',
  //     data: ['pm2.5'],
  //     textStyle: {
  //       color: '#fff'
  //     }
  //   },
  //   visualMap: {
  //     min: 0,
  //     max: 300,
  //     calculable: true,
  //     inRange: {
  //       color: ['#50a3ba', '#eac736', '#d94e5d']
  //     },
  //     textStyle: {
  //       color: '#fff'
  //     }
  //   },
  //   geo: {
  //     map: 'china',
  //     roam: true,
  //     label: {
  //       emphasis: {
  //         show: false
  //       }
  //     },
  //     itemStyle: {
  //       normal: {
  //         areaColor: '#323c48',
  //         borderColor: '#111'
  //       },
  //       emphasis: {
  //         areaColor: '#2a333d'
  //       }
  //     }
  //   },
  //   series: [
  //     {
  //       name: 'pm2.5',
  //       type: 'scatter',
  //       coordinateSystem: 'geo',
  //       data: [
  //         { name: "海门", value: [121.15, 31.89, 9] },
  //         { name: "鄂尔多斯", value: [109.781327, 39.608266, 12] },
  //         { name: "招远", value: [120.38, 37.35, 12] },
  //         { name: "舟山", value: [122.207216, 29.985295, 12] },
  //         { name: "齐齐哈尔", value: [123.97, 47.33, 14] },
  //         { name: "盐城", value: [120.13, 33.38, 15] },
  //         { name: "赤峰", value: [118.87, 42.28, 16] },
  //         { name: "青岛", value: [120.33, 36.07, 18] },
  //         { name: "乳山", value: [121.52, 36.89, 18] },
  //         { name: "金昌", value: [102.188043, 38.520089, 19] },
  //         { name: "泉州", value: [118.58, 24.93, 21] },
  //         { name: "莱西", value: [120.53, 36.86, 21] },
  //         { name: "日照", value: [119.46, 35.42, 21] },
  //         { name: "胶南", value: [119.97, 35.88, 22] },
  //         { name: "南通", value: [121.05, 32.08, 23] },
  //         { name: "拉萨", value: [91.11, 29.97, 24] },
  //         { name: "云浮", value: [112.02, 22.93, 24] },
  //         { name: "梅州", value: [116.1, 24.55, 25] },
  //         { name: "文登", value: [122.05, 37.2, 25] },
  //         { name: "上海", value: [121.48, 31.22, 25] },
  //         { name: "攀枝花", value: [101.718637, 26.582347, 25] },
  //         { name: "威海", value: [122.1, 37.5, 25] },
  //         { name: "承德", value: [117.93, 40.97, 25] },
  //         { name: "厦门", value: [118.1, 24.46, 26] },
  //         { name: "汕尾", value: [115.375279, 22.786211, 26] },
  //         { name: "潮州", value: [116.63, 23.68, 26] },
  //         { name: "丹东", value: [124.37, 40.13, 27] },
  //         { name: "太仓", value: [121.1, 31.45, 27] },
  //         { name: "曲靖", value: [103.79, 25.51, 27] },
  //         { name: "烟台", value: [121.39, 37.52, 28] },
  //         { name: "福州", value: [119.3, 26.08, 29] },
  //         { name: "瓦房店", value: [121.979603, 39.627114, 30] },
  //         { name: "即墨", value: [120.45, 36.38, 30] },
  //         { name: "抚顺", value: [123.97, 41.97, 31] },
  //         { name: "玉溪", value: [102.52, 24.35, 31] },
  //         { name: "张家口", value: [114.87, 40.82, 31] },
  //         { name: "阳泉", value: [113.57, 37.85, 31] },
  //         { name: "莱州", value: [119.942327, 37.177017, 32] },
  //         { name: "湖州", value: [120.1, 30.86, 32] },
  //         { name: "汕头", value: [116.69, 23.39, 32] },
  //         { name: "昆山", value: [120.95, 31.39, 33] },
  //         { name: "宁波", value: [121.56, 29.86, 33] },
  //         { name: "湛江", value: [110.359377, 21.270708, 33] },
  //         { name: "揭阳", value: [116.35, 23.55, 34] },
  //         { name: "荣成", value: [122.41, 37.16, 34] },
  //         { name: "连云港", value: [119.16, 34.59, 35] },
  //         { name: "葫芦岛", value: [120.836932, 40.711052, 35] },
  //         { name: "常熟", value: [120.74, 31.64, 36] },
  //         { name: "东莞", value: [113.75, 23.04, 36] },
  //         { name: "河源", value: [114.68, 23.73, 36] },
  //         { name: "淮安", value: [119.15, 33.5, 36] },
  //         { name: "泰州", value: [119.9, 32.49, 36] },
  //         { name: "南宁", value: [108.33, 22.84, 37] },
  //         { name: "营口", value: [122.18, 40.65, 37] },
  //         { name: "惠州", value: [114.4, 23.09, 37] },
  //         { name: "江阴", value: [120.26, 31.91, 37] },
  //         { name: "蓬莱", value: [120.75, 37.8, 37] },
  //         { name: "韶关", value: [113.62, 24.84, 38] },
  //         { name: "嘉峪关", value: [98.289152, 39.77313, 38] },
  //         { name: "广州", value: [113.23, 23.16, 38] },
  //         { name: "延安", value: [109.47, 36.6, 38] },
  //         { name: "太原", value: [112.53, 37.87, 39] },
  //         { name: "清远", value: [113.01, 23.7, 39] },
  //         { name: "中山", value: [113.38, 22.52, 39] },
  //         { name: "昆明", value: [102.73, 25.04, 39] },
  //         { name: "寿光", value: [118.73, 36.86, 40] },
  //         { name: "盘锦", value: [122.070714, 41.119997, 40] },
  //         { name: "长治", value: [113.08, 36.18, 41] },
  //         { name: "深圳", value: [114.07, 22.62, 41] },
  //         { name: "珠海", value: [113.52, 22.3, 42] },
  //         { name: "宿迁", value: [118.3, 33.96, 43] },
  //         { name: "咸阳", value: [108.72, 34.36, 43] },
  //         { name: "铜川", value: [109.11, 35.09, 44] },
  //         { name: "平度", value: [119.97, 36.77, 44] },
  //         { name: "佛山", value: [113.11, 23.05, 44] },
  //         { name: "海口", value: [110.35, 20.02, 44] },
  //         { name: "江门", value: [113.06, 22.61, 45] },
  //         { name: "章丘", value: [117.53, 36.72, 45] },
  //         { name: "肇庆", value: [112.44, 23.05, 46] },
  //         { name: "大连", value: [121.62, 38.92, 47] },
  //         { name: "临汾", value: [111.5, 36.08, 47] },
  //         { name: "吴江", value: [120.63, 31.16, 47] },
  //         { name: "石嘴山", value: [106.39, 39.04, 49] },
  //         { name: "沈阳", value: [123.38, 41.8, 50] },
  //         { name: "苏州", value: [120.62, 31.32, 50] },
  //         { name: "茂名", value: [110.88, 21.68, 50] },
  //         { name: "嘉兴", value: [120.76, 30.77, 51] },
  //         { name: "长春", value: [125.35, 43.88, 51] },
  //         { name: "胶州", value: [120.03336, 36.264622, 52] },
  //         { name: "银川", value: [106.27, 38.47, 52] },
  //         { name: "张家港", value: [120.555821, 31.875428, 52] },
  //         { name: "三门峡", value: [111.19, 34.76, 53] },
  //         { name: "锦州", value: [121.15, 41.13, 54] },
  //         { name: "南昌", value: [115.89, 28.68, 54] },
  //         { name: "柳州", value: [109.4, 24.33, 54] },
  //         { name: "三亚", value: [109.511909, 18.252847, 54] },
  //         { name: "自贡", value: [104.778442, 29.33903, 56] },
  //         { name: "吉林", value: [126.57, 43.87, 56] },
  //         { name: "阳江", value: [111.95, 21.85, 57] },
  //         { name: "泸州", value: [105.39, 28.91, 57] },
  //         { name: "西宁", value: [101.74, 36.56, 57] },
  //         { name: "宜宾", value: [104.56, 29.77, 58] },
  //         { name: "呼和浩特", value: [111.65, 40.82, 58] },
  //         { name: "成都", value: [104.06, 30.67, 58] },
  //         { name: "大同", value: [113.3, 40.12, 58] },
  //         { name: "镇江", value: [119.44, 32.2, 59] },
  //         { name: "桂林", value: [110.28, 25.29, 59] },
  //         { name: "张家界", value: [110.479191, 29.117096, 59] },
  //         { name: "宜兴", value: [119.82, 31.36, 59] },
  //         { name: "北海", value: [109.12, 21.49, 60] },
  //         { name: "西安", value: [108.95, 34.27, 61] },
  //         { name: "金坛", value: [119.56, 31.74, 62] },
  //         { name: "东营", value: [118.49, 37.46, 62] },
  //         { name: "牡丹江", value: [129.58, 44.6, 63] },
  //         { name: "遵义", value: [106.9, 27.7, 63] },
  //         { name: "绍兴", value: [120.58, 30.01, 63] },
  //         { name: "扬州", value: [119.42, 32.39, 64] },
  //         { name: "常州", value: [119.95, 31.79, 64] },
  //         { name: "潍坊", value: [119.1, 36.62, 65] },
  //         { name: "重庆", value: [106.54, 29.59, 66] },
  //         { name: "台州", value: [121.420757, 28.656386, 67] },
  //         { name: "南京", value: [118.78, 32.04, 67] },
  //         { name: "滨州", value: [118.03, 37.36, 70] },
  //         { name: "贵阳", value: [106.71, 26.57, 71] },
  //         { name: "无锡", value: [120.29, 31.59, 71] },
  //         { name: "本溪", value: [123.73, 41.3, 71] },
  //         { name: "克拉玛依", value: [84.77, 45.59, 72] },
  //         { name: "渭南", value: [109.5, 34.52, 72] },
  //         { name: "马鞍山", value: [118.48, 31.56, 72] },
  //         { name: "宝鸡", value: [107.15, 34.38, 72] },
  //         { name: "焦作", value: [113.21, 35.24, 75] },
  //         { name: "句容", value: [119.16, 31.95, 75] },
  //         { name: "北京", value: [116.46, 39.92, 79] },
  //         { name: "徐州", value: [117.2, 34.26, 79] },
  //         { name: "衡水", value: [115.72, 37.72, 80] },
  //         { name: "包头", value: [110, 40.58, 80] },
  //         { name: "绵阳", value: [104.73, 31.48, 80] },
  //         { name: "乌鲁木齐", value: [87.68, 43.77, 84] },
  //         { name: "枣庄", value: [117.57, 34.86, 84] },
  //         { name: "杭州", value: [120.19, 30.26, 84] },
  //         { name: "淄博", value: [118.05, 36.78, 85] },
  //         { name: "鞍山", value: [122.85, 41.12, 86] },
  //         { name: "溧阳", value: [119.48, 31.43, 86] },
  //         { name: "库尔勒", value: [86.06, 41.68, 86] },
  //         { name: "安阳", value: [114.35, 36.1, 90] },
  //         { name: "开封", value: [114.35, 34.79, 90] },
  //         { name: "济南", value: [117, 36.65, 92] },
  //         { name: "德阳", value: [104.37, 31.13, 93] },
  //         { name: "温州", value: [120.65, 28.01, 95] },
  //         { name: "九江", value: [115.97, 29.71, 96] },
  //         { name: "邯郸", value: [114.47, 36.6, 98] },
  //         { name: "临安", value: [119.72, 30.23, 99] },
  //         { name: "兰州", value: [103.73, 36.03, 99] },
  //         { name: "沧州", value: [116.83, 38.33, 100] },
  //         { name: "临沂", value: [118.35, 35.05, 103] },
  //         { name: "南充", value: [106.110698, 30.837793, 104] },
  //         { name: "天津", value: [117.2, 39.13, 105] },
  //         { name: "富阳", value: [119.95, 30.07, 106] },
  //         { name: "泰安", value: [117.13, 36.18, 112] },
  //         { name: "诸暨", value: [120.23, 29.71, 112] },
  //         { name: "郑州", value: [113.65, 34.76, 113] },
  //         { name: "哈尔滨", value: [126.63, 45.75, 114] },
  //         { name: "聊城", value: [115.97, 36.45, 116] },
  //         { name: "芜湖", value: [118.38, 31.33, 117] },
  //         { name: "唐山", value: [118.02, 39.63, 119] },
  //         { name: "平顶山", value: [113.29, 33.75, 119] },
  //         { name: "邢台", value: [114.48, 37.05, 119] },
  //         { name: "德州", value: [116.29, 37.45, 120] },
  //         { name: "济宁", value: [116.59, 35.38, 120] },
  //         { name: "荆州", value: [112.239741, 30.335165, 127] },
  //         { name: "宜昌", value: [111.3, 30.7, 130] },
  //         { name: "义乌", value: [120.06, 29.32, 132] },
  //         { name: "丽水", value: [119.92, 28.45, 133] },
  //         { name: "洛阳", value: [112.44, 34.7, 134] },
  //         { name: "秦皇岛", value: [119.57, 39.95, 136] },
  //         { name: "株洲", value: [113.16, 27.83, 143] },
  //         { name: "石家庄", value: [114.48, 38.03, 147] },
  //         { name: "莱芜", value: [117.67, 36.19, 148] },
  //         { name: "常德", value: [111.69, 29.05, 152] },
  //         { name: "保定", value: [115.48, 38.85, 153] },
  //         { name: "湘潭", value: [112.91, 27.87, 154] },
  //         { name: "金华", value: [119.64, 29.12, 157] },
  //         { name: "岳阳", value: [113.09, 29.37, 169] },
  //         { name: "长沙", value: [113, 28.21, 175] },
  //         { name: "衢州", value: [118.88, 28.97, 177] },
  //         { name: "廊坊", value: [116.7, 39.53, 193] },
  //         { name: "菏泽", value: [115.480656, 35.23375, 194] },
  //         { name: "合肥", value: [117.27, 31.86, 229] },
  //         { name: "武汉", value: [114.31, 30.52, 273] },
  //         { name: "大庆", value: [125.03, 46.58, 288] }
  //       ],
  //       symbolSize: 12,
  //       label: {
  //         normal: {
  //           show: false
  //         },
  //         emphasis: {
  //           show: false
  //         }
  //       },
  //       itemStyle: {
  //         emphasis: {
  //           borderColor: '#fff',
  //           borderWidth: 1
  //         }
  //       }
  //     }
  //   ]
  // }
  // return option;
}
