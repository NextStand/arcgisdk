define(["dojo/_base/declare",
    "esri/layers/tiled"],
    function (declare) {
        return declare(esri.layers.TiledMapServiceLayer, {
            constructor: function () {
                this.spatialReference = new esri.SpatialReference({ wkid: 102100 });
                this.initialExtent = (this.fullExtent = new esri.geometry.Extent(-33526792.7187241, -33526792.7187241, 33526792.7187241, 33526792.7187241, this.spatialReference));
                this.scale = [
                    989964351.93082204724409448818898,
                    494982175.96541102362204724409449,
                    2578032.1664865157480314960629921,
                    1289016.0832432578740157480314961,
                    644508.04162162893700787401574803,
                    322254.02081081446850393700787402,
                    161127.01040540723425196850393701,
                    80563.505202703617125984251968504,
                    40281.752601351808562992125984252,
                    20140.876300675904281496062992126,
                    10070.438150337952140748031496063,
                    5035.2190751689760703740157480315,
                    2517.6095375844880351870078740157,
                    1258.8047687922440175935039370079,
                    629.40238439612200879675196850394,
                    314.70119219806100439837598425197,
                    157.35059609903050219918799212598,
                    78.675298049515251099593996062992,
                    39.337649024757625549796998031496,
                    19.668824512378812774898499015748
                ];
                this.resolution = [261928.06811503,130964.034057515,65482.0170287575,32741.00851437875,16370.504257189375,
                    8185.2521285946875,4092.62606429734375,2046.313032148671875,1023.1565160743359375,511.57825803716796875,
                    255.789129018583984375,127.8945645092919921875,63.94728225464599609375,31.973641127322998046875,15.9868205636614990234375,
                    7.99341028183074951171875,3.996705140915374755859375,1.9983525704576873779296875,0.99917628522884368896484375,0.499588142614421844482421875];

                this.tileInfo = new esri.layers.TileInfo({
                    "rows": 256,
                    "cols": 256,
                    "compressionQuality": 90,
                    "origin": {
                        "x": -33526792.7187241,
                        "y": 33526792.7187241
						
                    },
                    "spatialReference": this.spatialReference,
                    "lods": [{ "level": 0, "resolution": this.resolution[0], "scale": this.scale[0] },
                        { "level": 1, "resolution": this.resolution[1], "scale": this.scale[1] },
                        { "level": 2, "resolution": this.resolution[2], "scale": this.scale[2] },
                        { "level": 3, "resolution": this.resolution[3], "scale": this.scale[3] },
                        { "level": 4, "resolution": this.resolution[4], "scale": this.scale[4] },
                        { "level": 5, "resolution": this.resolution[5], "scale": this.scale[5] },
                        { "level": 6, "resolution": this.resolution[6], "scale": this.scale[6] },
                        { "level": 7, "resolution": this.resolution[7], "scale": this.scale[7] },
                        { "level": 8, "resolution": this.resolution[8], "scale": this.scale[8] },
                        { "level": 9, "resolution": this.resolution[9], "scale": this.scale[9] },
                        { "level": 10, "resolution": this.resolution[10], "scale": this.scale[10] },
                        { "level": 11, "resolution": this.resolution[11], "scale": this.scale[11] },
                        { "level": 12, "resolution": this.resolution[12], "scale": this.scale[12] },
                        { "level": 13, "resolution": this.resolution[13], "scale": this.scale[13] },
                        { "level": 14, "resolution": this.resolution[14], "scale": this.scale[14] },
                        { "level": 15, "resolution": this.resolution[15], "scale": this.scale[15] },
                        { "level": 16, "resolution": this.resolution[16], "scale": this.scale[16] },
                        { "level": 17, "resolution": this.resolution[17], "scale": this.scale[17] },
                        { "level": 18, "resolution": this.resolution[18], "scale": this.scale[18] },
                        { "level": 19, "resolution": this.resolution[19], "scale": this.scale[19] }
                    ]
                });
                this.loaded = true;
                this.onLoad(this);
            },
            getTileUrl: function (level, row, col) {
                var zoom = level - 1;
                var offsetX = parseInt(Math.pow(2, zoom));
                var offsetY = offsetX - 1;
                var numX = col - offsetX, numY = (-row) + offsetY ;
                var num = (col + row) % 8 + 1;
                return "http://shangetu" + num + ".map.bdimg.com/it/u=x="+numX+";y="+numY+";z="+level+";v=009;type=sate&fm=46&udt=20141015";
            }
        });
    });