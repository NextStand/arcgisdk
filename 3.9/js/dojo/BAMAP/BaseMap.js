/**
 * Created By Blue On 2019-07-08
 * 地图类集合
 * 基于 ArcGis 3.9
 */
define([
    "dojo/_base/declare",
    "esri/map",
    "esri/geometry/Point",
    "esri/SpatialReference",
    "esri/dijit/Scalebar",
    "esri/layers/WMSLayer",
    "esri/layers/WMSLayerInfo",
    "esri/geometry/Extent",
    'esri/renderers/SimpleRenderer',
    "esri/symbols/SimpleLineSymbol",
    "esri/symbols/PictureMarkerSymbol",
    "esri/symbols/SimpleFillSymbol",
    "esri/Color",
    "esri/InfoTemplate",
    "tdt/TDTLayer",
    "tdt/TDTAnnoLayer",
    "tdt/ImageLayer",
    "tdt/LandFormLayer",
    "geojson/src/geojsonlayer",
    "dojo/domReady!"
], function (declare, Map, Point, SpatialReference, Scalebar, WMSLayer, WMSLayerInfo, Extent,
    SimpleRenderer, SimpleLineSymbol, PictureMarkerSymbol, SimpleFillSymbol, Color, InfoTemplate, TDTLayer, TDTAnnoLayer, ImageLayer,
    LandFormLayer, GeoJsonLayer) {
        return declare('BaseMap', [Map], {
            __version: 'V1.2.1',
            __author: 'BLUE',
            constructor: function (id, options) {
                this.__MapURLarray = null;
                this.__AttachLayers = {};
                this.__label = true;
            },
            /**
             * 初始化地图，比较特殊
             */
            init: function () {
                var ctx = this;
                new Scalebar({
                    map: this,//地图对象  
                    attachTo: "bottom-left",//控件的位置，右下角  
                    scalebarStyle: "line",//ruler 比例尺样式类型  
                    scalebarUnit: "dual"//显示地图的单位，这里是km  metric,
                });
                var basemap = new TDTLayer("sldt");
                // 添加天地图矢量标注
                var annolayer = new TDTAnnoLayer("slbz");
                // 影像底图
                var imagelayer = new ImageLayer("imgdt");
                // 地形底图
                var landformlayer = new LandFormLayer("dxdt");
                ctx.__MapURLarray = { sldt: basemap, slbz: annolayer, imgdt: imagelayer, dxdt: landformlayer }
                ctx.addLayer(ctx.__MapURLarray.sldt, 0);
                ctx.addLayer(ctx.__MapURLarray.imgdt, 1);
                ctx.addLayer(ctx.__MapURLarray.dxdt, 2);
                ctx.addLayer(ctx.__MapURLarray.slbz, 10);
                ctx.__MapURLarray.imgdt.hide(); ctx.__MapURLarray.dxdt.hide();
                return this;
            },
            /**
             * 切换底图
             * @param {String} id 地图id sldt-矢量底图,imgdt-影像底图,dxdt-地形底图
             */
            changeBaseMap: function (id) {
                var ctx = this;
                for (var key in ctx.__MapURLarray) {
                    ctx.__MapURLarray[key].hide()
                }
                ctx.__MapURLarray[id].show();
                ctx.__MapURLarray.slbz.show();
                return this;
            },
            /**
             * 切换标注
             */
            toggleLable: function () {
                var ctx = this;
                if (ctx.__label) {
                    ctx.removeLayer(ctx.__MapURLarray.slbz)
                } else {
                    ctx.addLayer(ctx.__MapURLarray.slbz)
                }
                ctx.__label = !ctx.__label;
                return this;
            },
            /**
             * 定位点，将点拉到屏幕中心
             * @param {Number} lng 经度
             * @param {Number} lat 纬度
             * @param {Int} zoom 缩放层级
             */
            goto: function (lng, lat, zoom) {
                zoom = zoom || this.map.getZoom();
                var pt = new Point(lng, lat, this.spatialReference);
                this.centerAndZoom(pt, zoom);
                return this;
            },
            /**
             * 特殊的附加图层，可用于图层管理，不建议直接使用原型的添加图层方法
             * @param {Object} layer 附加的图层对象
             * @param {Int} index 图层顺序
             */
            adbLayer: function (layer, index) {
                // 我TMD，不能直接重写父类方法吗
                if (layer && layer.hasOwnProperty('id')) {
                    var ctx = this, id = layer.id
                    if (ctx.__AttachLayers.hasOwnProperty(id)) {
                        throw new Error("The " + id + " layer already exists");
                    }
                    ctx.__AttachLayers[id] = layer;
                    if (index) {
                        ctx.addLayer(layer, index);
                    } else {
                        ctx.addLayer(layer);
                    }
                    return this;
                } else {
                    throw new Error('This layer has no id attribute')
                }
            },

            /**
             * 隐藏附加图层
             * @param {String} name 图层名称或者id
             */
            hideAttachLayer: function (name) {
                if (this.__AttachLayers.hasOwnProperty(name)) {
                    this.__AttachLayers[name].hide();
                } else {
                    throw new Error('The layer was not found')
                }
                return this;
            },

            /**
             * 显示附加图层
             * @param {String} name 图层名称或者id
             */
            showAttachLayer: function (name) {
                if (this.__AttachLayers.hasOwnProperty(name)) {
                    this.__AttachLayers[name].show();
                } else {
                    throw new Error('The layer was not found')
                }
                return this;
            },

            /**
             * 销毁附加图层
             * @param {String} name 图层名称或者id
             */
            destoryAttachLayer: function (name) {
                if (this.__AttachLayers.hasOwnProperty(name)) {
                    this.removeLayer(this.__AttachLayers[name])
                    delete this.__AttachLayers[name]
                } else {
                    throw new Error('The layer was not found')
                }
                return this;
            },

            /**
             * 判断图层是否存在
             * @param {String} name 图层名称或者id
             * @returns {Boolean}
             */
            hasLayer: function (name) {
                return Boolean(this.__AttachLayers[name])
            },

            /**
             * 地图放大
             * @param {Number} zoom 放大层级
             */
            zoomIn: function (zoom) {
                zoom = zoom ? Math.abs(zoom) : 1;
                cur = this.getZoom()
                this.setZoom(cur + zoom)
            },
            /**
             * 地图缩小
             * @param {Number} zoom 缩小层级
             */
            zoomOut: function (zoom) {
                zoom = zoom ? Math.abs(zoom) : 1;
                cur = this.getZoom()
                this.setZoom(cur - zoom)
            },

            /**
             * 添加WMS图层
             * @param {String} url WMS图层服务地址
             * @param {String} name 命名空间:图层名称
             * @param {Object} extent 坐标范围 
             * @param {Function} callback 回调函数，参数为当前WMS图层
             */
            addWMSLayer(url, name, extent, callback) {
                var ctx = this;
                if (!url || !name) {
                    console.error('Function addGeoJsonLayer,The URL and Name parameter is required, but it is not provided');
                    return;
                }
                if (this.__AttachLayers.hasOwnProperty(name)) {
                    throw new Error("The " + name + " layer already exists");
                }
                var wmsLayer = new WMSLayer(url, {
                    // format: "png",
                    resourceInfo: {
                        copyright: "GeoServer",
                        extent: new Extent(extent.xmin, extent.ymin, extent.xmax, extent.ymax, ctx.spatialReference),
                        featureInfoFormat: "text/html",
                        layerInfos: [
                            new WMSLayerInfo({
                                name: name,
                                queryable: true,
                                showPopup: true
                            })
                        ],
                        spatialReferences: [ctx.spatialReference.wkid],
                        version: "1.1.0"
                    },
                    version: "1.1.0",
                    visibleLayers: [name]
                })
                wmsLayer.on("error", function (response) {
                    console.error("Error: %s", response.error.message);
                });
                wmsLayer.on("Load", function (layer) {
                    // 进不来是咋回事儿
                    callback && callback(layer)
                });
                setTimeout(function () { ctx.__AttachLayers[name] = wmsLayer; }, 1000)
                ctx.addLayer(wmsLayer);
            },

            /**
             * 根据geojson数据添加点图层
             * @param {String} name 图层名称或id
             * @param {String} url 服务或文件的地址（同域）
             * @param {Object} infoTemplate1 
             * @param {Object} symbol imgurl & heigth & width
             * @param {Function} callback  回调参数为GraphicsLayer
             * @param {Object} options GraphicsLayer的所有构造参数
             * @param {Int} maxdraw 最大绘制量  default 1,000,000
             */
            addPointGeoJsonLayer: function (name, url, infoTemplate1, symbol, callback, options, maxdraw) {
                var ctx = this, infoTemplate1 = infoTemplate1 || {}, symbol = symbol || {};
                if (!url || !name) {
                    throw new Error('Function addGeoJsonLayer,The URL and Name parameter is required, but it is not provided');
                }
                if (this.__AttachLayers.hasOwnProperty(name)) {
                    throw new Error("The " + name + " layer already exists");
                }
                var params = $.extend(true, { id: name, url: url, maxdraw: maxdraw || 1000000 }, options || {});
                if (JSON.stringify(infoTemplate1) == '{}') { params['infoTemplate'] = false }
                var geoJsonLayer = new GeoJsonLayer(params);
                var imgurl = symbol.imgurl || '/arcgisdk/images/local-marker.png', width = symbol.width || 10, height = symbol.height || 10;
                var sls = new PictureMarkerSymbol(imgurl, width, height);
                geoJsonLayer.renderer = new SimpleRenderer(sls);
                if (JSON.stringify(infoTemplate1) !== '{}') {
                    var infoTemplate = new InfoTemplate(infoTemplate1);
                    geoJsonLayer.infoTemplate = infoTemplate;
                }
                this.addLayer(geoJsonLayer);
                geoJsonLayer.on('load', function (layer) {
                    ctx.__AttachLayers[name] = geoJsonLayer;
                    callback && callback(geoJsonLayer)
                })
                geoJsonLayer.on('mouse-over', function (evt) {
                    ctx.setMapCursor("pointer");
                })
                geoJsonLayer.on('mouse-out', function (e) {
                    ctx.setMapCursor("default");
                })
                return this;
            },

            /**
             * 根据geojson数据添加线状图层
             * @param {String} url 服务或文件的地址（同域）
             * @param {Object} infoTemplate1 
             * @param {Object} symbol color & width
             * @param {Function} callback  回调参数为GraphicsLayer
             * @param {Object} options GraphicsLayer的所有构造参数
             * @param {Int} maxdraw 最大绘制量  default 1,000,000
             */
            addLineGeoJsonLayer: function (name, url, infoTemplate1, symbol, callback, options, maxdraw) {
                var ctx = this, infoTemplate1 = infoTemplate1 || {}, symbol = symbol || {};
                if (!url && !name) {
                    throw new Error('Function addGeoJsonLayer,The URL and Name parameter is required, but it is not provided');
                }
                if (this.__AttachLayers.hasOwnProperty(name)) {
                    throw new Error("The " + name + " layer already exists");
                }
                var params = $.extend(true, { id: name, url: url, maxdraw: maxdraw || 1000000 }, options || {});
                if (JSON.stringify(infoTemplate1) == '{}') { params['infoTemplate'] = false }
                var geoJsonLayer = new GeoJsonLayer(params);
                var color = symbol.color || '#ff0000', width = symbol.width || 1;
                var sls = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color(color), width);
                geoJsonLayer.renderer = new SimpleRenderer(sls);
                if (JSON.stringify(infoTemplate1) !== '{}') {
                    var infoTemplate = new InfoTemplate(infoTemplate1);
                    geoJsonLayer.infoTemplate = infoTemplate;
                }
                ctx.addLayer(geoJsonLayer);
                geoJsonLayer.on('load', function (layer) {
                    ctx.__AttachLayers[name] = geoJsonLayer;
                    callback && callback(geoJsonLayer)
                })
                geoJsonLayer.on('mouse-over', function (evt) {
                    ctx.setMapCursor("pointer");
                })
                geoJsonLayer.on('mouse-out', function (e) {
                    ctx.setMapCursor("default");
                })
                return this;
            },

            /**
             * 根据geojson数据添加面图层
             * @param {String} url 服务或文件的地址（同域）
             * @param {Object} infoTemplate1 
             * @param {Object} symbol color & width
             * @param {Function} callback  回调参数为GraphicsLayer
             * @param {Object} options GraphicsLayer的所有构造参数
             * @param {Int} maxdraw 最大绘制量  default 1,000,000
             */
            addGonGeoJsonLayer: function (name, url, infoTemplate1, symbol, callback, options, maxdraw) {
                var ctx = this, infoTemplate1 = infoTemplate1 || {}, symbol = symbol || {};
                if (!url || !name) {
                    throw new Error('Function addGonGeoJsonLayer,The URL and Name parameter is required, but it is not provided');
                }
                if (this.__AttachLayers.hasOwnProperty(name)) {
                    throw new Error("The " + name + " layer already exists");
                }
                var params = $.extend(true, { id: name, url: url, maxdraw: maxdraw || 1000000 }, options || {});
                if (JSON.stringify(infoTemplate1) == '{}') { params['infoTemplate'] = false }
                var geoJsonLayer = new GeoJsonLayer(params);
                var color = symbol.color || '#ff0000', width = symbol.width || 1, fillcolor = symbol.fillcolor || [255, 255, 0, 0.25];
                var sls = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
                    new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASHDOT,
                        new Color(color), width), new Color(fillcolor)
                );
                geoJsonLayer.renderer = new SimpleRenderer(sls);
                if (JSON.stringify(infoTemplate1) !== '{}') {
                    var infoTemplate = new InfoTemplate(infoTemplate1);
                    geoJsonLayer.infoTemplate = infoTemplate;
                }
                this.addLayer(geoJsonLayer);
                geoJsonLayer.on('load', function (layer) {
                    self.__AttachLayers[name] = geoJsonLayer;
                    callback && callback(geoJsonLayer)
                })
                geoJsonLayer.on('mouse-over', function (evt) {
                    self.setMapCursor("pointer");
                })
                geoJsonLayer.on('mouse-out', function (e) {
                    self.setMapCursor("default");
                })
            },

        })
    });