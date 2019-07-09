# ArcGis for JavaScript SDK
> 作者：BLUE

> 日期：2019-07-09

> 描述：arcgis for js 开发包,基于arcgis for js 3.9

该开发包是基于arcgis for javascript 3.9，是对原始API的一个扩充，原始API正常使用，该SDK仅封装了开发过程中常用的方法，开发包内使用瓦片下载的方式对全国天地图底图进行加载，默认坐标系为**WGS 84**,如果你是**CGCS2000坐标系**，那你可以放心使用；如果需要使用其他REST服务作为底图，咱们另说。

【提示】所有的非原始方法都可以链式调用

## 目录

 - 使用步骤
 - BaseMap类（基础底图类）
    - changeBaseMap(id)    -- 切换底图类型
    - toggleLable()    -- 切换标注
    - goto(lng, lat , zoom?)    -- 定位点，将点拉到屏幕中心
    - adbLayer(layer, index?)    -- 附加图层,可用于图层管理
    - hideAttachLayer(name)    -- 隐藏附加图层
    - showAttachLayer(name)    -- 显示附加图层
    - destoryAttachLayer(name)    -- 销毁附加图层
    - hasLayer(name)    -- 判断图层是否存在
    - zoomIn(zoom)    -- 放大地图
    - zoomOut(zoom)    -- 缩小地图
    - addWMSLayer(url, name, extent, callback?)    -- 添加WMS图层
    - addPointGeoJsonLayer(name, url, infoTemplate1?, symbol?, callback?, options?, maxdraw?)    -- 添加GeoJson点图层
    - addLineGeoJsonLayer(name, url, infoTemplate1?, symbol?, callback?, options?, maxdraw?)    -- 添加GeoJson线图层
    - addGonGeoJsonLayer(name, url, infoTemplate1?, symbol?, callback?, options?, maxdraw?)    -- 添加GeoJson线图层

## 1. 使用步骤 ##

 - 将该SDK包放置于项目工程根目录，如果使用的静态化资源的情况，请**静态化该SDK包**以保证路径“/arcgisdk”可以访问SDK包内文件
 - 在html页面中添加资源引用，如果你是用的是模块化进行开发，请暂时将地图界面抽离成单独的html，该SDK可能会引起模块化关键字冲突


简洁版资源：
```
<link rel="stylesheet" type="text/css" href="/arcgisdk/3.9compact/js/esri/css/esri.css" />
<script type="text/javascript" src="/arcgisdk/3.9compact/init.js"></script>
```
完整版资源：
```
<link rel="stylesheet" type="text/css" href="/arcgisdk/3.9/js/esri/css/esri.css" />
<script type="text/javascript" src="/arcgisdk/3.9/init.js"></script>
```

 - 修改SDK包源码引用

   

>  若你是使用的完整版请将 **/arcgisdk/3.9compact/init.js** 和 **/arcgisdk/3.9compact/js/dojo/dojo/dojo.js** 中的 **localhost:8009** 修改成你的项目地址和端口

>  若你是使用的是完整版请将 **/arcgisdk/3.9/init.js** 和 **/arcgisdk/3.9/js/dojo/dojo/dojo.js** 中的 **localhost:8009** 修改成你的项目地址和端口

 - 请开始你的代码，下面是个初始化例子

```
<!--创建一个具有id属性的div-->
<div id='map' style="height: 100%;width:100%;background-color:darkgrey"></div>

<script>
    // 创建一个全局对象用于存储基础地图对象
    var baseMap = null;
    // 引入BaseMap模块
    require(["BAMAP/BaseMap"
    ], function (BaseMap) {
        // 实例化一个基础底图类
        baseMap = new BaseMap("map", { center: [116.39, 39.91],zoom:9 }).init();
    })
</script>
```

## 2.  Class: BaseMap（基础底图类）
基础底图类，该类继承于Map 对象，有关Map对象的资料请看[【这里】][1]
#### 2.1 AMD Module Require
```
require(["BAMAP/BaseMap"], function(BaseMap) { /* code goes here */ });
```
#### 2.2 Constructors

```
new BaseMap(divId, options?);
// 一般建议使用下面这样进行实例化的同时进行初始化，这样可以直接呈现底图
new BaseMap("map", { center: [116.39, 39.91],zoom:9 }).init();
```
[options参数请点击这里][2]

