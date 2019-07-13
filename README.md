# ArcGis for JavaScript SDK
] 作者：BLUE

] 日期：2019-07-09

] 描述：arcgis for js 开发包,基于arcgis for js 3.9

该开发包是基于arcgis for javascript 3.9，是对原始API的一个扩充，原始API正常使用，该SDK仅封装了开发过程中常用的方法，开发包内使用瓦片下载的方式对全国天地图底图进行加载，默认坐标系为**WGS 84**,如果你是**CGCS2000坐标系**，那你可以放心使用；如果需要使用其他REST服务作为底图，咱们另说。


## 目录

 - 使用步骤
 - BaseMap类（基础底图类）
    - initTdt()    -- 初始化全国天地图底图
    - initTiledMap(sldtserver?,slbzserver?,yxdtserver?)    -- 初始化缓存映射服务资源作为底图
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
 - DrawLayer类（绘制类）
    - drawPoint（callback?）    -- 绘制点
    - drawMultiPoint（callback?）    --绘制多点
    - drawLine（callback?)    -- 绘制直线段
    - drawPolyLine（callback?）    -- 绘制折线
    - drawPolyGon（callback?）    -- 绘制多边形
    - drawFreePolyGon(callback?)    -- 手绘多边形
    - drawArrow(callback?)    -- 绘制箭头
    - drawTrianGle(callback?)    -- 绘制三角形
    - drawCircle(callback?)    -- 绘制圆形
    - drawEllipse(callback?)    -- 绘制椭圆
    - drawRectangle(callback?)  -- 绘制矩形
    - clear()    -- 清除绘制并释放绘制状态
    - clsAndte()    -- 清除绘制并保持绘制状态
    - deactivate()    -- 释放绘制状态不清空绘制要素
 - GraphicLayer类（要素图层类）
    - addPoint(lng, lat, infoTemplate?, attr?, symbol?, localAnim?)    -- 添加点要素
    - addMultiPoint(points, infoTemplate?, attr?, symbol?)    -- 添加多点
    - addLine(path, infoTemplate?, attr?, symbol?)    -- 添加线要素
    - addGon(path, infoTemplate?, attr?, symbol?)    -- 添加面要素
    - addCricle(lng, lat, radius?, infoTemplate?, attr?, symbol?)    -- 添加圆
    - addText(text, lng, lat, symbol?, offset?)    -- 添加文字要素
    - addFlowText(text, path, symbol?, offset?)    -- 添加流式文字/沿线文字(均分字间距)
    - addSupFlowText(text, path, symbol?, offset?)    -- 添加流式文字/沿线文字(路径点坐标)
  
- DijitLayer类（工具类）
    - measureDis()    -- 测距
    - measureArea()    -- 测面
    - clearMeas()    -- 清空测量数据

## 1. 使用步骤 ##

 - 将该SDK包放置于项目工程根目录，如果使用的静态化资源的情况，请**静态化该SDK包**以保证路径“/arcgisdk”可以访问SDK包内文件
 - 在html页面中添加资源引用，如果你是用的是模块化进行开发，请暂时将地图界面抽离成单独的html，该SDK可能会引起模块化关键字冲突


简洁版资源：
```
[link rel="stylesheet" type="text/css" href="/arcgisdk/3.9compact/js/esri/css/esri.css" /]
[script type="text/javascript" src="/arcgisdk/3.9compact/init.js"][/script]
```
完整版资源：
```
[link rel="stylesheet" type="text/css" href="/arcgisdk/3.9/js/esri/css/esri.css" /]
[script type="text/javascript" src="/arcgisdk/3.9/init.js"][/script]
```

 - 修改SDK包源码引用

   

]  若你是使用的完整版请将 **/arcgisdk/3.9compact/init.js** 和 **/arcgisdk/3.9compact/js/dojo/dojo/dojo.js** 中的 **localhost:8009** 修改成你的项目地址和端口

]  若你是使用的是完整版请将 **/arcgisdk/3.9/init.js** 和 **/arcgisdk/3.9/js/dojo/dojo/dojo.js** 中的 **localhost:8009** 修改成你的项目地址和端口

 - 请开始你的代码，下面是个初始化例子

