/**
 * Created By Blue On 2019-07-12
 * 图解图层类，用于创建图层要素，根据坐标等绘制图形要素
 * 基于 ArcGis 3.9
 */
define([
    "dojo/_base/declare",
    "esri/layers/GraphicsLayer",
    "esri/geometry/Point",
    "esri/geometry/ScreenPoint",
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
], function (declare, GraphicsLayer, Point, ScreenPoint, Polyline,
    Polygon, TextSymbol, PictureMarkerSymbol, SimpleLineSymbol,
    SimpleFillSymbol, Font, Graphic, Color, InfoTemplate, SpatialReference) {
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
            addText: function (text, lng, lat, symbol, offset) {
                if (lng && lat && text) {
                    var map = this.getMap(),
                        pt = new Point(lng, lat, new SpatialReference(map.spatialReference)),
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
            },

            /**
             * 添加流式文字/沿线文字,均分文字间距
             * 该方法不要大数据量调用，大数据量有内存溢出风险
             * @param {String} text 文字内容
             * @param {*} paths   线段坐标三维数组 [[[103.786370, 30.38],[103.786370, 30.385027], [103.904238, 30.510671]]]
             * @param {*} symbol  文字样式配置 {size：文字大小，family：文字字体，color：文字颜色}
             * @param {*} offset  文字坐标偏移 {x：横向偏移，y:纵向偏移}
             */
            addFlowText: function (text, paths, symbol, offset) {
                if (text && paths) {
                    var map = this.getMap(),
                        symbol = symbol || {},
                        offset = offset || {};
                    paths.forEach(x => {
                        for (var i = 0; i < x.length; i++) {
                            var pt = new Point(x[i][0], x[i][1], new SpatialReference(map.spatialReference)),
                                scpt = map.toScreen(pt);
                            x[i][0] = scpt.x;
                            x[i][1] = scpt.y;
                        }
                    })
                    var lineLength = this.getLineLength(paths),
                        arr = text.split(''),
                        //求出步进
                        wd = Math.ceil(lineLength / (arr.length + 1)),
                        _mArr = [];
                    this._textLocal4Line(wd, paths[0], _mArr);
                    for (var i = 0; i < arr.length; i++) {
                        var _mp = map.toMap(new ScreenPoint(_mArr[i]));
                        if (isNaN(_mp.x) || isNaN(_mp.y)) continue;
                        this.addText(arr[i], _mp.x, _mp.y,
                            { size: symbol.size, family: symbol.family, color: symbol.color },
                            { x: offset.x, y: offset.y });
                    }
                } else {
                    throw new Error('The text and paths parameter is required')
                }

            },

            /**
             * 添加流式文字/沿线文字 该方法适用于线的坐标点数量大于文字数量时候，并不是均分文字间距
             * 不会有内存溢出风险
             * @param {String} text 文字内容
             * @param {*} paths   线段坐标三维数组 [[[103.786370, 30.38],[103.786370, 30.385027], [103.904238, 30.510671]]]
             * @param {*} symbol  文字样式配置 {size：文字大小，family：文字字体，color：文字颜色}
             * @param {*} offset  文字坐标偏移 {x：横向偏移，y:纵向偏移}
             */

            addSupFlowText(text, paths, symbol, offset) {
                var map = this.getMap(),
                    symbol = symbol || {},
                    offset = offset || {};
                paths.forEach(x => {
                    for (var i = 0; i < x.length; i++) {
                        var pt = new Point(x[i][0], x[i][1], new SpatialReference(map.spatialReference)),
                            scpt = map.toScreen(pt);
                        x[i][0] = scpt.x;
                        x[i][1] = scpt.y;
                    }
                })
                var lineLength = this.getLineLength(paths),
                    arr = text.split(''),
                    //求出步进
                    wd = Math.ceil(lineLength / (arr.length + 1)),
                    //计算每个字坐标
                    _mArr = this._textLocal4LineLength(paths, wd);
                for (var i = 0; i < arr.length; i++) {
                    var _mp = baseMap.toMap(new ScreenPoint(_mArr[i]));
                    if (isNaN(_mp.x) || isNaN(_mp.y)) continue;
                    this.addText(arr[i], _mp.x, _mp.y,
                        { size: symbol.size, family: symbol.family, color: symbol.color },
                        { x: offset.x, y: offset.y });
                }
            },

            /**
             * 通过长度来确定坐标，文字非均等份，非递归，
             * 大量数据不会造成栈溢出
             * @param {*} paths 
             * @param {*} wd 
             */
            _textLocal4LineLength(paths, wd) {
                var lineLength = 0,
                    mArr1 = [];
                paths.forEach(x => {
                    for (var i = 0; i < x.length - 1; i++) {
                        var diffX = x[i + 1][0] - x[i][0],
                            diffY = x[i + 1][1] - x[i][1];
                        lineLength += Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffY, 2));
                        var wdlength = (mArr1.length + 1) * wd;
                        if (lineLength >= wdlength) {
                            mArr1.push([x[i][0], x[i][1]]);
                        }
                    }
                });
                return mArr1;
            },

            /**
             * 根据字数、步进、线段坐标定位每个字的位置
             * 由递归改造而成
             * @param {*} distance 步进
             * @param {*} paths 路径坐标[[104.07919775615183, 30.51891304249517], [104.08351074824778, 30.51892377133123]]
             * @param {*} mArr1 
             */
            _textLocal4Line(distance, paths, mArr1) {
                var mArr = mArr1,
                    _self = this,
                    _distance = distance,
                    _p = [];//临时起点存储
                for (var i = 0; i < paths.length; i++) {
                    var p2, p1;
                    if (_p.length > 1) {
                        i -= 1;
                        p2 = paths[i + 1];
                        p1 = _p;
                    } else {
                        p2 = paths[i + 1];
                        if (!p2) {
                            paths = null;
                            _p = null;
                            return false;
                        }
                        p1 = paths[i];
                    }
                    var diffX = p2[0] - p1[0],
                        diffY = p2[1] - p1[1],
                        _length = Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffY, 2));
                    if (_length > _distance) {
                        var _cos = diffX / _length,
                            _sin = diffY / _length,
                            _x = _cos * _distance,
                            _y = _sin * _distance,
                            p = [parseInt(p1[0] + _x), parseInt(p1[1] + _y)];
                        mArr.push([p[0], p[1]]);
                        _p = p;
                        _distance = distance;
                    } else if (_length < _distance) {
                        var _d = _distance - _length;
                        _distance = _d;
                        _p.length = 0;
                    } else if (_length === _distance) {
                        mArr.push([...p2]);
                        _p.length = 0;
                        _distance = distance;
                    }
                }
            },

            /**
             * 
             * @param {Array} paths 线段坐标三维数组
             */
            getLineLength(paths) {
                // [[[104.07919775615183, 30.51891304249517], [104.08351074824778, 30.51892377133123]]]
                //计算线的总长度
                var lineLength = 0;
                paths.forEach(x => {
                    for (let i = 0; i < x.length - 1; i++) {
                        let diffX = x[i + 1][0] - x[i][0];
                        let diffY = x[i + 1][1] - x[i][1];
                        lineLength += Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffY, 2));
                    }
                });
                lineLength = parseInt(lineLength);
                return lineLength;
            },
        })
    })