#### 2.3 Methods
- changeBaseMap(id)    -- 切换底图类型
- toggleLable()    -- 切换标注
- goto(lng, lat , zoom?)    -- 定位点，将点拉到屏幕中心
- adbLayer(layer, index?)    -- 附加图层,可用于图层管理
- hideAttachLayer(name)    -- 隐藏附加图层
- showAttachLayer(name)    -- 显示附加图层
- destoryAttachLayer(name)    -- 销毁附加图层
- hasLayer(name)    -- 判断图层是否存在
- zoomIn(zoom)    -- 放大地图
- zoomOut(zoom)    -- 缩小地图
- addWMSLayer(url, name, extent, callback?)    -- 添加WMS图层
- addPointGeoJsonLayer(name, url, infoTemplate1?, symbol?, callback?, options?, maxdraw?)    -- 添加GeoJson点图层
- addLineGeoJsonLayer(name, url, infoTemplate1?, symbol?, callback?, options?, maxdraw?)    -- 添加GeoJson线图层
- addGonGeoJsonLayer(name, url, infoTemplate1?, symbol?, callback?, options?, maxdraw?)    -- 添加GeoJson线图层

#### 2.4 Method Details

**# changeBaseMap(id)**

 切换底图类型
 - id <String> 【底图类型标识】 sldt-矢量底图,imgdt-影像底图,dxdt-地形底图


----------


**# toggleLable()**

 切换标注 


----------


**# goto(lng, lat, zoom?)**

将底图中心定位到指定位置

 - lng <Float>    经度
 - lat <Float>    纬度
 - zoom <Int>    缩放层级  默认当前层级


----------
**# adbLayer(layer, index?)**

特殊的附加图层，可用于图层管理，不建议直接使用原型的添加图层方法

 - layer <Layer>    所有继承于 esri/layers 的实例
 - index <Int>    图层层级
----------
**# hideAttachLayer(name)**

 隐藏附加图层，只针对 adbLayer 方法添加的图层有效
 - name <String>    图层名称或者id


----------
**# showAttachLayer(name)**

 显示附加图层，只针对 adbLayer 方法添加的图层有效
 - name <String>    图层名称或者id

----------
**# destoryAttachLayer(name)**

 销毁附加图层，只针对 adbLayer 方法添加的图层有效
 - name <String>    图层名称或者id

----------
**# hasLayer(name)**

 判断图层是否存在，只针对 adbLayer 方法添加的图层有效
 - name <String>    图层名称或者id

----------
**# zoomIn(zoom)**

 地图放大
 - zoom <Number>    放大层级

----------
**# zoomOut(zoom)**

 地图缩小
 - zoom <Number>    缩小层级

----------

**# addWMSLayer(url, name, extent, callback?)**

 添加WMS图层
 - url     <String>    WMS图层服务地址
 - name    <String>    命名空间:图层名称
 - extent  <Object>    坐标范围{xmin, ymin, xmax, ymax}
 - callback <Function> 回调函数

----------

**# addPointGeoJsonLayer(name, url, infoTemplate1?, symbol?, callback?, options?, maxdraw?)**

 添加GeoJson点图层
 - name <String>    图层名称或id
 - url    <String>    服务或GeoJson文件的地址（同域）
 - infoTemplate1 <Object>    信息框内容
 - symbol <Object>    imgurl & heigth & width
 - callback <Function> 回调函数
 - options <Object> GraphicsLayer类的所有构造参数，[点击查看][3]
 - maxdraw <Int> 最大绘制量  default 1,000,000


```
var infoTemplate1 = {
    title: "地块信息",
    content: "地块编码：${DKBM}<br/>面积（亩）：${面积亩}"
}
var symbol={
    imgurl:"/static/map/img/local-marker.png",
    width:10,
    height:10
}
baseMap.addPointGeoJsonLayer('dk', '/main/map/geodata/xinjingdk.json', infoTemplate1, symbol, function (layer) {/* code goes here */ });
```


----------

**# addLineGeoJsonLayer(name, url, infoTemplate1?, symbol?, callback?, options?, maxdraw?)**

 添加GeoJson点图层
 - name <String>    图层名称或id
 - url    <String>    服务或GeoJson文件的地址（同域）
 - infoTemplate1 <Object>    信息框内容
 - symbol <Object>    color & width
 - callback <Function> 回调函数
 - options <Object> GraphicsLayer类的所有构造参数，[点击查看][3]
 - maxdraw <Int> 最大绘制量  default 1,000,000

----------

**# addGonGeoJsonLayer(name, url, infoTemplate1?, symbol?, callback?, options?, maxdraw?)**

 添加GeoJson面图层
 - name <String>    图层名称或id
 - url    <String>    服务或GeoJson文件的地址（同域）
 - infoTemplate1 <Object>    信息框内容
 - symbol <Object>    color & width & fillcolor [255, 255, 0, 0.25]
 - callback <Function> 回调函数
 - options <Object> GraphicsLayer类的所有构造参数，[点击查看][3]
 - maxdraw <Int> 最大绘制量  default 1,000,000



  [1]: https://developers.arcgis.com/javascript/3/jsapi/map-amd.html
  [2]: https://developers.arcgis.com/javascript/3/jsapi/map-amd.html#map1
  [3]: https://developers.arcgis.com/javascript/3/jsapi/graphicslayer-amd.html#graphicslayer2