```
[!--创建一个具有id属性的div--]
[div id='map' style="height: 100%;width:100%;background-color:darkgrey"][/div]

[script]
    // 创建一个全局对象用于存储基础地图对象
    var baseMap = null;
    // 引入BaseMap模块
    require(["BAMAP/BaseMap"
    ], function (BaseMap) {
        // 实例化一个基础底图类
        baseMap = new BaseMap("map", { center: [116.39, 39.91],zoom:9 }).init();
    })
[/script]
```

## 2.  Class: BaseMap（基础底图类）
基础底图类，该类继承于Map 对象，有关Map对象的资料请看[【这里】][1]

【提示】该类所有的非原始方法都可以链式调用
#### 2.1 AMD Module Require
```
require(["BAMAP/BaseMap"], function(BaseMap) { /* code goes here */ });
```
#### 2.2 Constructors

```
new BaseMap(divId, options?);
// 一般建议使用下面这样进行实例化的同时进行初始化，这样可以直接呈现底图
new BaseMap("map", { center: [116.39, 39.91],zoom:9 }).initTdt();
```
[options参数请点击这里][2]


#### 2.3 Method Details

**# initTdt()**

初始化全国天地图作为底图

----------
**# initTiledMap(sldtserver?,slbzserver?,yxdtserver?)**

初始化有公开的缓存映射服务资源作为底图

【提示】默认加载成都天地图作为底图，不保证永远能成功，如果服务被关闭则加载会失败
- sldtserver [String] 电子底图服务地址
- slbzserver [String] 矢量标注服务地址
- yxdtserver [String] 影像底图服务地址


----------


**# changeBaseMap(id)**

切换底图类型
- id [String] 底图类型标识 sldt-矢量底图,imgdt-影像底图,dxdt-地形底图


----------


**# toggleLable()**

切换标注 


----------


**# goto(lng, lat, zoom?)**

将底图中心定位到指定位置

- lng [Float]    经度
- lat [Float]    纬度
- zoom [Int]    缩放层级  默认当前层级


----------
**# adbLayer(layer, index?)**

特殊的附加图层，可用于图层管理，不建议直接使用原型的添加图层方法

- layer [Layer]    所有继承于 esri/layers 的实例
- index [Int]    图层层级，值越大越靠近用户
----------
**# hideAttachLayer(name)**

隐藏附加图层，只针对 adbLayer 方法添加的图层有效
- name [String]    图层名称或者id


----------
**# showAttachLayer(name)**

显示附加图层，只针对 adbLayer 方法添加的图层有效
- name [String]    图层名称或者id

----------
**# destoryAttachLayer(name)**

销毁附加图层，只针对 adbLayer 方法添加的图层有效
- name [String]    图层名称或者id

----------
**# hasLayer(name)**

判断图层是否存在，只针对 adbLayer 方法添加的图层有效
- name [String]    图层名称或者id

----------
**# zoomIn(zoom)**

地图放大
- zoom [Number]    放大层级

----------
**# zoomOut(zoom)**

地图缩小
- zoom [Number]    缩小层级

----------
**# addWMSLayer(url, name, extent, callback?)**

添加WMS图层
- url [String]    WMS图层服务地址
- name [String]    命名空间:图层名称
- extent [Object]    坐标范围{xmin, ymin, xmax, ymax}
- callback [Function] 回调函数
----------

**# addPointGeoJsonLayer(name, url, infoTemplate1?, symbol?, callback?, options?, maxdraw?)**

添加GeoJson点图层
- name [String]    图层名称或id
- url    [String]    服务或GeoJson文件的地址（同域）
- infoTemplate1 [Object]    信息框内容
- symbol [Object]    imgurl & heigth & width
- callback [Function] 回调函数
- options [Object] GraphicsLayer类的所有构造参数，[点击查看][3]
- maxdraw [Int] 最大绘制量  default 1,000,000
【注意】调用此API时候请添加以下两个引用

```
[script src="/arcgisdk/vendor/terraformer/terraformer.min.js"][/script]
[script src="/arcgisdk/vendor/terraformer-arcgis-parser/terraformer-arcgis-parser.min.js"][/script]
```

