/**
 * Created By Blue On 2019-07-12
 * 图解图层类，用于创建图层要素，根据坐标等绘制图形要素
 * 基于 ArcGis 3.9
 */
define([
    "dojo/_base/declare",
    "esri/layers/GraphicsLayer",
    "esri/geometry/Point",
    "esri/geometry/Polyline",
    "esri/geometry/Polygon",
    "esri/symbols/TextSymbol",
    "esri/symbols/PictureMarkerSymbol",
    "esri/symbols/SimpleLineSymbol",
    "esri/symbols/SimpleFillSymbol",
    "esri/symbols/Font",
    "esri/graphic",
    "esri/Color",
    "esri/InfoTemplate",
    "esri/SpatialReference",
    "dojo/domReady!"
], function (declare, GraphicsLayer, Point, Polyline, Polygon, TextSymbol, PictureMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol, Font, Graphic, Color, InfoTemplate, SpatialReference) {
    return declare('GraphicLayer', GraphicsLayer, {
        __version: 'V1.1.8',
        __author: 'BLUE',

        /**
         * 添加点要素
         * @param {Number} lng 经度
         * @param {Number} lat 纬度
         * @param {Object} infoTemplate {title:信息框标题，content:信息框正文，用${变量名}引用attr中的变量}
         * @param {Object} attr 该要素的属性值，供infoTemplate使用
         * @param {Object} symbol 要素样式{url:图片路径，width：宽，height:高}
         */
        addPoint: function (lng, lat, infoTemplate, attr, symbol, localAnim) {
            var ctx = this;
            if (lng && lat) {
                var map = this.getMap(),
                    symbol = symbol || {},
                    localAnim = localAnim || false,
                    infoTemplate = infoTemplate || {},
                    pt = new Point(lng, lat, new SpatialReference(map.spatialReference)),
                    symbol = new PictureMarkerSymbol(symbol.imgurl || "/arcgisdk/images/local-marker.png", symbol.width || 25, symbol.height || 25),
                    graphic = new Graphic(pt, symbol);
                if (infoTemplate.hasOwnProperty('content')) {
                    var infoTemplate = new InfoTemplate(infoTemplate.title || '标题', infoTemplate.content);
                    graphic.setAttributes(attr)
                    graphic.setInfoTemplate(infoTemplate)
                }
                if (localAnim) {
                    var localSymbol = new PictureMarkerSymbol("/arcgisdk/images/local-anim.gif", 30, 30);
                    var localGraphic = new Graphic(pt, localSymbol);
                    ctx.add(localGraphic);
                    setTimeout(function () {
                        ctx.remove(localGraphic);
                        ctx.add(graphic);
                    }, 2000);
                } else {
                    ctx.add(graphic);
                }
                this.on('mouse-over', function (evt) {
                    map.setMapCursor("pointer");
                })
                this.on('mouse-out', function (e) {
                    map.setMapCursor("default");
                })
            } else {
                throw new Error('The lng and lat parameter is required')
            }
        },

        /**
         * 添加线要素
         * @param {Array} path 路径二维数组
         * @param {Object} infoTemplate {title:信息框标题，content:信息框正文，用${变量名}引用attr中的变量}
         * @param {Object} attr 该要素的属性值，供infoTemplate使用
         * @param {Object} symbol 要素样式{color:颜色，width：线宽}
         */
        addLine: function (path, infoTemplate, attr, symbol) {
            if (path) {
                var ctx = this,
                    map = ctx.getMap(),
                    symbol = symbol || {},
                    infoTemplate = infoTemplate || {},
                    polyline = new Polyline({ paths: [path], spatialReference: map.spatialReference }),
                    sls = new SimpleLineSymbol(
                        SimpleLineSymbol.STYLE_SOLID,
                        new Color(symbol.color || "#3edc42"),
                        symbol.width || 3
                    ),
                    graphic = new Graphic(polyline, sls);
                if (infoTemplate.hasOwnProperty('content')) {
                    var infoTemplate = new InfoTemplate(infoTemplate.title || '标题', infoTemplate.content);
                    graphic.setAttributes(attr)
                    graphic.setInfoTemplate(infoTemplate)
                }
                ctx.add(graphic);
                this.on('mouse-over', function (evt) {
                    map.setMapCursor("pointer");
                })
                this.on('mouse-out', function (e) {
                    map.setMapCursor("default");
                })
            } else {
                throw new Error('The path parameter is required')
            }
        },

        /**
         * 添加面要素
         * @param {Array} path 路径二维数组
         * @param {Object} infoTemplate {title:信息框标题，content:信息框正文，用${变量名}引用attr中的变量}
         * @param {Object} attr 该要素的属性值，供infoTemplate使用
         * @param {Object} symbol 要素样式{color:边线颜色，width：边线线宽，fillColor：填充色}
         */
        addGon: function (path, infoTemplate, attr, symbol) {
            if (path) {
                var map = this.getMap(),
                    symbol = symbol || {},
                    infoTemplate = infoTemplate || {},
                    polygon = new Polygon({ rings: [path], spatialReference: map.spatialReference }),
                    sfs = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
                        new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASHDOT,
                            new Color(symbol.color || [255, 0, 0, 1]), symbol.width || 2), new Color(symbol.fillColor || [255, 255, 0, 0.25])
                    ),
                    graphic = new Graphic(polygon, sfs);
                if (infoTemplate.hasOwnProperty('content')) {
                    var infoTemplate = new InfoTemplate(infoTemplate.title || '标题', infoTemplate.content);
                    graphic.setAttributes(attr)
                    graphic.setInfoTemplate(infoTemplate)
                }
                this.add(graphic);
                this.on('mouse-over', function (evt) {
                    map.setMapCursor("pointer");
                })
                this.on('mouse-out', function (e) {
                    map.setMapCursor("default");
                })
            } else {
                throw new Error('The path parameter is required')
            }
        },

        /**
         * 添加文字要素
         * @param {Number} lng 经度
         * @param {Number} lat 纬度
         * @param {String} text 文字内容
         * @param {Object} symbol 文字样式配置 {size：文字大小，family：文字字体，color：文字颜色}
         * @param {Object} offset 文字坐标便宜 {x：横向便宜，y:纵向偏移}
         */
        addText: function (lng, lat, text, symbol, offset) {
            if (lng && lat && text) {
                var pt = new Point(lng, lat),
                    symbol = symbol || {},
                    offset = offset || {},
                    font = new Font(symbol.size || '12px',
                        Font.STYLE_NORMAL,
                        Font.VARIANT_NORMAL,
                        Font.WEIGHT_BOLD,
                        symbol.family || 'Courier'),
                    textSymbol = new TextSymbol(text, font, new Color(symbol.color || "#FF0000"));
                textSymbol.setOffset(offset.x || 5, offset.y || 15);
                var graphic = new Graphic(pt, textSymbol);
                this.add(graphic);
            } else {
                throw new Error('The lng,lat,text parameter is required')
            }
        }
    })
})