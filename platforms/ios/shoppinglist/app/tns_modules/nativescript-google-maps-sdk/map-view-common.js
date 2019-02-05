"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var map_view_1 = require("./map-view");
exports.StyleBase = map_view_1.Style;
var view_1 = require("tns-core-modules/ui/core/view");
var image_1 = require("tns-core-modules/ui/image");
var layout_base_1 = require("tns-core-modules/ui/layouts/layout-base");
var properties_1 = require("tns-core-modules/ui/core/properties");
var color_1 = require("tns-core-modules/color");
var builder_1 = require("tns-core-modules/ui/builder");
var view_base_1 = require("tns-core-modules/ui/core/view-base");
var proxy_view_container_1 = require("tns-core-modules/ui/proxy-view-container");
var stack_layout_1 = require("tns-core-modules/ui/layouts/stack-layout");
function onInfoWindowTemplatesChanged(mapView) {
    var _infoWindowTemplates = new Array();
    if (mapView.infoWindowTemplates && typeof mapView.infoWindowTemplates === "string") {
        _infoWindowTemplates = _infoWindowTemplates.concat(builder_1.parseMultipleTemplates(mapView.infoWindowTemplates));
    }
    else if (mapView.infoWindowTemplates) {
        _infoWindowTemplates = _infoWindowTemplates.concat(mapView.infoWindowTemplates);
    }
    mapView._infoWindowTemplates = _infoWindowTemplates;
}
function onMapPropertyChanged(mapView) {
    if (!mapView.processingCameraEvent)
        mapView.updateCamera();
}
function onSetMinZoomMaxZoom(mapView) {
    mapView.setMinZoomMaxZoom();
}
function onPaddingPropertyChanged(mapView) {
    mapView.updatePadding();
}
function paddingValueConverter(value) {
    if (!Array.isArray(value)) {
        value = String(value).split(',');
    }
    value = value.map(function (v) { return parseInt(v, 10); });
    if (value.length >= 4) {
        return value;
    }
    else if (value.length === 3) {
        return [value[0], value[1], value[2], value[2]];
    }
    else if (value.length === 2) {
        return [value[0], value[0], value[1], value[1]];
    }
    else if (value.length === 1) {
        return [value[0], value[0], value[0], value[0]];
    }
    else {
        return [0, 0, 0, 0];
    }
}
function onDescendantsLoaded(view, callback) {
    if (!view)
        return callback();
    var loadingCount = 1;
    var loadedCount = 0;
    var watchLoaded = function (view, event) {
        var onLoaded = function () {
            view.off(event, onLoaded);
            loadedCount++;
            if (view instanceof image_1.Image && view.isLoading) {
                loadingCount++;
                watchLoaded(view, 'isLoadingChange');
                if (view.nativeView.onAttachedToWindow) {
                    view.nativeView.onAttachedToWindow();
                }
            }
            if (loadedCount === loadingCount)
                callback();
        };
        view.on(event, onLoaded);
    };
    view_base_1.eachDescendant(view, function (descendant) {
        loadingCount++;
        watchLoaded(descendant, view_1.View.loadedEvent);
        return true;
    });
    watchLoaded(view, view_1.View.loadedEvent);
}
var knownTemplates;
(function (knownTemplates) {
    knownTemplates.infoWindowTemplate = "infoWindowTemplate";
})(knownTemplates = exports.knownTemplates || (exports.knownTemplates = {}));
var knownMultiTemplates;
(function (knownMultiTemplates) {
    knownMultiTemplates.infoWindowTemplates = "infoWindowTemplates";
})(knownMultiTemplates = exports.knownMultiTemplates || (exports.knownMultiTemplates = {}));
function getColorHue(color) {
    if (typeof color === 'number') {
        while (color < 0) {
            color += 360;
        }
        return color % 360;
    }
    if (typeof color === 'string')
        color = new color_1.Color(color);
    if (!(color instanceof color_1.Color))
        return color;
    var min, max, delta, hue;
    var r = Math.max(0, Math.min(1, color.r / 255));
    var g = Math.max(0, Math.min(1, color.g / 255));
    var b = Math.max(0, Math.min(1, color.b / 255));
    min = Math.min(r, g, b);
    max = Math.max(r, g, b);
    delta = max - min;
    if (delta == 0) {
        hue = 0;
    }
    else if (r == max) {
        hue = (g - b) / delta;
    }
    else if (g == max) {
        hue = 2 + (b - r) / delta;
    }
    else {
        hue = 4 + (r - g) / delta;
    }
    hue = ((hue * 60) + 360) % 360;
    return hue;
}
exports.getColorHue = getColorHue;
var MapViewBase = (function (_super) {
    __extends(MapViewBase, _super);
    function MapViewBase() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._markers = new Array();
        _this._shapes = new Array();
        _this._defaultInfoWindowTemplate = {
            key: "",
            createView: function () {
                if (_this.infoWindowTemplate) {
                    return builder_1.parse(_this.infoWindowTemplate, _this);
                }
                return undefined;
            }
        };
        _this._infoWindowTemplates = new Array();
        return _this;
    }
    Object.defineProperty(MapViewBase.prototype, "gMap", {
        get: function () {
            return this._gMap;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MapViewBase.prototype, "processingCameraEvent", {
        get: function () {
            return this._processingCameraEvent;
        },
        enumerable: true,
        configurable: true
    });
    MapViewBase.prototype._getMarkerInfoWindowContent = function (marker) {
        var view;
        if (marker && marker._infoWindowView) {
            view = marker._infoWindowView;
            return view;
        }
        var template = this._getInfoWindowTemplate(marker);
        if (template)
            view = template.createView();
        if (!view)
            return null;
        if (!(view instanceof layout_base_1.LayoutBase) ||
            view instanceof proxy_view_container_1.ProxyViewContainer) {
            var sp = new stack_layout_1.StackLayout();
            sp.addChild(view);
            view = sp;
        }
        marker._infoWindowView = view;
        view.bindingContext = marker;
        onDescendantsLoaded(view, function () {
            marker.hideInfoWindow();
            marker.showInfoWindow();
        });
        this._addView(view);
        view.onLoaded();
        return view;
    };
    MapViewBase.prototype._unloadInfoWindowContent = function (marker) {
        if (marker._infoWindowView) {
            marker._infoWindowView.onUnloaded();
            marker._infoWindowView = null;
        }
    };
    MapViewBase.prototype._getInfoWindowTemplate = function (marker) {
        if (marker) {
            var templateKey = marker.infoWindowTemplate;
            for (var i = 0, length_1 = this._infoWindowTemplates.length; i < length_1; i++) {
                if (this._infoWindowTemplates[i].key === templateKey) {
                    return this._infoWindowTemplates[i];
                }
            }
        }
        return this._defaultInfoWindowTemplate;
    };
    MapViewBase.prototype.removeAllPolylines = function () {
        var _this = this;
        this._shapes.forEach(function (shape) {
            if (shape.shape === 'polyline') {
                _this.removeShape(shape);
            }
        });
    };
    MapViewBase.prototype.removeAllPolygons = function () {
        var _this = this;
        this._shapes.forEach(function (shape) {
            if (shape.shape === 'polygon') {
                _this.removeShape(shape);
            }
        });
    };
    MapViewBase.prototype.removeAllCircles = function () {
        var _this = this;
        this._shapes.forEach(function (shape) {
            if (shape.shape === 'circle') {
                _this.removeShape(shape);
            }
        });
    };
    MapViewBase.prototype.notifyMapReady = function () {
        this.notify({ eventName: MapViewBase.mapReadyEvent, object: this, gMap: this.gMap });
    };
    MapViewBase.prototype.notifyMarkerEvent = function (eventName, marker) {
        var args = { eventName: eventName, object: this, marker: marker };
        this.notify(args);
    };
    MapViewBase.prototype.notifyShapeEvent = function (eventName, shape) {
        var args = { eventName: eventName, object: this, shape: shape };
        this.notify(args);
    };
    MapViewBase.prototype.notifyMarkerTapped = function (marker) {
        this.notifyMarkerEvent(MapViewBase.markerSelectEvent, marker);
    };
    MapViewBase.prototype.notifyMarkerInfoWindowTapped = function (marker) {
        this.notifyMarkerEvent(MapViewBase.markerInfoWindowTappedEvent, marker);
    };
    MapViewBase.prototype.notifyShapeTapped = function (shape) {
        this.notifyShapeEvent(MapViewBase.shapeSelectEvent, shape);
    };
    MapViewBase.prototype.notifyMarkerBeginDragging = function (marker) {
        this.notifyMarkerEvent(MapViewBase.markerBeginDraggingEvent, marker);
    };
    MapViewBase.prototype.notifyMarkerEndDragging = function (marker) {
        this.notifyMarkerEvent(MapViewBase.markerEndDraggingEvent, marker);
    };
    MapViewBase.prototype.notifyMarkerDrag = function (marker) {
        this.notifyMarkerEvent(MapViewBase.markerDragEvent, marker);
    };
    MapViewBase.prototype.notifyPositionEvent = function (eventName, position) {
        var args = { eventName: eventName, object: this, position: position };
        this.notify(args);
    };
    MapViewBase.prototype.notifyCameraEvent = function (eventName, camera) {
        var args = { eventName: eventName, object: this, camera: camera };
        this.notify(args);
    };
    MapViewBase.prototype.notifyMyLocationTapped = function () {
        this.notify({ eventName: MapViewBase.myLocationTappedEvent, object: this });
    };
    MapViewBase.mapReadyEvent = "mapReady";
    MapViewBase.markerSelectEvent = "markerSelect";
    MapViewBase.markerInfoWindowTappedEvent = "markerInfoWindowTapped";
    MapViewBase.shapeSelectEvent = "shapeSelect";
    MapViewBase.markerBeginDraggingEvent = "markerBeginDragging";
    MapViewBase.markerEndDraggingEvent = "markerEndDragging";
    MapViewBase.markerDragEvent = "markerDrag";
    MapViewBase.coordinateTappedEvent = "coordinateTapped";
    MapViewBase.coordinateLongPressEvent = "coordinateLongPress";
    MapViewBase.cameraChangedEvent = "cameraChanged";
    MapViewBase.cameraMoveEvent = "cameraMove";
    MapViewBase.myLocationTappedEvent = "myLocationTapped";
    return MapViewBase;
}(view_1.View));
exports.MapViewBase = MapViewBase;
exports.infoWindowTemplateProperty = new properties_1.Property({ name: "infoWindowTemplate" });
exports.infoWindowTemplateProperty.register(MapViewBase);
exports.infoWindowTemplatesProperty = new properties_1.Property({ name: "infoWindowTemplates", valueChanged: onInfoWindowTemplatesChanged });
exports.infoWindowTemplatesProperty.register(MapViewBase);
exports.latitudeProperty = new properties_1.Property({ name: 'latitude', defaultValue: 0, valueChanged: onMapPropertyChanged });
exports.latitudeProperty.register(MapViewBase);
exports.longitudeProperty = new properties_1.Property({ name: 'longitude', defaultValue: 0, valueChanged: onMapPropertyChanged });
exports.longitudeProperty.register(MapViewBase);
exports.bearingProperty = new properties_1.Property({ name: 'bearing', defaultValue: 0, valueChanged: onMapPropertyChanged });
exports.bearingProperty.register(MapViewBase);
exports.zoomProperty = new properties_1.Property({ name: 'zoom', defaultValue: 0, valueChanged: onMapPropertyChanged });
exports.zoomProperty.register(MapViewBase);
exports.minZoomProperty = new properties_1.Property({ name: 'minZoom', defaultValue: 0, valueChanged: onSetMinZoomMaxZoom });
exports.minZoomProperty.register(MapViewBase);
exports.maxZoomProperty = new properties_1.Property({ name: 'maxZoom', defaultValue: 22, valueChanged: onSetMinZoomMaxZoom });
exports.maxZoomProperty.register(MapViewBase);
exports.tiltProperty = new properties_1.Property({ name: 'tilt', defaultValue: 0, valueChanged: onMapPropertyChanged });
exports.tiltProperty.register(MapViewBase);
exports.paddingProperty = new properties_1.Property({ name: 'padding', valueChanged: onPaddingPropertyChanged, valueConverter: paddingValueConverter });
exports.paddingProperty.register(MapViewBase);
exports.mapAnimationsEnabledProperty = new properties_1.Property({ name: 'mapAnimationsEnabled', defaultValue: true });
exports.mapAnimationsEnabledProperty.register(MapViewBase);
var UISettingsBase = (function () {
    function UISettingsBase() {
    }
    return UISettingsBase;
}());
exports.UISettingsBase = UISettingsBase;
var ProjectionBase = (function () {
    function ProjectionBase() {
    }
    return ProjectionBase;
}());
exports.ProjectionBase = ProjectionBase;
var VisibleRegionBase = (function () {
    function VisibleRegionBase() {
    }
    return VisibleRegionBase;
}());
exports.VisibleRegionBase = VisibleRegionBase;
var PositionBase = (function () {
    function PositionBase() {
    }
    return PositionBase;
}());
exports.PositionBase = PositionBase;
var BoundsBase = (function () {
    function BoundsBase() {
    }
    return BoundsBase;
}());
exports.BoundsBase = BoundsBase;
var MarkerBase = (function () {
    function MarkerBase() {
    }
    return MarkerBase;
}());
exports.MarkerBase = MarkerBase;
var ShapeBase = (function () {
    function ShapeBase() {
    }
    return ShapeBase;
}());
exports.ShapeBase = ShapeBase;
var PolylineBase = (function (_super) {
    __extends(PolylineBase, _super);
    function PolylineBase() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.shape = 'polyline';
        return _this;
    }
    PolylineBase.prototype.addPoint = function (point) {
        this._points.push(point);
        this.reloadPoints();
    };
    PolylineBase.prototype.addPoints = function (points) {
        this._points = this._points.concat(points);
        this.reloadPoints();
    };
    PolylineBase.prototype.removePoint = function (point) {
        var index = this._points.indexOf(point);
        if (index > -1) {
            this._points.splice(index, 1);
            this.reloadPoints();
        }
    };
    PolylineBase.prototype.removeAllPoints = function () {
        this._points.length = 0;
        this.reloadPoints();
    };
    PolylineBase.prototype.getPoints = function () {
        return this._points.slice();
    };
    return PolylineBase;
}(ShapeBase));
exports.PolylineBase = PolylineBase;
var PolygonBase = (function (_super) {
    __extends(PolygonBase, _super);
    function PolygonBase() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.shape = 'polygon';
        return _this;
    }
    PolygonBase.prototype.addPoint = function (point) {
        this._points.push(point);
        this.reloadPoints();
    };
    PolygonBase.prototype.addPoints = function (points) {
        this._points = this._points.concat(points);
        this.reloadPoints();
    };
    PolygonBase.prototype.removePoint = function (point) {
        var index = this._points.indexOf(point);
        if (index > -1) {
            this._points.splice(index, 1);
            this.reloadPoints();
        }
    };
    PolygonBase.prototype.removeAllPoints = function () {
        this._points.length = 0;
        this.reloadPoints();
    };
    PolygonBase.prototype.getPoints = function () {
        return this._points.slice();
    };
    PolygonBase.prototype.addHole = function (hole) {
        this._holes.push(hole);
        this.reloadHoles();
    };
    PolygonBase.prototype.addHoles = function (holes) {
        this._holes = this._holes.concat(holes);
        this.reloadHoles();
    };
    PolygonBase.prototype.removeHole = function (hole) {
        var index = this._holes.indexOf(hole);
        if (index > -1) {
            this._holes.splice(index, 1);
            this.reloadHoles();
        }
    };
    PolygonBase.prototype.removeAllHoles = function () {
        this._holes.length = 0;
        this.reloadHoles();
    };
    PolygonBase.prototype.getHoles = function () {
        return this._holes.slice();
    };
    return PolygonBase;
}(ShapeBase));
exports.PolygonBase = PolygonBase;
var CircleBase = (function (_super) {
    __extends(CircleBase, _super);
    function CircleBase() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.shape = 'circle';
        return _this;
    }
    return CircleBase;
}(ShapeBase));
exports.CircleBase = CircleBase;
