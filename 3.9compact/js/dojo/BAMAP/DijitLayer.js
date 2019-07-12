/**
 * Created By Blue On 2019-07-12
 * 工具图层，比如测距，侧面，当然可以使用arcgis提供的原生的
 * 基于 ArcGis 3.9
 */
define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "esri/graphic",
    "esri/toolbars/draw",
    "esri/symbols/Font",
    "esri/symbols/TextSymbol",
    "esri/layers/GraphicsLayer",
    "esri/symbols/SimpleMarkerSymbol",
    "esri/symbols/SimpleLineSymbol",
    "esri/Color",
    "dojo/on",
    "dojo/domReady!"
], function (declare, lang, Graphic, Draw, Font, TextSymbol, GraphicsLayer,
    SimpleMarkerSymbol, SimpleLineSymbol, Color, on) {
        return declare('DijitLayer', null, {
            __version: 'V1.1.1',
            __author: 'BLUE',
            constructor: function (map) {
                if (map) {
                    this.__config = {
                        toolbar: null,//绘制工具
                        __stopPoints: null,//地图点击收集点数组
                        __stopDistances: null,//与上一个点的计算就数组
                        __measureLayer: null,//测量图层
                        __mapClickFlag: null,// 用于取消地图click事件
                        styles: {
                            lineSymbol: null,
                            markerSymbol: null,
                        }
                    };
                    this.__config.__measureLayer = new GraphicsLayer({ id: "map-tools" });
                    this.__map = map;
                    map.adbLayer(this.__config.__measureLayer);
                    if (!this.__config.styles.lineSymbol) {
                        this.__config.styles.lineSymbol = new SimpleLineSymbol(
                            SimpleLineSymbol.STYLE_SOLID,
                            new Color("#FFA500"),
                            2
                        )
                    };
                    if (!this.__config.styles.markerSymbol) {
                        this.__config.styles.markerSymbol = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 10,
                            new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
                                new Color("#DC143C"), 2),
                            new Color("#FFA500"))
                    };
                    this.__initalToolbar();
                    this.__initialMeasureLayerEvent();
                } else {
                    throw new Error('The map parameter is required')
                }
            },

            /**
             * 初始化绘制工具条
             */
            __initalToolbar: function () {
                this.__config.toolbar = new Draw(this.__map, { showTooltips: false });
                this.__config.toolbar.on("draw-complete", lang.hitch(this, this.__drawComplete));
            },

            /**
             * 结束绘制
             */
            __drawComplete: function (evt) {
                //
                var ctx = this;
                if (evt.geometry.type == "polygon") {
                    ctx.__endMeasureArea(evt.geometry);
                } else {
                    //测距
                    var endPoint = ctx.__config.__stopPoints[ctx.__config.__stopPoints.length - 1];
                    ctx.__endMeasureDistance(evt.geometry, endPoint);
                };
                ctx.__config.toolbar.deactivate();
                ctx.__config.__stopPoints = null;
                ctx.__config.__stopDistances = null;
                ctx.__clearMapMouseClickEvent();
            },

            /**
             * 初始化测量图层事件
             */
            __initialMeasureLayerEvent: function () {
                var ctx = this;
                ctx.__config.__measureLayer.on("mouse-over", lang.hitch(ctx, function (evt) {
                    var graphic = evt.graphic;
                    if (graphic.symbol.isClearBtn) {
                        ctx.__map.setMapCursor("pointer");
                        on.once(graphic.getShape(), "click", lang.hitch(ctx, function () {
                            ctx.__config.__measureLayer.clear();
                            ctx.__map.setMapCursor("default");
                        }));
                    }
                }));
                ctx.__config.__measureLayer.on("mouse-out", lang.hitch(this, function (evt) {
                    ctx.__map.setMapCursor("default");
                }));

            },

            /**
             * 开始测量距离
             */
            __startMeasureDistance: function () {
                var ctx = this,
                    __config = ctx.__config
                ctx.__clearMapMouseClickEvent();
                __config.__stopPoints = [];
                __config.__stopDistances = [];
                __config.__measureLayer.clear();
                __config.toolbar.deactivate();
                __config.toolbar.activate(Draw.POLYLINE);
                var stopPoints = __config.__stopPoints,
                    stopDistances = __config.__stopDistances;
                __config.__mapClickFlag = ctx.__map.on("click", function (evt) {
                    var distance = 0;
                    var stopPoint = evt.mapPoint;
                    if (stopPoints.length > 0) {
                        var startPoint = stopPoints[stopPoints.length - 1];
                        distance = ctx.__calDistance(startPoint, stopPoint);
                        if (__config.__stopDistances.length > 0) {
                            distance += __config.__stopDistances[__config.__stopDistances.length - 1];
                        };
                        stopDistances.push(distance);
                    };
                    stopPoints.push(stopPoint);
                    var stopGraphic = new Graphic(stopPoint, __config.styles.markerSymbol);
                    var textGraphic = ctx.__getStopPointGraphic(stopPoint, distance);
                    __config.__measureLayer.add(stopGraphic);
                    __config.__measureLayer.add(textGraphic);
                });
            },

            __endMeasureDistance: function (line, endPoint) {
                var ctx = this,
                    __config = ctx.__config;
                var lineGraphic = new Graphic(line, __config.styles.lineSymbol);
                //var clearGraphic = this._createClearBtn(endPoint);
                //ctx._measureLayer.add(clearGraphic);
                __config.__measureLayer.add(lineGraphic);
                //lineGraphic.getDojoShape().moveToBack();
                //ctx._clearMapMouseClickEvent();
            },

            __endMeasureArea: function (polygon) {
                var area = this.__calArea(polygon);
                var ctx = this,
                    __config = ctx.__config;
                if (area > 1000000) {
                    area = (area / 1000000).toFixed(2) + "平方千米";
                } else {
                    area = area.toFixed(2) + "平方米";
                };
                var center = polygon.getCentroid();
                var ploygonGraphic = new Graphic(polygon, __config.toolbar.fillSymbol);
                var textSymbol = ctx.__createTextSymbol(area);
                textSymbol.setOffset(30, 10);
                var textGraphic = new Graphic(center, textSymbol);
                //var clearBtn = ctx._createClearBtn(center);
                __config.__measureLayer.add(ploygonGraphic);
                __config.__measureLayer.add(textGraphic);
                //__config._measureLayer.add(clearBtn);
                //ploygonGraphic.getDojoShape().moveToBack();
            },

            /**
             * 获取测量点的Graphics
             */
            __getStopPointGraphic: function (stopPoint, distance) {
                var ctx = this;
                var __graphic = null;
                var textSymbol = ctx.__createTextSymbol("起点");
                if (distance > 0 && distance >= 1000) {
                    textSymbol = textSymbol.setText((distance / 1000).toFixed(2) + "km");
                } else if (distance > 0 && distance < 1000) {
                    textSymbol = textSymbol.setText(distance.toFixed() + "m");
                };
                __graphic = new Graphic(stopPoint, textSymbol);
                return __graphic;
            },

            /**
             * 计算距离
             */
            __calDistance: function (point1, point2) {
                var _l = Math.sqrt((point1.x - point2.x) * (point1.x - point2.x) + (point1.y - point2.y) * (point1.y - point2.y)),
                    _r = 2 * 3.14159265358979 * 6378137 / 360;
                return _l * _r;
            },

            /**
             * 计算面积
             */
            __calArea: function (polygon) {
                var __rings = polygon.rings[0];
                if (__rings.length < 3) {
                    return 0;
                };
                var __sigmaOut = 0;
                var dx1, dy1, dx2, dy2;
                var nStart_Index = 0;
                var nEnd_Index = __rings.length;
                var m_dArea = 0;
                dx1 = __rings[0][1];
                dy1 = __rings[0][0];
                for (var j = nStart_Index + 1; j < nEnd_Index; j++) {
                    dx2 = __rings[j][1];
                    dy2 = __rings[j][0];
                    __sigmaOut += (dy1 + dy2) * (dx2 - dx1);
                    dx1 = dx2;
                    dy1 = dy2;
                };
                __sigmaOut += (__rings[nEnd_Index - 1][0] + __rings[nStart_Index][0]) * (__rings[nStart_Index][1] - __rings[nEnd_Index - 1][1]);
                m_dArea = Math.abs(0.5 * __sigmaOut);
                var _r = 2 * 3.14159265358979 * 6378137 / 360;
                return m_dArea * _r * _r;
            },

            __startMeasureArea: function () {
                var ctx = this,
                    __config = ctx.__config;
                require(["esri/toolbars/draw"], function (Draw) {
                    ctx.__clearMapMouseClickEvent();
                    __config.__measureLayer.clear();
                    __config.toolbar.deactivate();
                    __config.toolbar.activate(Draw.POLYGON);
                })
            },

            /**
             * 创建清除按钮
             */
            __createClearBtn: function (point) {
                //
                var iconPath = "M13.618,2.397 C10.513,-0.708 5.482,-0.713 2.383,2.386 C-0.718,5.488 -0.715,10.517 2.392,13.622 C5.497,16.727 10.529,16.731 13.627,13.632 C16.727,10.533 16.724,5.502 13.618,2.397 L13.618,2.397 Z M9.615,11.351 L7.927,9.663 L6.239,11.351 C5.55,12.04 5.032,12.64 4.21,11.819 C3.39,10.998 3.987,10.48 4.679,9.79 L6.367,8.103 L4.679,6.415 C3.989,5.726 3.39,5.208 4.21,4.386 C5.032,3.566 5.55,4.165 6.239,4.855 L7.927,6.541 L9.615,4.855 C10.305,4.166 10.82,3.565 11.642,4.386 C12.464,5.208 11.865,5.726 11.175,6.415 L9.487,8.102 L11.175,9.789 C11.864,10.48 12.464,10.998 11.642,11.819 C10.822,12.64 10.305,12.04 9.615,11.351 L9.615,11.351 Z";
                var iconColor = "#b81b1b";
                var clearSymbol = new SimpleMarkerSymbol();
                clearSymbol.setOffset(-40, 15);
                clearSymbol.setPath(iconPath);
                clearSymbol.setColor(new Color(iconColor));
                clearSymbol.setOutline(null);
                clearSymbol.isClearBtn = true;
                return new Graphic(point, clearSymbol);
            },

            /**
             * 创建文本Symbol
             */
            __createTextSymbol: function (text) {
                var textSymbol = null,
                    fontColor = new Color("#696969"),
                    holoColor = new Color("#fb0000"),
                    font = new Font("10pt", Font.STYLE_ITALIC, Font.VARIANT_NORMAL, Font.WEIGHT_BOLD, "Courier");
                textSymbol = new TextSymbol(text, font, fontColor);
                textSymbol.setOffset(10, 10).setColor(holoColor);
                textSymbol.setAlign(TextSymbol.ALIGN_MIDDLE);
                return textSymbol;
            },

            /**
             * 清除测量图层的点击事件
             */
            __clearMapMouseClickEvent: function () {
                if (this.__config.__mapClickFlag != null) {
                    this.__config.__mapClickFlag.remove();
                }
            },
            /**
             * 外界调用测距
             */
            measureDis: function () {
                this.__startMeasureDistance();
            },
            /**
             * 外界调用测面
             */
            measureArea: function () {
                this.__startMeasureArea();
            },
            /**
             * 清空测量数据
             */
            clearMeas: function () {
                var _toolLayer = this.__map.getLayer("map-tools");
                _toolLayer.clear();
                this.__config.toolbar.deactivate();
                this.__clearMapMouseClickEvent();
            }
        })
    })