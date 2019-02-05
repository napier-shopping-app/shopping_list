"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var map_view_common_1 = require("./map-view-common");
var imageSource = require("tns-core-modules/image-source");
var image_1 = require("tns-core-modules/ui/image");
var utils_1 = require("utils/utils");
__export(require("./map-view-common"));
;
;
;
;
;
;
;
;
;
;
;
var MapViewDelegateImpl = (function (_super) {
    __extends(MapViewDelegateImpl, _super);
    function MapViewDelegateImpl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MapViewDelegateImpl.initWithOwner = function (owner) {
        var handler = MapViewDelegateImpl.new();
        handler._owner = owner;
        return handler;
    };
    MapViewDelegateImpl.prototype.mapViewIdleAtCameraPosition = function (mapView, cameraPosition) {
        var owner = this._owner.get();
        if (owner) {
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
            if (owner.tilt != cameraPosition.viewingAngle) {
                cameraChanged = true;
                map_view_common_1.tiltProperty.nativeValueChange(owner, cameraPosition.viewingAngle);
            }
            if (cameraChanged) {
                owner.notifyCameraEvent(map_view_common_1.MapViewBase.cameraChangedEvent, {
                    latitude: cameraPosition.target.latitude,
                    longitude: cameraPosition.target.longitude,
                    zoom: cameraPosition.zoom,
                    bearing: cameraPosition.bearing,
                    tilt: cameraPosition.viewingAngle
                });
            }
            owner._processingCameraEvent = false;
        }
    };
    MapViewDelegateImpl.prototype.mapViewDidChangeCameraPosition = function (mapView, cameraPosition) {
        var owner = this._owner.get();
        owner.notifyCameraEvent(map_view_common_1.MapViewBase.cameraMoveEvent, {
            latitude: cameraPosition.target.latitude,
            longitude: cameraPosition.target.longitude,
            zoom: cameraPosition.zoom,
            bearing: cameraPosition.bearing,
            tilt: cameraPosition.viewingAngle
        });
    };
    MapViewDelegateImpl.prototype.mapViewDidTapAtCoordinate = function (mapView, coordinate) {
        var owner = this._owner.get();
        if (owner) {
            var position = Position.positionFromLatLng(coordinate.latitude, coordinate.longitude);
            owner.notifyPositionEvent(map_view_common_1.MapViewBase.coordinateTappedEvent, position);
        }
    };
    MapViewDelegateImpl.prototype.mapViewDidLongPressAtCoordinate = function (mapView, coordinate) {
        var owner = this._owner.get();
        if (owner) {
            var position = Position.positionFromLatLng(coordinate.latitude, coordinate.longitude);
            owner.notifyPositionEvent(map_view_common_1.MapViewBase.coordinateLongPressEvent, position);
        }
    };
    MapViewDelegateImpl.prototype.mapViewDidTapMarker = function (mapView, gmsMarker) {
        var owner = this._owner.get();
        if (owner) {
            var marker = owner.findMarker(function (marker) { return marker.ios == gmsMarker; });
            owner.notifyMarkerTapped(marker);
        }
    };
    MapViewDelegateImpl.prototype.mapViewDidTapOverlay = function (mapView, gmsOverlay) {
        var owner = this._owner.get();
        if (owner) {
            var shape = owner.findShape(function (shape) { return shape.ios == gmsOverlay; });
            if (shape) {
                owner.notifyShapeTapped(shape);
            }
        }
    };
    MapViewDelegateImpl.prototype.mapViewDidBeginDraggingMarker = function (mapView, gmsMarker) {
        var owner = this._owner.get();
        if (owner) {
            var marker = owner.findMarker(function (marker) { return marker.ios == gmsMarker; });
            owner.notifyMarkerBeginDragging(marker);
        }
    };
    MapViewDelegateImpl.prototype.mapViewDidEndDraggingMarker = function (mapView, gmsMarker) {
        var owner = this._owner.get();
        if (owner) {
            var marker = owner.findMarker(function (marker) { return marker.ios == gmsMarker; });
            owner.notifyMarkerEndDragging(marker);
        }
    };
    MapViewDelegateImpl.prototype.mapViewDidDragMarker = function (mapView, gmsMarker) {
        var owner = this._owner.get();
        if (owner) {
            var marker = owner.findMarker(function (marker) { return marker.ios == gmsMarker; });
            owner.notifyMarkerDrag(marker);
        }
    };
    MapViewDelegateImpl.prototype.mapViewDidTapInfoWindowOfMarker = function (mapView, gmsMarker) {
        var owner = this._owner.get();
        if (owner) {
            var marker = owner.findMarker(function (marker) { return marker.ios == gmsMarker; });
            owner.notifyMarkerInfoWindowTapped(marker);
        }
    };
    MapViewDelegateImpl.prototype.didTapMyLocationButtonForMapView = function (mapView) {
        var owner = this._owner.get();
        if (owner) {
            owner.notifyMyLocationTapped();
        }
    };
    MapViewDelegateImpl.prototype.mapViewMarkerInfoWindow = function (mapView, gmsMarker) {
        return null;
    };
    MapViewDelegateImpl.prototype.mapViewMarkerInfoContents = function (mapView, gmsMarker) {
        var owner = this._owner.get();
        if (!owner)
            return null;
        var marker = owner.findMarker(function (marker) { return marker.ios == gmsMarker; });
        var content = owner._getMarkerInfoWindowContent(marker);
        if (content) {
            var width = Number(content.width);
            if (Number.isNaN(width))
                width = null;
            var height = Number(content.height);
            if (Number.isNaN(height))
                height = null;
            if (!height || !width) {
                var bounds = require("utils/utils").ios.getter(UIScreen, UIScreen.mainScreen).bounds;
                width = width || (bounds.size.width * .7);
                height = height || (bounds.size.height * .4);
            }
            require("ui/utils").ios._layoutRootView(content, CGRectMake(0, 0, width, height));
            return content.ios;
        }
        return null;
    };
    MapViewDelegateImpl.ObjCProtocols = [GMSMapViewDelegate];
    return MapViewDelegateImpl;
}(NSObject));
var MapView = (function (_super) {
    __extends(MapView, _super);
    function MapView() {
        var _this = _super.call(this) || this;
        _this._markers = new Array();
        _this.nativeView = GMSMapView.mapWithFrameCamera(CGRectZero, _this._createCameraPosition());
        _this._delegate = MapViewDelegateImpl.initWithOwner(new WeakRef(_this));
        _this.updatePadding();
        return _this;
    }
    MapView.prototype.onLoaded = function () {
        _super.prototype.onLoaded.call(this);
        this.nativeView.delegate = this._delegate;
        this.notifyMapReady();
    };
    MapView.prototype.onUnloaded = function () {
        this.nativeView.delegate = null;
        _super.prototype.onUnloaded.call(this);
    };
    MapView.prototype.disposeNativeView = function () {
        this._markers = null;
        this._delegate = null;
        _super.prototype.disposeNativeView.call(this);
        utils_1.GC();
    };
    ;
    MapView.prototype._createCameraPosition = function () {
        return GMSCameraPosition.cameraWithLatitudeLongitudeZoomBearingViewingAngle(this.latitude, this.longitude, this.zoom, this.bearing, this.tilt);
    };
    MapView.prototype.updateCamera = function () {
        if (this.mapAnimationsEnabled) {
            this.nativeView.animateToCameraPosition(this._createCameraPosition());
        }
        else {
            this.nativeView.camera = this._createCameraPosition();
        }
    };
    MapView.prototype.setViewport = function (bounds, padding) {
        var p = UIEdgeInsetsMake(padding, padding, padding, padding) || this.gMap.padding;
        var cameraPosition = this.nativeView.cameraForBoundsInsets(bounds.ios, p);
        if (this.mapAnimationsEnabled) {
            this.nativeView.animateToCameraPosition(cameraPosition);
        }
        else {
            this.nativeView.camera = cameraPosition;
        }
    };
    MapView.prototype.updatePadding = function () {
        if (this.padding) {
            this.gMap.padding = UIEdgeInsetsMake(this.padding[0] || 0, this.padding[2] || 0, this.padding[1] || 0, this.padding[3] || 0);
        }
    };
    Object.defineProperty(MapView.prototype, "ios", {
        get: function () {
            throw new Error('Now use instance.nativeView instead of instance.ios');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MapView.prototype, "gMap", {
        get: function () {
            return this.nativeView;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MapView.prototype, "projection", {
        get: function () {
            return new Projection(this.nativeView.projection);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MapView.prototype, "settings", {
        get: function () {
            return (this.nativeView) ? new UISettings(this.nativeView.settings) : null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MapView.prototype, "myLocationEnabled", {
        get: function () {
            return (this.nativeView) ? this.nativeView.myLocationEnabled : false;
        },
        set: function (value) {
            if (this.nativeView)
                this.nativeView.myLocationEnabled = value;
        },
        enumerable: true,
        configurable: true
    });
    MapView.prototype.setMinZoomMaxZoom = function () {
        this.gMap.setMinZoomMaxZoom(this.minZoom, this.maxZoom);
    };
    MapView.prototype.addMarker = function () {
        var _this = this;
        var markers = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            markers[_i] = arguments[_i];
        }
        markers.forEach(function (marker) {
            marker.ios.map = _this.gMap;
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
            marker.ios.map = null;
            _this._markers.splice(_this._markers.indexOf(marker), 1);
        });
    };
    MapView.prototype.removeAllMarkers = function () {
        var _this = this;
        this._markers.forEach(function (marker) {
            _this._unloadInfoWindowContent(marker);
            marker.ios.map = null;
        });
        this._markers = [];
    };
    MapView.prototype.findMarker = function (callback) {
        return this._markers.find(callback);
    };
    MapView.prototype.addPolyline = function (shape) {
        shape.loadPoints();
        shape.ios.map = this.gMap;
        this._shapes.push(shape);
    };
    MapView.prototype.addPolygon = function (shape) {
        shape.ios.map = this.gMap;
        this._shapes.push(shape);
    };
    MapView.prototype.addCircle = function (shape) {
        shape.ios.map = this.gMap;
        this._shapes.push(shape);
    };
    MapView.prototype.removeShape = function (shape) {
        shape.ios.map = null;
        this._shapes.splice(this._shapes.indexOf(shape), 1);
    };
    MapView.prototype.removeAllShapes = function () {
        this._shapes.forEach(function (shape) {
            shape.ios.map = null;
        });
        this._shapes = [];
    };
    MapView.prototype.findShape = function (callback) {
        return this._shapes.find(callback);
    };
    MapView.prototype.clear = function () {
        this._markers = [];
        this.nativeView.clear();
    };
    MapView.prototype.setStyle = function (style) {
        try {
            this.nativeView.mapStyle = GMSMapStyle.styleWithJSONStringError(JSON.stringify(style));
            return true;
        }
        catch (err) {
            return false;
        }
    };
    return MapView;
}(map_view_common_1.MapViewBase));
exports.MapView = MapView;
var UISettings = (function (_super) {
    __extends(UISettings, _super);
    function UISettings(ios) {
        var _this = _super.call(this) || this;
        _this._ios = ios;
        return _this;
    }
    Object.defineProperty(UISettings.prototype, "ios", {
        get: function () {
            return this._ios;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UISettings.prototype, "compassEnabled", {
        get: function () {
            return this._ios.compassButton;
        },
        set: function (value) {
            this._ios.compassButton = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UISettings.prototype, "indoorLevelPickerEnabled", {
        get: function () {
            return this._ios.indoorPicker;
        },
        set: function (value) {
            this._ios.indoorPicker = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UISettings.prototype, "mapToolbarEnabled", {
        get: function () {
            return false;
        },
        set: function (value) {
            if (value)
                console.warn("Map toolbar not available on iOS");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UISettings.prototype, "myLocationButtonEnabled", {
        get: function () {
            return this._ios.myLocationButton;
        },
        set: function (value) {
            this._ios.myLocationButton = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UISettings.prototype, "rotateGesturesEnabled", {
        get: function () {
            return this._ios.rotateGestures;
        },
        set: function (value) {
            this._ios.rotateGestures = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UISettings.prototype, "scrollGesturesEnabled", {
        get: function () {
            return this._ios.scrollGestures;
        },
        set: function (value) {
            this._ios.scrollGestures = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UISettings.prototype, "tiltGesturesEnabled", {
        get: function () {
            return this._ios.tiltGestures;
        },
        set: function (value) {
            this._ios.tiltGestures = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UISettings.prototype, "zoomControlsEnabled", {
        get: function () {
            return false;
        },
        set: function (value) {
            if (value)
                console.warn("Zoom controls not available on iOS");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(UISettings.prototype, "zoomGesturesEnabled", {
        get: function () {
            return this._ios.zoomGestures;
        },
        set: function (value) {
            this._ios.zoomGestures = value;
        },
        enumerable: true,
        configurable: true
    });
    return UISettings;
}(map_view_common_1.UISettingsBase));
exports.UISettings = UISettings;
var Projection = (function (_super) {
    __extends(Projection, _super);
    function Projection(ios) {
        var _this = _super.call(this) || this;
        _this._ios = ios;
        return _this;
    }
    Object.defineProperty(Projection.prototype, "ios", {
        get: function () {
            return this._ios;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Projection.prototype, "visibleRegion", {
        get: function () {
            return new VisibleRegion(this.ios.visibleRegion());
        },
        enumerable: true,
        configurable: true
    });
    Projection.prototype.fromScreenLocation = function (point) {
        var location = this.ios.coordinateForPoint(CGPointMake(point.x, point.y));
        return new Position(location);
    };
    Projection.prototype.toScreenLocation = function (position) {
        var cgPoint = this.ios.pointForCoordinate(position.ios);
        return {
            x: cgPoint.x,
            y: cgPoint.y
        };
    };
    return Projection;
}(map_view_common_1.ProjectionBase));
exports.Projection = Projection;
var VisibleRegion = (function (_super) {
    __extends(VisibleRegion, _super);
    function VisibleRegion(ios) {
        var _this = _super.call(this) || this;
        _this._ios = ios;
        return _this;
    }
    Object.defineProperty(VisibleRegion.prototype, "ios", {
        get: function () {
            return this._ios;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VisibleRegion.prototype, "nearLeft", {
        get: function () {
            return new Position(this.ios.nearLeft);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VisibleRegion.prototype, "nearRight", {
        get: function () {
            return new Position(this.ios.nearRight);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VisibleRegion.prototype, "farLeft", {
        get: function () {
            return new Position(this.ios.farLeft);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VisibleRegion.prototype, "farRight", {
        get: function () {
            return new Position(this.ios.farRight);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VisibleRegion.prototype, "bounds", {
        get: function () {
            return new Bounds(GMSCoordinateBounds.alloc().initWithRegion(this.ios));
        },
        enumerable: true,
        configurable: true
    });
    return VisibleRegion;
}(map_view_common_1.VisibleRegionBase));
exports.VisibleRegion = VisibleRegion;
var Bounds = (function (_super) {
    __extends(Bounds, _super);
    function Bounds(ios) {
        var _this = _super.call(this) || this;
        _this._ios = ios;
        return _this;
    }
    Object.defineProperty(Bounds.prototype, "ios", {
        get: function () {
            return this._ios;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Bounds.prototype, "southwest", {
        get: function () {
            return new Position(this.ios.southWest);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Bounds.prototype, "northeast", {
        get: function () {
            return new Position(this._ios.northEast);
        },
        enumerable: true,
        configurable: true
    });
    Bounds.fromCoordinates = function (southwest, northeast) {
        return new Bounds(GMSCoordinateBounds.alloc().initWithCoordinateCoordinate(southwest.ios, northeast.ios));
    };
    return Bounds;
}(map_view_common_1.BoundsBase));
exports.Bounds = Bounds;
var Position = (function (_super) {
    __extends(Position, _super);
    function Position(ios) {
        var _this = _super.call(this) || this;
        _this._ios = ios || CLLocationCoordinate2DMake(0, 0);
        return _this;
    }
    Object.defineProperty(Position.prototype, "ios", {
        get: function () {
            return this._ios;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Position.prototype, "latitude", {
        get: function () {
            return this._ios.latitude;
        },
        set: function (latitude) {
            this._ios = CLLocationCoordinate2DMake(latitude, this.longitude);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Position.prototype, "longitude", {
        get: function () {
            return this._ios.longitude;
        },
        set: function (longitude) {
            this._ios = CLLocationCoordinate2DMake(this.latitude, longitude);
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
var Marker = (function (_super) {
    __extends(Marker, _super);
    function Marker() {
        var _this = _super.call(this) || this;
        _this._alpha = 1;
        _this._visible = true;
        _this._ios = GMSMarker.new();
        return _this;
    }
    Object.defineProperty(Marker.prototype, "position", {
        get: function () {
            return new Position(this._ios.position);
        },
        set: function (position) {
            this._ios.position = position.ios;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Marker.prototype, "rotation", {
        get: function () {
            return this._ios.rotation;
        },
        set: function (value) {
            this._ios.rotation = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Marker.prototype, "zIndex", {
        get: function () {
            return this._ios.zIndex;
        },
        set: function (value) {
            this._ios.zIndex = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Marker.prototype, "title", {
        get: function () {
            return this._ios.title;
        },
        set: function (title) {
            this._ios.title = title;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Marker.prototype, "snippet", {
        get: function () {
            return this._ios.snippet;
        },
        set: function (snippet) {
            this._ios.snippet = snippet;
        },
        enumerable: true,
        configurable: true
    });
    Marker.prototype.showInfoWindow = function () {
        this._ios.map.selectedMarker = this._ios;
    };
    Marker.prototype.isInfoWindowShown = function () {
        return this._ios.map.selectedMarker == this._ios;
    };
    Marker.prototype.hideInfoWindow = function () {
        this._ios.map.selectedMarker = null;
    };
    Object.defineProperty(Marker.prototype, "color", {
        get: function () {
            return this._color;
        },
        set: function (value) {
            value = map_view_common_1.getColorHue(value);
            this._color = value;
            if (this._color) {
                this._ios.icon = GMSMarker.markerImageWithColor(UIColor.colorWithHueSaturationBrightnessAlpha(this._color / 360, 1, 1, 1));
            }
            else {
                this._ios.icon = null;
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
            this._ios.icon = (value) ? this._icon.imageSource.ios : null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Marker.prototype, "alpha", {
        get: function () {
            return this._alpha;
        },
        set: function (value) {
            this._alpha = value;
            if (this._visible)
                this._ios.opacity = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Marker.prototype, "visible", {
        get: function () {
            return this._visible;
        },
        set: function (value) {
            this._visible = value;
            this._ios.opacity = (this._visible) ? this._alpha : 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Marker.prototype, "flat", {
        get: function () {
            return this._ios.flat;
        },
        set: function (value) {
            this._ios.flat = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Marker.prototype, "anchor", {
        get: function () {
            return [this._ios.groundAnchor.x, this._ios.groundAnchor.y];
        },
        set: function (value) {
            this._ios.groundAnchor = CGPointMake(value[0], value[1]);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Marker.prototype, "draggable", {
        get: function () {
            return this._ios.draggable;
        },
        set: function (value) {
            this._ios.draggable = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Marker.prototype, "ios", {
        get: function () {
            return this._ios;
        },
        enumerable: true,
        configurable: true
    });
    return Marker;
}(map_view_common_1.MarkerBase));
exports.Marker = Marker;
var Polyline = (function (_super) {
    __extends(Polyline, _super);
    function Polyline() {
        var _this = _super.call(this) || this;
        _this._ios = GMSPolyline.new();
        _this._points = [];
        return _this;
    }
    Object.defineProperty(Polyline.prototype, "clickable", {
        get: function () {
            return this._ios.tappable;
        },
        set: function (value) {
            this._ios.tappable = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Polyline.prototype, "zIndex", {
        get: function () {
            return this._ios.zIndex;
        },
        set: function (value) {
            this._ios.zIndex = value;
        },
        enumerable: true,
        configurable: true
    });
    Polyline.prototype.loadPoints = function () {
        var points = GMSMutablePath.new();
        this._points.forEach(function (point) {
            points.addCoordinate(point.ios);
        }.bind(this));
        this._ios.path = points;
    };
    Polyline.prototype.reloadPoints = function () {
        this.loadPoints();
    };
    Object.defineProperty(Polyline.prototype, "width", {
        get: function () {
            return this._ios.strokeWidth;
        },
        set: function (value) {
            this._ios.strokeWidth = value;
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
            this._ios.strokeColor = value.ios;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Polyline.prototype, "geodesic", {
        get: function () {
            return this._ios.geodesic;
        },
        set: function (value) {
            this._ios.geodesic = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Polyline.prototype, "ios", {
        get: function () {
            return this._ios;
        },
        enumerable: true,
        configurable: true
    });
    return Polyline;
}(map_view_common_1.PolylineBase));
exports.Polyline = Polyline;
var Polygon = (function (_super) {
    __extends(Polygon, _super);
    function Polygon() {
        var _this = _super.call(this) || this;
        _this._ios = GMSPolygon.new();
        _this._points = [];
        _this._holes = [];
        return _this;
    }
    Object.defineProperty(Polygon.prototype, "clickable", {
        get: function () {
            return this._ios.tappable;
        },
        set: function (value) {
            this._ios.tappable = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Polygon.prototype, "zIndex", {
        get: function () {
            return this._ios.zIndex;
        },
        set: function (value) {
            this._ios.zIndex = value;
        },
        enumerable: true,
        configurable: true
    });
    Polygon.prototype.loadPoints = function () {
        var points = GMSMutablePath.new();
        this._points.forEach(function (point) {
            points.addCoordinate(point.ios);
        });
        this._ios.path = points;
    };
    Polygon.prototype.loadHoles = function () {
        var holes = [];
        this._holes.forEach(function (hole) {
            var points = GMSMutablePath.new();
            hole.forEach(function (point) {
                points.addCoordinate(point.ios);
            });
            holes.push(points);
        });
        this._ios.holes = holes;
    };
    Polygon.prototype.reloadPoints = function () {
        this.loadPoints();
    };
    Polygon.prototype.reloadHoles = function () {
        this.loadHoles();
    };
    Object.defineProperty(Polygon.prototype, "strokeWidth", {
        get: function () {
            return this._ios.strokeWidth;
        },
        set: function (value) {
            this._ios.strokeWidth = value;
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
            this._ios.strokeColor = value.ios;
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
            this._ios.fillColor = value.ios;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Polygon.prototype, "ios", {
        get: function () {
            return this._ios;
        },
        enumerable: true,
        configurable: true
    });
    return Polygon;
}(map_view_common_1.PolygonBase));
exports.Polygon = Polygon;
var Circle = (function (_super) {
    __extends(Circle, _super);
    function Circle() {
        var _this = _super.call(this) || this;
        _this._ios = GMSCircle.new();
        return _this;
    }
    Object.defineProperty(Circle.prototype, "clickable", {
        get: function () {
            return this._ios.tappable;
        },
        set: function (value) {
            this._ios.tappable = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Circle.prototype, "zIndex", {
        get: function () {
            return this._ios.zIndex;
        },
        set: function (value) {
            this._ios.zIndex = value;
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
            this._ios.position = value.ios;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Circle.prototype, "radius", {
        get: function () {
            return this._ios.radius;
        },
        set: function (value) {
            this._ios.radius = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Circle.prototype, "strokeWidth", {
        get: function () {
            return this._ios.strokeWidth;
        },
        set: function (value) {
            this._ios.strokeWidth = value;
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
            this._ios.strokeColor = value.ios;
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
            this._ios.fillColor = value.ios;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Circle.prototype, "ios", {
        get: function () {
            return this._ios;
        },
        enumerable: true,
        configurable: true
    });
    return Circle;
}(map_view_common_1.CircleBase));
exports.Circle = Circle;
