"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var application = require("tns-core-modules/application");
var map_view_common_1 = require("./map-view-common");
var image_1 = require("tns-core-modules/ui/image");
var imageSource = require("tns-core-modules/image-source");
__export(require("./map-view-common"));
var MapView = (function (_super) {
    __extends(MapView, _super);
    function MapView() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._markers = new Array();
        return _this;
    }
    MapView.prototype.onLoaded = function () {
        _super.prototype.onLoaded.call(this);
        application.android.on(application.AndroidApplication.activityPausedEvent, this.onActivityPaused, this);
        application.android.on(application.AndroidApplication.activityResumedEvent, this.onActivityResumed, this);
        application.android.on(application.AndroidApplication.saveActivityStateEvent, this.onActivitySaveInstanceState, this);
        application.android.on(application.AndroidApplication.activityDestroyedEvent, this.onActivityDestroyed, this);
    };
    MapView.prototype.onUnloaded = function () {
        _super.prototype.onUnloaded.call(this);
        application.android.off(application.AndroidApplication.activityPausedEvent, this.onActivityPaused, this);
        application.android.off(application.AndroidApplication.activityResumedEvent, this.onActivityResumed, this);
        application.android.off(application.AndroidApplication.saveActivityStateEvent, this.onActivitySaveInstanceState, this);
        application.android.off(application.AndroidApplication.activityDestroyedEvent, this.onActivityDestroyed, this);
    };
    MapView.prototype.disposeNativeView = function () {
        if (this.nativeView) {
            this.nativeView.onDestroy();
        }
        if (this._gMap) {
            this._gMap.setMyLocationEnabled(false);
            this._gMap.clear();
        }
        this._context = undefined;
        this._gMap = undefined;
        this._markers = undefined;
        this._shapes = undefined;
        _super.prototype.disposeNativeView.call(this);
    };
    ;
    MapView.prototype.onActivityPaused = function (args) {
        if (!this.nativeView || this._context != args.activity)
            return;
        this.nativeView.onPause();
    };
    MapView.prototype.onActivityResumed = function (args) {
        if (!this.nativeView || this._context != args.activity)
            return;
        this.nativeView.onResume();
    };
    MapView.prototype.onActivitySaveInstanceState = function (args) {
        if (!this.nativeView || this._context != args.activity)
            return;
        this.nativeView.onSaveInstanceState(args.bundle);
    };
    MapView.prototype.onActivityDestroyed = function (args) {
        if (!this.nativeView || this._context != args.activity)
            return;
        this.nativeView.onDestroy();
    };
    MapView.prototype.createNativeView = function () {
        var cameraPosition = this._createCameraPosition();
        var options = new com.google.android.gms.maps.GoogleMapOptions();
        if (cameraPosition)
            options = options.camera(cameraPosition);
        this.nativeView = new com.google.android.gms.maps.MapView(this._context, options);
        this.nativeView.onCreate(null);
        this.nativeView.onResume();
        var that = new WeakRef(this);
        var mapReadyCallback = new com.google.android.gms.maps.OnMapReadyCallback({
            onMapReady: function (gMap) {
                var owner = that.get();
                owner._gMap = gMap;
                owner.setMinZoomMaxZoom();
                owner.updatePadding();
                if (owner._pendingCameraUpdate) {
                    owner.updateCamera();
                }
                gMap.setOnMapClickListener(new com.google.android.gms.maps.GoogleMap.OnMapClickListener({
                    onMapClick: function (gmsPoint) {
                        var position = new Position(gmsPoint);
                        owner.notifyPositionEvent(map_view_common_1.MapViewBase.coordinateTappedEvent, position);
                    }
                }));
                gMap.setOnMapLongClickListener(new com.google.android.gms.maps.GoogleMap.OnMapLongClickListener({
                    onMapLongClick: function (gmsPoint) {
                        var position = new Position(gmsPoint);
                        owner.notifyPositionEvent(map_view_common_1.MapViewBase.coordinateLongPressEvent, position);
                    }
                }));
                gMap.setOnMarkerClickListener(new com.google.android.gms.maps.GoogleMap.OnMarkerClickListener({
                    onMarkerClick: function (gmsMarker) {
                        var marker = owner.findMarker(function (marker) { return marker.android.getId() === gmsMarker.getId(); });
                        owner.notifyMarkerTapped(marker);
                        return false;
                    }
                }));
                gMap.setOnInfoWindowClickListener(new com.google.android.gms.maps.GoogleMap.OnInfoWindowClickListener({
                    onInfoWindowClick: function (gmsMarker) {
                        var marker = owner.findMarker(function (marker) { return marker.android.getId() === gmsMarker.getId(); });
                        owner.notifyMarkerInfoWindowTapped(marker);
                        return false;
                    }
                }));
                gMap.setOnMyLocationButtonClickListener(new com.google.android.gms.maps.GoogleMap.OnMyLocationButtonClickListener({
                    onMyLocationButtonClick: function () {
                        owner.notifyMyLocationTapped();
                        return false;
                    }
                }));
                if (gMap.setOnCircleClickListener) {
                    gMap.setOnCircleClickListener(new com.google.android.gms.maps.GoogleMap.OnCircleClickListener({
                        onCircleClick: function (gmsCircle) {
                            var shape = owner.findShape(function (shape) { return shape.android.getId() === gmsCircle.getId(); });
                            if (shape) {
                                owner.notifyShapeTapped(shape);
                            }
                            return false;
                        }
                    }));
                }
                if (gMap.setOnPolylineClickListener) {
                    gMap.setOnPolylineClickListener(new com.google.android.gms.maps.GoogleMap.OnPolylineClickListener({
                        onPolylineClick: function (gmsPolyline) {
                            var shape = owner.findShape(function (shape) { return shape.android.getId() === gmsPolyline.getId(); });
                            if (shape) {
                                owner.notifyShapeTapped(shape);
                            }
                            return false;
                        }
                    }));
                }
                if (gMap.setOnPolygonClickListener) {
                    gMap.setOnPolygonClickListener(new com.google.android.gms.maps.GoogleMap.OnPolygonClickListener({
                        onPolygonClick: function (gmsPolygon) {
                            var shape = owner.findShape(function (shape) { return shape.android.getId() === gmsPolygon.getId(); });
                            if (shape) {
                                owner.notifyShapeTapped(shape);
                            }
                            return false;
                        }
                    }));
                }
                gMap.setOnMarkerDragListener(new com.google.android.gms.maps.GoogleMap.OnMarkerDragListener({
                    onMarkerDrag: function (gmsMarker) {
                        var marker = owner.findMarker(function (marker) { return marker.android.getId() === gmsMarker.getId(); });
                        owner.notifyMarkerDrag(marker);
                    },
                    onMarkerDragEnd: function (gmsMarker) {
                        var marker = owner.findMarker(function (marker) { return marker.android.getId() === gmsMarker.getId(); });
                        owner.notifyMarkerEndDragging(marker);
                    },
                    onMarkerDragStart: function (gmsMarker) {
                        var marker = owner.findMarker(function (marker) { return marker.android.getId() === gmsMarker.getId(); });
                        owner.notifyMarkerBeginDragging(marker);
                    }
                }));
                var cameraChangeHandler = function (cameraPosition) {
                    owner._processingCameraEvent = true;
                    var cameraChanged = false;
                    if (owner.latitude != cameraPosition.target.latitude) {
                        cameraChanged = true;
                        map_view_common_1.latitudeProperty.nativeValueChange(owner, cameraPosition.target.latitude);
                    }
                    if (owner.longitude != cameraPosition.target.longitude) {
                        cameraChanged = true;
                        map_view_common_1.longitudeProperty.nativeValueChange(owner, cameraPosition.target.longitude);
                    }
                    if (owner.bearing != cameraPosition.bearing) {
                        cameraChanged = true;
                        map_view_common_1.bearingProperty.nativeValueChange(owner, cameraPosition.bearing);
                    }
                    if (owner.zoom != cameraPosition.zoom) {
                        cameraChanged = true;
                        map_view_common_1.zoomProperty.nativeValueChange(owner, cameraPosition.zoom);
                    }
                    if (owner.tilt != cameraPosition.tilt) {
                        cameraChanged = true;
                        map_view_common_1.tiltProperty.nativeValueChange(owner, cameraPosition.tilt);
                    }
                    if (cameraChanged) {
                        owner.notifyCameraEvent(map_view_common_1.MapViewBase.cameraChangedEvent, {
                            latitude: cameraPosition.target.latitude,
                            longitude: cameraPosition.target.longitude,
                            zoom: cameraPosition.zoom,
                            bearing: cameraPosition.bearing,
                            tilt: cameraPosition.tilt
                        });
                    }
                    owner._processingCameraEvent = false;
                };
                if (gMap.setOnCameraIdleListener) {
                    gMap.setOnCameraIdleListener(new com.google.android.gms.maps.GoogleMap.OnCameraIdleListener({
                        onCameraIdle: function () { return cameraChangeHandler(gMap.getCameraPosition()); }
                    }));
                }
                else if (gMap.setOnCameraChangeListener) {
                    gMap.setOnCameraChangeListener(new com.google.android.gms.maps.GoogleMap.OnCameraChangeListener({
                        onCameraChange: cameraChangeHandler
                    }));
                }
                if (gMap.setOnCameraMoveListener) {
                    gMap.setOnCameraMoveListener(new com.google.android.gms.maps.GoogleMap.OnCameraMoveListener({
                        onCameraMove: function () {
                            var cameraPosition = gMap.getCameraPosition();
                            owner.notifyCameraEvent(map_view_common_1.MapViewBase.cameraMoveEvent, {
                                latitude: cameraPosition.target.latitude,
                                longitude: cameraPosition.target.longitude,
                                zoom: cameraPosition.zoom,
                                bearing: cameraPosition.bearing,
                                tilt: cameraPosition.tilt
                            });
                        }
                    }));
                }
                gMap.setInfoWindowAdapter(new com.google.android.gms.maps.GoogleMap.InfoWindowAdapter({
                    getInfoWindow: function (gmsMarker) {
                        return null;
                    },
                    getInfoContents: function (gmsMarker) {
                        var marker = owner.findMarker(function (marker) { return marker.android.getId() === gmsMarker.getId(); });
                        var content = owner._getMarkerInfoWindowContent(marker);
                        return (content) ? content.android : null;
                    }
                }));
                owner.notifyMapReady();
            }
        });
        this.nativeView.getMapAsync(mapReadyCallback);
        return this.nativeView;
    };
    MapView.prototype._createCameraPosition = function () {
        var cpBuilder = new com.google.android.gms.maps.model.CameraPosition.Builder();
        var update = false;
        if (!isNaN(this.latitude) && !isNaN(this.longitude)) {
            update = true;
            cpBuilder.target(new com.google.android.gms.maps.model.LatLng(this.latitude, this.longitude));
        }
        if (!isNaN(this.bearing)) {
            update = true;
            cpBuilder.bearing(this.bearing);
        }
        if (!isNaN(this.zoom)) {
            update = true;
            cpBuilder.zoom(this.zoom);
        }
        if (!isNaN(this.tilt)) {
            update = true;
            cpBuilder.tilt(this.tilt);
        }
        return (update) ? cpBuilder.build() : null;
    };
    MapView.prototype.updateCamera = function () {
        var cameraPosition = this._createCameraPosition();
        if (!cameraPosition)
            return;
        if (!this.gMap) {
            this._pendingCameraUpdate = true;
            return;
        }
        this._pendingCameraUpdate = false;
        var cameraUpdate = com.google.android.gms.maps.CameraUpdateFactory.newCameraPosition(cameraPosition);
        if (this.mapAnimationsEnabled) {
            this.gMap.animateCamera(cameraUpdate);
        }
        else {
            this.gMap.moveCamera(cameraUpdate);
        }
    };
    MapView.prototype.setViewport = function (bounds, padding) {
        var p = padding || 0;
        var cameraUpdate = com.google.android.gms.maps.CameraUpdateFactory.newLatLngBounds(bounds.android, p);
        if (!this.gMap) {
            this._pendingCameraUpdate = true;
            return;
        }
        this._pendingCameraUpdate = false;
        if (this.mapAnimationsEnabled) {
            this.gMap.animateCamera(cameraUpdate);
        }
        else {
            this.gMap.moveCamera(cameraUpdate);
        }
    };
    MapView.prototype.updatePadding = function () {
        if (this.padding && this.gMap) {
            this.gMap.setPadding(this.padding[2] || 0, this.padding[0] || 0, this.padding[3] || 0, this.padding[1] || 0);
        }
    };
    Object.defineProperty(MapView.prototype, "android", {
        get: function () {
            throw new Error('Now use instance.nativeView instead of instance.android');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MapView.prototype, "gMap", {
        get: function () {
            return this._gMap;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MapView.prototype, "projection", {
        get: function () {
            return (this._gMap) ? new Projection(this._gMap.getProjection()) : null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MapView.prototype, "settings", {
        get: function () {
            return (this._gMap) ? new UISettings(this._gMap.getUiSettings()) : null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MapView.prototype, "myLocationEnabled", {
        get: function () {
            return (this._gMap) ? this._gMap.isMyLocationEnabled() : false;
        },
        set: function (value) {
            if (this._gMap)
                this._gMap.setMyLocationEnabled(value);
        },
        enumerable: true,
        configurable: true
    });
    MapView.prototype.setMinZoomMaxZoom = function () {
        if (this.gMap) {
            this.gMap.setMinZoomPreference(this.minZoom);
            this.gMap.setMaxZoomPreference(this.maxZoom);
        }
    };
    MapView.prototype.addMarker = function () {
        var _this = this;
        var markers = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            markers[_i] = arguments[_i];
        }
        markers.forEach(function (marker) {
            marker.android = _this.gMap.addMarker(marker.android);
            _this._markers.push(marker);
        });
    };
    MapView.prototype.removeMarker = function () {
        var _this = this;
        var markers = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            markers[_i] = arguments[_i];
        }
        markers.forEach(function (marker) {
            _this._unloadInfoWindowContent(marker);
            marker.android.remove();
            _this._markers.splice(_this._markers.indexOf(marker), 1);
        });
    };
    MapView.prototype.removeAllMarkers = function () {
        var _this = this;
        this._markers.forEach(function (marker) {
            _this._unloadInfoWindowContent(marker);
            marker.android.remove();
        });
        this._markers = [];
    };
    MapView.prototype.findMarker = function (callback) {
        return this._markers.find(callback);
    };
    MapView.prototype.addPolyline = function (shape) {
        shape.loadPoints();
        shape.android = this.gMap.addPolyline(shape.android);
        this._shapes.push(shape);
    };
    MapView.prototype.addPolygon = function (shape) {
        shape.loadPoints();
        shape.loadHoles();
        shape.android = this.gMap.addPolygon(shape.android);
        this._shapes.push(shape);
    };
    MapView.prototype.addCircle = function (shape) {
        shape.android = this.gMap.addCircle(shape.android);
        this._shapes.push(shape);
    };
    MapView.prototype.removeShape = function (shape) {
        shape.android.remove();
        this._shapes.splice(this._shapes.indexOf(shape), 1);
    };
    MapView.prototype.removeAllShapes = function () {
        this._shapes.forEach(function (shape) {
            shape.android.remove();
        });
        this._shapes = [];
    };
    MapView.prototype.clear = function () {
        this._markers = [];
        this._shapes = [];
        this.gMap.clear();
    };
    MapView.prototype.setStyle = function (style) {
        var styleOptions = new com.google.android.gms.maps.model.MapStyleOptions(JSON.stringify(style));
        return this.gMap.setMapStyle(styleOptions);
    };
    MapView.prototype.findShape = function (callback) {
        return this._shapes.find(callback);
    };
    return MapView;
}(map_view_common_1.MapViewBase));
exports.MapView = MapView;
var UISettings = (function (_super) {
    __extends(UISettings, _super);
    function UISettings(android) {
        var _this = _super.call(this) || this;
        _this._android = android;
        return _this;
    }
    Object.defineProperty(UISettings.prototype, "android", {
        get: function () {
            return this._android;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UISettings.prototype, "compassEnabled", {
        get: function () {
            return this._android.isCompassEnabled();
        },
        set: function (value) {
            this._android.setCompassEnabled(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UISettings.prototype, "indoorLevelPickerEnabled", {
        get: function () {
            return this._android.isIndoorLevelPickerEnabled();
        },
        set: function (value) {
            this._android.setIndoorLevelPickerEnabled(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UISettings.prototype, "mapToolbarEnabled", {
        get: function () {
            return this._android.isMapToolbarEnabled();
        },
        set: function (value) {
            this._android.setMapToolbarEnabled(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UISettings.prototype, "myLocationButtonEnabled", {
        get: function () {
            return this._android.isMyLocationButtonEnabled();
        },
        set: function (value) {
            this._android.setMyLocationButtonEnabled(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UISettings.prototype, "rotateGesturesEnabled", {
        get: function () {
            return this._android.isRotateGesturesEnabled();
        },
        set: function (value) {
            this._android.setRotateGesturesEnabled(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UISettings.prototype, "scrollGesturesEnabled", {
        get: function () {
            return this._android.isScrollGesturesEnabled();
        },
        set: function (value) {
            this._android.setScrollGesturesEnabled(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UISettings.prototype, "tiltGesturesEnabled", {
        get: function () {
            return this._android.isTiltGesturesEnabled();
        },
        set: function (value) {
            this._android.setTiltGesturesEnabled(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UISettings.prototype, "zoomControlsEnabled", {
        get: function () {
            return this._android.isZoomControlsEnabled();
        },
        set: function (value) {
            this._android.setZoomControlsEnabled(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UISettings.prototype, "zoomGesturesEnabled", {
        get: function () {
            return this._android.isZoomGesturesEnabled();
        },
        set: function (value) {
            this._android.setZoomGesturesEnabled(value);
        },
        enumerable: true,
        configurable: true
    });
    return UISettings;
}(map_view_common_1.UISettingsBase));
exports.UISettings = UISettings;
var Projection = (function (_super) {
    __extends(Projection, _super);
    function Projection(android) {
        var _this = _super.call(this) || this;
        _this._android = android;
        return _this;
    }
    Object.defineProperty(Projection.prototype, "android", {
        get: function () {
            return this._android;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Projection.prototype, "visibleRegion", {
        get: function () {
            return new VisibleRegion(this.android.getVisibleRegion());
        },
        enumerable: true,
        configurable: true
    });
    Projection.prototype.fromScreenLocation = function (point) {
        var latLng = this.android.fromScreenLocation(new android.graphics.Point(point.x, point.y));
        return new Position(latLng);
    };
    Projection.prototype.toScreenLocation = function (position) {
        var point = this.android.toScreenLocation(position.android);
        return {
            x: point.x,
            y: point.y
        };
    };
    return Projection;
}(map_view_common_1.ProjectionBase));
exports.Projection = Projection;
var VisibleRegion = (function (_super) {
    __extends(VisibleRegion, _super);
    function VisibleRegion(android) {
        var _this = _super.call(this) || this;
        _this._android = android;
        return _this;
    }
    Object.defineProperty(VisibleRegion.prototype, "android", {
        get: function () {
            return this._android;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VisibleRegion.prototype, "nearLeft", {
        get: function () {
            return new Position(this.android.nearLeft);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VisibleRegion.prototype, "nearRight", {
        get: function () {
            return new Position(this.android.nearRight);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VisibleRegion.prototype, "farLeft", {
        get: function () {
            return new Position(this.android.farLeft);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VisibleRegion.prototype, "farRight", {
        get: function () {
            return new Position(this.android.farRight);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VisibleRegion.prototype, "bounds", {
        get: function () {
            return new Bounds(this.android.latLngBounds);
        },
        enumerable: true,
        configurable: true
    });
    return VisibleRegion;
}(map_view_common_1.VisibleRegionBase));
exports.VisibleRegion = VisibleRegion;
var Position = (function (_super) {
    __extends(Position, _super);
    function Position(android) {
        var _this = _super.call(this) || this;
        _this._android = android || new com.google.android.gms.maps.model.LatLng(0, 0);
        return _this;
    }
    Object.defineProperty(Position.prototype, "android", {
        get: function () {
            return this._android;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Position.prototype, "latitude", {
        get: function () {
            return this._android.latitude;
        },
        set: function (latitude) {
            this._android = new com.google.android.gms.maps.model.LatLng(parseFloat("" + latitude), this.longitude);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Position.prototype, "longitude", {
        get: function () {
            return this._android.longitude;
        },
        set: function (longitude) {
            this._android = new com.google.android.gms.maps.model.LatLng(this.latitude, parseFloat("" + longitude));
        },
        enumerable: true,
        configurable: true
    });
    Position.positionFromLatLng = function (latitude, longitude) {
        var position = new Position();
        position.latitude = latitude;
        position.longitude = longitude;
        return position;
    };
    return Position;
}(map_view_common_1.PositionBase));
exports.Position = Position;
var Bounds = (function (_super) {
    __extends(Bounds, _super);
    function Bounds(android) {
        var _this = _super.call(this) || this;
        _this._android = android;
        return _this;
    }
    Object.defineProperty(Bounds.prototype, "android", {
        get: function () {
            return this._android;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Bounds.prototype, "southwest", {
        get: function () {
            return new Position(this.android.southwest);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Bounds.prototype, "northeast", {
        get: function () {
            return new Position(this.android.northeast);
        },
        enumerable: true,
        configurable: true
    });
    Bounds.fromCoordinates = function (southwest, northeast) {
        return new Bounds(new com.google.android.gms.maps.model.LatLngBounds(southwest.android, northeast.android));
    };
    return Bounds;
}(map_view_common_1.BoundsBase));
exports.Bounds = Bounds;
var Marker = (function (_super) {
    __extends(Marker, _super);
    function Marker() {
        var _this = _super.call(this) || this;
        _this._isMarker = false;
        _this.android = new com.google.android.gms.maps.model.MarkerOptions();
        return _this;
    }
    Object.defineProperty(Marker.prototype, "position", {
        get: function () {
            return new Position(this._android.getPosition());
        },
        set: function (value) {
            if (this._isMarker) {
                this._android.setPosition(value.android);
            }
            else {
                this._android.position(value.android);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Marker.prototype, "rotation", {
        get: function () {
            return this._android.getRotation();
        },
        set: function (value) {
            if (this._isMarker) {
                this._android.setRotation(value);
            }
            else {
                this._android.rotation(value);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Marker.prototype, "zIndex", {
        get: function () {
            return this._android.getZIndex();
        },
        set: function (value) {
            if (this._isMarker) {
                this._android.setZIndex(value);
            }
            else {
                this._android.zIndex(value);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Marker.prototype, "title", {
        get: function () {
            return this._android.getTitle();
        },
        set: function (title) {
            if (this._isMarker) {
                this._android.setTitle(title);
            }
            else {
                this._android.title(title);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Marker.prototype, "snippet", {
        get: function () {
            return this._android.getSnippet();
        },
        set: function (snippet) {
            if (this._isMarker) {
                this._android.setSnippet(snippet);
            }
            else {
                this._android.snippet(snippet);
            }
        },
        enumerable: true,
        configurable: true
    });
    Marker.prototype.showInfoWindow = function () {
        if (this._isMarker) {
            this.android.showInfoWindow();
        }
    };
    Marker.prototype.isInfoWindowShown = function () {
        return (this._isMarker) ? this.android.showInfoWindow() : false;
    };
    Marker.prototype.hideInfoWindow = function () {
        if (this._isMarker) {
            this.android.hideInfoWindow();
        }
    };
    Object.defineProperty(Marker.prototype, "color", {
        get: function () {
            return this._color;
        },
        set: function (value) {
            value = map_view_common_1.getColorHue(value);
            this._color = value;
            var androidIcon = (value) ? com.google.android.gms.maps.model.BitmapDescriptorFactory.defaultMarker(value) : null;
            if (this._isMarker) {
                this._android.setIcon(androidIcon);
            }
            else {
                this._android.icon(androidIcon);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Marker.prototype, "icon", {
        get: function () {
            return this._icon;
        },
        set: function (value) {
            if (typeof value === 'string') {
                var tempIcon = new image_1.Image();
                tempIcon.imageSource = imageSource.fromResource(String(value));
                value = tempIcon;
            }
            this._icon = value;
            var androidIcon = (value) ? com.google.android.gms.maps.model.BitmapDescriptorFactory.fromBitmap(value.imageSource.android) : null;
            if (this._isMarker) {
                this._android.setIcon(androidIcon);
            }
            else {
                this._android.icon(androidIcon);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Marker.prototype, "alpha", {
        get: function () {
            return this._android.getAlpha();
        },
        set: function (value) {
            if (this._isMarker) {
                this._android.setAlpha(value);
            }
            else {
                this._android.alpha(value);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Marker.prototype, "flat", {
        get: function () {
            return this._android.isFlat();
        },
        set: function (value) {
            if (this._isMarker) {
                this._android.setFlat(value);
            }
            else {
                this._android.flat(value);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Marker.prototype, "anchor", {
        get: function () {
            return [this._android.getAnchorU(), this._android.getAnchorV()];
        },
        set: function (value) {
            if (this._isMarker) {
                this._android.setAnchor(value[0], value[1]);
            }
            else {
                this._android.anchor(value[0], value[1]);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Marker.prototype, "draggable", {
        get: function () {
            return this._android.isDraggable();
        },
        set: function (value) {
            if (this._isMarker) {
                this._android.setDraggable(value);
            }
            else {
                this._android.draggable(value);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Marker.prototype, "visible", {
        get: function () {
            return this._android.isVisible();
        },
        set: function (value) {
            if (this._isMarker) {
                this._android.setVisible(value);
            }
            else {
                this._android.visible(value);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Marker.prototype, "android", {
        get: function () {
            return this._android;
        },
        set: function (android) {
            this._android = android;
            this._isMarker = android.getClass().getName() === Marker.CLASS;
        },
        enumerable: true,
        configurable: true
    });
    Marker.CLASS = 'com.google.android.gms.maps.model.Marker';
    return Marker;
}(map_view_common_1.MarkerBase));
exports.Marker = Marker;
var Polyline = (function (_super) {
    __extends(Polyline, _super);
    function Polyline() {
        var _this = _super.call(this) || this;
        _this._isReal = false;
        _this.android = new com.google.android.gms.maps.model.PolylineOptions();
        _this._points = new Array();
        return _this;
    }
    Object.defineProperty(Polyline.prototype, "clickable", {
        get: function () {
            return this._android.isClickable();
        },
        set: function (value) {
            if (this._isReal) {
                this._android.setClickable(value);
            }
            else {
                this._android.clickable(value);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Polyline.prototype, "zIndex", {
        get: function () {
            return this._android.getZIndex();
        },
        set: function (value) {
            if (this._isReal) {
                this._android.setZIndex(value);
            }
            else {
                this._android.zIndex(value);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Polyline.prototype, "visible", {
        get: function () {
            return this._android.isVisible();
        },
        set: function (value) {
            if (this._isReal) {
                this._android.setVisible(value);
            }
            else {
                this._android.visible(value);
            }
        },
        enumerable: true,
        configurable: true
    });
    Polyline.prototype.loadPoints = function () {
        var _this = this;
        if (!this._isReal) {
            this._points.forEach(function (point) {
                _this._android.add(point.android);
            });
        }
    };
    Polyline.prototype.reloadPoints = function () {
        if (this._isReal) {
            var points = new java.util.ArrayList();
            this._points.forEach(function (point) {
                points.add(point.android);
            });
            this._android.setPoints(points);
        }
    };
    Object.defineProperty(Polyline.prototype, "width", {
        get: function () {
            return this._android.getStrokeWidth();
        },
        set: function (value) {
            if (this._isReal) {
                this._android.setWidth(value);
            }
            else {
                this._android.width(value);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Polyline.prototype, "color", {
        get: function () {
            return this._color;
        },
        set: function (value) {
            this._color = value;
            if (this._isReal) {
                this._android.setStrokeColor(value.android);
            }
            else {
                this._android.color(value.android);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Polyline.prototype, "geodesic", {
        get: function () {
            return this._android.isGeodesic();
        },
        set: function (value) {
            if (this._isReal) {
                this._android.setGeodesic(value);
            }
            else {
                this._android.geodesic(value);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Polyline.prototype, "android", {
        get: function () {
            return this._android;
        },
        set: function (android) {
            this._android = android;
            this._isReal = android.getClass().getName() === Polyline.CLASS;
        },
        enumerable: true,
        configurable: true
    });
    Polyline.CLASS = 'com.google.android.gms.maps.model.Polyline';
    return Polyline;
}(map_view_common_1.PolylineBase));
exports.Polyline = Polyline;
var Polygon = (function (_super) {
    __extends(Polygon, _super);
    function Polygon() {
        var _this = _super.call(this) || this;
        _this._isReal = false;
        _this.android = new com.google.android.gms.maps.model.PolygonOptions();
        _this._points = [];
        _this._holes = [];
        return _this;
    }
    Object.defineProperty(Polygon.prototype, "clickable", {
        get: function () {
            return this._android.isClickable();
        },
        set: function (value) {
            if (this._isReal) {
                this._android.setClickable(value);
            }
            else {
                this._android.clickable(value);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Polygon.prototype, "zIndex", {
        get: function () {
            return this._android.getZIndex();
        },
        set: function (value) {
            if (this._isReal) {
                this._android.setZIndex(value);
            }
            else {
                this._android.zIndex(value);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Polygon.prototype, "visible", {
        get: function () {
            return this._android.isVisible();
        },
        set: function (value) {
            if (this._isReal) {
                this._android.setVisible(value);
            }
            else {
                this._android.visible(value);
            }
        },
        enumerable: true,
        configurable: true
    });
    Polygon.prototype.loadPoints = function () {
        var _this = this;
        if (!this._isReal) {
            this._points.forEach(function (point) {
                _this._android.add(point.android);
            });
        }
    };
    Polygon.prototype.loadHoles = function () {
        var _this = this;
        if (!this._isReal) {
            this._holes.forEach(function (hole) {
                var points = new java.util.ArrayList();
                hole.forEach(function (point) {
                    points.add(point.android);
                });
                _this._android.addHole(points);
            });
        }
    };
    Polygon.prototype.reloadPoints = function () {
        if (this._isReal) {
            var points = new java.util.ArrayList();
            this._points.forEach(function (point) {
                points.add(point.android);
            });
            this._android.setPoints(points);
        }
    };
    Polygon.prototype.reloadHoles = function () {
        if (this._isReal) {
            var holes = new java.util.ArrayList();
            this._holes.forEach(function (hole) {
                var points = new java.util.ArrayList();
                hole.forEach(function (point) {
                    points.add(point.android);
                });
                holes.add(points);
            });
            this._android.setHoles(holes);
        }
    };
    Object.defineProperty(Polygon.prototype, "strokeWidth", {
        get: function () {
            return this._android.getStrokeWidth();
        },
        set: function (value) {
            if (this._isReal) {
                this._android.setStrokeWidth(value);
            }
            else {
                this._android.strokeWidth(value);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Polygon.prototype, "strokeColor", {
        get: function () {
            return this._strokeColor;
        },
        set: function (value) {
            this._strokeColor = value;
            if (this._isReal) {
                this._android.setStrokeColor(value.android);
            }
            else {
                this._android.strokeColor(value.android);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Polygon.prototype, "fillColor", {
        get: function () {
            return this._fillColor;
        },
        set: function (value) {
            this._fillColor = value;
            if (this._isReal) {
                this._android.setFillColor(value.android);
            }
            else {
                this._android.fillColor(value.android);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Polygon.prototype, "android", {
        get: function () {
            return this._android;
        },
        set: function (android) {
            this._android = android;
            this._isReal = android.getClass().getName() === Polygon.CLASS;
        },
        enumerable: true,
        configurable: true
    });
    Polygon.CLASS = 'com.google.android.gms.maps.model.Polygon';
    return Polygon;
}(map_view_common_1.PolygonBase));
exports.Polygon = Polygon;
var Circle = (function (_super) {
    __extends(Circle, _super);
    function Circle() {
        var _this = _super.call(this) || this;
        _this._isReal = false;
        _this.android = new com.google.android.gms.maps.model.CircleOptions();
        return _this;
    }
    Object.defineProperty(Circle.prototype, "clickable", {
        get: function () {
            return this._android.isClickable();
        },
        set: function (value) {
            if (this._isReal) {
                this._android.setClickable(value);
            }
            else {
                this._android.clickable(value);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Circle.prototype, "zIndex", {
        get: function () {
            return this._android.getZIndex();
        },
        set: function (value) {
            if (this._isReal) {
                this._android.setZIndex(value);
            }
            else {
                this._android.zIndex(value);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Circle.prototype, "visible", {
        get: function () {
            return this._android.isVisible();
        },
        set: function (value) {
            if (this._isReal) {
                this._android.setVisible(value);
            }
            else {
                this._android.visible(value);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Circle.prototype, "center", {
        get: function () {
            return this._center;
        },
        set: function (value) {
            this._center = value;
            if (this._isReal) {
                this._android.setCenter(value.android);
            }
            else {
                this._android.center(value.android);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Circle.prototype, "radius", {
        get: function () {
            return this._android.getRadius();
        },
        set: function (value) {
            if (this._isReal) {
                this._android.setRadius(value);
            }
            else {
                this._android.radius(value);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Circle.prototype, "strokeWidth", {
        get: function () {
            return this._android.getStrokeWidth();
        },
        set: function (value) {
            if (this._isReal) {
                this._android.setStrokeWidth(value);
            }
            else {
                this._android.strokeWidth(value);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Circle.prototype, "strokeColor", {
        get: function () {
            return this._strokeColor;
        },
        set: function (value) {
            this._strokeColor = value;
            if (this._isReal) {
                this._android.setStrokeColor(value.android);
            }
            else {
                this._android.strokeColor(value.android);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Circle.prototype, "fillColor", {
        get: function () {
            return this._fillColor;
        },
        set: function (value) {
            this._fillColor = value;
            if (this._isReal) {
                this._android.setFillColor(value.android);
            }
            else {
                this._android.fillColor(value.android);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Circle.prototype, "android", {
        get: function () {
            return this._android;
        },
        set: function (android) {
            this._android = android;
            this._isReal = android.getClass().getName() === Circle.CLASS;
        },
        enumerable: true,
        configurable: true
    });
    Circle.CLASS = 'com.google.android.gms.maps.model.Circle';
    return Circle;
}(map_view_common_1.CircleBase));
exports.Circle = Circle;