```
var infoTemplate1 = {
    title: "地块信息",
    content: "地块编码：${DKBM}[br/]面积（亩）：${面积亩}"
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
- name [String]    图层名称或id
- url    [String]    服务或GeoJson文件的地址（同域）
- infoTemplate1 [Object]    信息框内容
- symbol [Object]    color & width
- callback [Function] 回调函数
- options [Object] GraphicsLayer类的所有构造参数，[点击查看][3]
- maxdraw [Int] 最大绘制量  default 1,000,000

【注意】调用此API时候请添加以下两个引用

```
[script src="/arcgisdk/vendor/terraformer/terraformer.min.js"][/script]
[script src="/arcgisdk/vendor/terraformer-arcgis-parser/terraformer-arcgis-parser.min.js"][/script]
```
----------

**# addGonGeoJsonLayer(name, url, infoTemplate1?, symbol?, callback?, options?, maxdraw?)**

添加GeoJson面图层
- name [String]    图层名称或id
- url    [String]    服务或GeoJson文件的地址（同域）
- infoTemplate1 [Object]    信息框内容
- symbol [Object]    color & width & fillcolor [255, 255, 0, 0.25]
- callback [Function] 回调函数
- options [Object] GraphicsLayer类的所有构造参数，[点击查看][3]
- maxdraw [Int] 最大绘制量  default 1,000,000

【注意】调用此API时候请添加以下两个引用

```
[script src="/arcgisdk/vendor/terraformer/terraformer.min.js"][/script]
[script src="/arcgisdk/vendor/terraformer-arcgis-parser/terraformer-arcgis-parser.min.js"][/script]
```
## 3.  Class: DrawLayer（绘制类）
图形绘制类，该类中封装了一些常用的绘制方法；实例化是时候传入BaseMap实例对象，不要将该类的实例作为图层叠加。

#### 3.1 AMD Module Require
```
require(["BAMAP/DrawLayer"], function(DrawLayer) { /* code goes here */ });
```
#### 3.2 Constructors

```
new DrawLayer(Map)
// Map为BaseMap类的实例
```
#### 3.3 Method Details
**# drawPoint(callback?)**

绘制点
- callback [Function] 绘制完成的回调函数,相关的绘制信息以回调参数对象传入

----------
**# drawMultiPoint(callback?)**

绘制多点
- callback [Function] 绘制完成的回调函数,相关的绘制信息以回调参数对象传入

----------
**# drawLine(callback?)**

绘制直线段
- callback [Function] 绘制完成的回调函数,相关的绘制信息以回调参数对象传入

----------
**# drawPolyLine(callback?)**

绘制折线
- callback [Function] 绘制完成的回调函数,相关的绘制信息以回调参数对象传入

----------

**# drawPolyGon(callback?)**

绘制多边形
- callback [Function] 绘制完成的回调函数,相关的绘制信息以回调参数对象传入

----------

**# drawFreePolyGon(callback?)**

手绘多边形
- callback [Function] 绘制完成的回调函数,相关的绘制信息以回调参数对象传入

----------
**# drawArrow(callback?)**

绘制箭头
- callback [Function] 绘制完成的回调函数,相关的绘制信息以回调参数对象传入

----------
**# drawTrianGle(callback?)**

绘制三角形
- callback [Function] 绘制完成的回调函数,相关的绘制信息以回调参数对象传入

----------
**# drawCircle(callback?)**

绘制圆形
- callback [Function] 绘制完成的回调函数,相关的绘制信息以回调参数对象传入

----------
**# drawEllipse(callback?)**

绘制椭圆
- callback [Function] 绘制完成的回调函数,相关的绘制信息以回调参数对象传入

----------

**# drawRectangle(callback?)**

绘制矩形
- callback [Function] 绘制完成的回调函数,相关的绘制信息以回调参数对象传入

----------
**# clear()**

清除绘制图层并释放绘制状态

----------
**# clsAndte()**

清除绘制并保持绘制状态

----------
**# deactivate()**

释放绘制状态不清空绘制要素

## 4.  Class: GraphicLayer（要素图层类）
该图层类可根据坐标点绘制各种各样的要素，常用于绘制专题图层，该对象继承于GraphicsLayer对象，有关GraphicsLayer对象的信息，你可以戳[【这里】][6]

【注意】该图层的方法需要调在实例添加到BaseMap中后才可以使用，也就是调用BaseMap的adbLayer方法之后

#### 4.1 AMD Module Require
```
require(["BAMAP/GraphicLayer"], function(GraphicLayer) { /* code goes here */ });
```
#### 4.2 Constructors

```
new GraphicLayer(options?)
```
有关options的详情，戳[【这里】][7]
#### 4.3 Method Details
**# addPoint(lng, lat, infoTemplate?, attr?, symbol?, localAnim?)**

添加点要素
- lng [Float] 经度
- lat [Float] 纬度
- infoTemplate [Object] 信息框格式{title:标题，content:正文}
- attr [Object] 该要素的属性值，供infoTemplate使用
- symbol [Object] 点样式{url:图片路径，width：宽，height:高}
- localAnim [Boolean] 动画，可用于定位的时候，默认为false

```
var infoTemplate = {title:"测试",content:"<h3>${foo}</h3>"};
var attr = {foo:"hello"}
```


----------
**# addMultiPoint(points, infoTemplate?, attr?, symbol?)**

添加多点要素
- points [Array] 二维经纬度数组
- infoTemplate [Object] 信息框格式{title:标题，content:正文}
- attr [Object] 该要素的属性值，供infoTemplate使用
- symbol [Object] 点样式{url:图片路径，width：宽，height:高}


----------
**# addLine(path, infoTemplate?, attr?, symbol?)**

添加线要素
- path [Array] 路径二维经纬度数组
- infoTemplate [Object] 信息框格式{title:标题，content:正文}
- attr [Object] 该要素的属性值，供infoTemplate使用
- symbol [Object] 要素样式{color:颜色，width：线宽}


----------
**# addGon(path, infoTemplate?, attr?, symbol?)**

添加面要素
- path [Array] 路径二维经纬度数组
- infoTemplate [Object] 信息框格式{title:标题，content:正文}
- attr [Object] 该要素的属性值，供infoTemplate使用
- symbol [Object] 要素样式{color:边线颜色，width：边线线宽，fillColor：填充色}
【提示】这儿得颜色最好使用[R,G,B,A]的形式


----------
**# addCricle(lng, lat, radius, infoTemplate?, attr?, symbol?)**

添加圆要素
- lng [Float] 经度
- lat [Float] 纬度
- radius [Number] 半径（米） 默认1000
- infoTemplate [Object] 信息框格式{title:标题，content:正文}
- attr [Object] 该要素的属性值，供infoTemplate使用
- symbol [Object] 要素样式{color:边线颜色，width：边线线宽，fillColor：填充色}
【提示】这儿得颜色最好使用[R,G,B,A]的形式


----------
**# addText(text, lng, lat, symbol?,offset?)**

添加文字要素
- text [String] 文字内容
- lng [Float] 经度
- lat [Float] 纬度
- symbol [Object] 要素样式{size：文字大小，family：文字字体，color：文字颜色}
- offset [Object] 文字坐标偏移 {x：横向偏移，y:纵向偏移}


----------
**# addFlowText(text, paths, symbol?,offset?)**

添加流式文字/沿线文字,均分文字间距
- text [String] 文字内容
- paths [Array] 线段坐标三维数组[[[x1,y1],[x2,y2]]]
- symbol [Object] 要素样式{size：文字大小，family：文字字体，color：文字颜色}
- offset [Object] 文字坐标偏移 {x：横向偏移，y:纵向偏移}
【注意】该方法不要大数据量调用，大数据量有内存溢出风险


----------
**# addSupFlowText(text, paths, symbol?,offset?)**

添加流式文字/沿线文字
该方法适用于线的坐标点数量大于文字数量时候，并不是均分文字间距
- text [String] 文字内容
- paths [Array] 线段坐标三维数组[[[x1,y1],[x2,y2]]]
- symbol [Object] 要素样式{size：文字大小，family：文字字体，color：文字颜色}
- offset [Object] 文字坐标偏移 {x：横向偏移，y:纵向偏移}



  [1]: https://developers.arcgis.com/javascript/3/jsapi/map-amd.html
  [2]: https://developers.arcgis.com/javascript/3/jsapi/map-amd.html#map1
  [3]: https://developers.arcgis.com/javascript/3/jsapi/graphicslayer-amd.html#graphicslayer2
  [4]: https://developers.arcgis.com/javascript/3/jsapi/graphicslayer-amd.html#graphicslayer2
  [5]: https://developers.arcgis.com/javascript/3/jsapi/graphicslayer-amd.html#graphicslayer2
  [6]: https://developers.arcgis.com/javascript/3/jsapi/graphicslayer-amd.html
  [7]: https://developers.arcgis.com/javascript/3/jsapi/graphicslayer-amd.html#graphicslayer2