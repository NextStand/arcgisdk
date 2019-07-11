/**
 * Created By Blue On 2019-07-11
 * 绘制图层，提供多种图形绘制
 * 基于 ArcGis 3.9
 */
define([
    "dojo/_base/declare",
    'esri/toolbars/draw',
    "dojo/domReady!"
], function (declare, Draw) {
    return declare('DrawLayer', null, {
        __version: 'V1.2.1',
        __author: 'BLUE',
        constructor: function (map) {
            if (!map) {
                throw new Error('The Map parameter is required')
            }
            var ctx=this;
            this.__layer = new Draw(map);
            this.__map = map;
            this.__symbol = null;
            this.drawEndCallback = null;
            this.__layer.on('draw-end', function (geoobj) {
                ctx.__drawit(geoobj);
            })
        },

        /**
         * 绘制点
         * @param {Function} drawEndCallback1 绘制完成后的回调，参数为点对象
         */
        drawPoint: function (drawEndCallback1) {
            this.__map.setMapCursor('crosshair');
            this.drawEndCallback = drawEndCallback1;
            this.__layer.activate(esri.toolbars.Draw.POINT);
        },

        /**
         * 绘制多点
         * @param {Function} drawEndCallback1 绘制完成后的回调
         */
        drawMultiPoint: function (drawEndCallback1) {
            this.__map.setMapCursor('crosshair');
            this.drawEndCallback = drawEndCallback1;
            this.__layer.activate(esri.toolbars.Draw.MULTI_POINT);
        },

        /**
         * 绘制直线
         * @param {Function} drawEndCallback1 绘制完成后的回调
         */
        drawLine: function (drawEndCallback1) {
            this.__map.setMapCursor('crosshair');
            this.drawEndCallback = drawEndCallback1;
            this.__layer.activate(esri.toolbars.Draw.LINE);
        },

        /**
         * 绘制折线
         * @param {Function} drawEndCallback1 绘制完成后的回调
         */
        drawPolyLine: function (drawEndCallback1) {
            this.__map.setMapCursor('crosshair');
            this.drawEndCallback = drawEndCallback1;
            this.__layer.activate(esri.toolbars.Draw.POLYLINE);
        },

        /**
         * 绘多边形
         * @param {Function} drawEndCallback1 绘制完成后的回调
         */
        drawPolyGon: function (drawEndCallback1) {
            this.__map.setMapCursor('crosshair');
            this.drawEndCallback = drawEndCallback1;
            this.__layer.activate(esri.toolbars.Draw.POLYGON);
        },

        /**
         * 手绘多边形
         * @param {Function} drawEndCallback1 绘制完成后的回调
         */
        drawFreePolyGon: function (drawEndCallback1) {
            this.__map.setMapCursor('crosshair');
            this.drawEndCallback = drawEndCallback1;
            this.__layer.activate(esri.toolbars.Draw.FREEHAND_POLYGON);
        },

        /**
         * 绘制箭头
         * @param {Function} drawEndCallback1 绘制完成后的回调
         */
        drawArrow: function (drawEndCallback1) {
            this.__map.setMapCursor('crosshair');
            this.drawEndCallback = drawEndCallback1;
            this.__layer.activate(esri.toolbars.Draw.ARROW);
        },

        /**
         * 绘制三角形
         * @param {Function} drawEndCallback1 绘制完成后的回调
         */
        drawTrianGle: function (drawEndCallback1) {
            this.__map.setMapCursor('crosshair');
            this.drawEndCallback = drawEndCallback1;
            this.__layer.activate(esri.toolbars.Draw.TRIANGLE);
        },

        /**
         * 绘制圆形
         * @param {Function} drawEndCallback1 绘制完成后的回调
         */
        drawCircle: function (drawEndCallback1) {
            this.__map.setMapCursor('crosshair');
            this.drawEndCallback = drawEndCallback1;
            this.__layer.activate(esri.toolbars.Draw.CIRCLE);
        },

        /**
         * 绘制椭圆
         * @param {Function} drawEndCallback1 绘制完成后的回调
         */
        drawEllipse: function (drawEndCallback1) {
            this.__map.setMapCursor('crosshair');
            this.drawEndCallback = drawEndCallback1;
            this.__layer.activate(esri.toolbars.Draw.ELLIPSE);
        },

        /**
         * 绘制矩形
         * @param {Function} drawEndCallback1 绘制完成后的回调
         */
        drawRectangle: function (drawEndCallback1) {
            this.__map.setMapCursor('crosshair');
            this.drawEndCallback = drawEndCallback1;
            this.__layer.activate(esri.toolbars.Draw.RECTANGLE);
        },

        /**
         * 清除绘制图层
         */
        clear: function () {
            var _drawLayer = this.__map.getLayer("map_graphics");
            _drawLayer.clear();
        },

        /**
         * 清除绘制图层并进入激活状态
         */
        clsAndte: function () {
            this.clear();
            this.__layer.deactivate();
        },

        /**
         * 主动释放绘制状态
         */
        deactivate: function () {
            this.__layer.deactivate();
            this.__map.setMapCursor('default');
        },


        __drawit: function (geoobj) {
            var ctx = this;
            ctx.deactivate();
            switch (geoobj.geometry.type) {
                case "point": {
                    ctx.__symbol = new esri.symbol.SimpleMarkerSymbol(
                        esri.symbol.SimpleMarkerSymbol.STYLE_CIRCLE,
                        10,
                        new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255, 0, 0]), 1),
                        new dojo.Color([255, 255, 0, 0.25]));
                    break;
                }
                case "polyline": {
                    ctx.__symbol = new esri.symbol.SimpleLineSymbol(
                        esri.symbol.SimpleLineSymbol.STYLE_SOLID,
                        new dojo.Color([255, 0, 0]),
                        2);
                    break;
                }
                case "polygon": {
                    ctx.__symbol = new esri.symbol.SimpleFillSymbol(
                        esri.symbol.SimpleFillSymbol.STYLE_SOLID,
                        new esri.symbol.SimpleLineSymbol(
                            esri.symbol.SimpleLineSymbol.STYLE_DASHDOT,
                            new dojo.Color([255, 0, 0]),
                            2
                        ),
                        new dojo.Color([255, 255, 0, 0.25])
                    );
                    break;
                }
                case "extent": {
                    ctx.__symbol = new esri.symbol.SimpleFillSymbol(
                        esri.symbol.SimpleFillSymbol.STYLE_SOLID,
                        new esri.symbol.SimpleLineSymbol(
                            esri.symbol.SimpleLineSymbol.STYLE_DASHDOT,
                            new dojo.Color([255, 0, 0]),
                            2
                        ),
                        new dojo.Color([255, 255, 0, 0.25])
                    );
                    break;
                }
                case "multipoint": {
                    ctx.__symbol = new esri.symbol.SimpleMarkerSymbol(
                        esri.symbol.SimpleMarkerSymbol.STYLE_DIAMOND,
                        20,
                        new esri.symbol.SimpleLineSymbol(
                            esri.symbol.SimpleLineSymbol.STYLE_SOLID,
                            new dojo.Color([255, 0, 0]),
                            1
                        ),
                        new dojo.Color([255, 0, 0, 0.5])
                    );
                    break;
                }
            }
            var graphic = new esri.Graphic(geoobj.geometry, ctx.__symbol);
            ctx.drawEndCallback && ctx.drawEndCallback(geoobj.geometry);
            ctx.__map.graphics.add(graphic);
        }
    })

});