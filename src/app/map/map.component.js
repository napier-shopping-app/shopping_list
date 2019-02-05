"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var element_registry_1 = require("nativescript-angular/element-registry");
var map = require("nativescript-google-maps-sdk");
var app = require("tns-core-modules/application");
element_registry_1.registerElement('MapView', function () { return map.MapView; });
var style = require('./style.json');
var MapComponent = /** @class */ (function () {
    function MapComponent() {
        this.latitude = 56.06; // temp lat and lng values to be overwritten with location data
        this.longitude = -3.424; //
        this.zoom = 5; //initial zoom value
        this.minZoom = 0;
        this.maxZoom = 22;
        this.bearing = 0;
        this.tilt = 0;
        this.padding = [40, 40, 40, 40];
        // Use the component constructor to inject providers.
    }
    MapComponent.prototype.ngOnInit = function () {
        // Init your component properties here.
    };
    MapComponent.prototype.onDrawerButtonTap = function () {
        var sideDrawer = app.getRootView();
        sideDrawer.showDrawer();
    };
    //on map load add marker on the location
    MapComponent.prototype.onMapReady = function (event) {
        this.mapView = event.object;
        this.mapView.setStyle(style);
        this.mapView.settings.myLocationButtonEnabled = true;
        this.mapView.settings.zoomGesturesEnabled = true;
        this.mapView.myLocationEnabled = true;
        var userMarker = new map.Marker();
        userMarker.position = map.Position.positionFromLatLng(this.latitude, this.longitude);
        userMarker.userData = { index: 1 };
        this.mapView.addMarker(userMarker);
    };
    MapComponent.prototype.onCameraMove = function (args) {
        console.log("Camera moving: " + JSON.stringify(args.camera));
    };
    MapComponent = __decorate([
        core_1.Component({
            selector: "Map",
            moduleId: module.id,
            templateUrl: "./map.component.html",
            styleUrls: ['/map.css'],
        }),
        __metadata("design:paramtypes", [])
    ], MapComponent);
    return MapComponent;
}());
exports.MapComponent = MapComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFwLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm1hcC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBNkQ7QUFFN0QsMEVBQXdFO0FBQ3hFLGtEQUFvRDtBQUNwRCxrREFBb0Q7QUFFcEQsa0NBQWUsQ0FBQyxTQUFTLEVBQUUsY0FBTSxPQUFBLEdBQUcsQ0FBQyxPQUFPLEVBQVgsQ0FBVyxDQUFDLENBQUM7QUFFOUMsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0FBU3BDO0lBY0k7UUFaQSxhQUFRLEdBQUcsS0FBSyxDQUFDLENBQU8sK0RBQStEO1FBQ3ZGLGNBQVMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFLLEVBQUU7UUFDMUIsU0FBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLG9CQUFvQjtRQUM5QixZQUFPLEdBQUcsQ0FBQyxDQUFDO1FBQ1osWUFBTyxHQUFHLEVBQUUsQ0FBQztRQUNiLFlBQU8sR0FBRyxDQUFDLENBQUM7UUFDWixTQUFJLEdBQUcsQ0FBQyxDQUFDO1FBQ1QsWUFBTyxHQUFHLENBQUMsRUFBRSxFQUFDLEVBQUUsRUFBQyxFQUFFLEVBQUMsRUFBRSxDQUFDLENBQUM7UUFNcEIscURBQXFEO0lBQ3pELENBQUM7SUFFRCwrQkFBUSxHQUFSO1FBQ0ksdUNBQXVDO0lBQzNDLENBQUM7SUFFRCx3Q0FBaUIsR0FBakI7UUFDSSxJQUFNLFVBQVUsR0FBa0IsR0FBRyxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBQ3BELFVBQVUsQ0FBQyxVQUFVLEVBQUUsQ0FBQztJQUM1QixDQUFDO0lBRUQsd0NBQXdDO0lBQ3hDLGlDQUFVLEdBQVYsVUFBVyxLQUFLO1FBR1osSUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDO1FBRTVCLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzdCLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLHVCQUF1QixHQUFHLElBQUksQ0FBQztRQUNyRCxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLENBQUM7UUFDakQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLENBQUM7UUFFdEMsSUFBSSxVQUFVLEdBQUcsSUFBSSxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDbEMsVUFBVSxDQUFDLFFBQVEsR0FBRyxHQUFHLENBQUMsUUFBUSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ3JGLFVBQVUsQ0FBQyxRQUFRLEdBQUcsRUFBQyxLQUFLLEVBQUUsQ0FBQyxFQUFDLENBQUM7UUFDakMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLENBQUM7SUFHdkMsQ0FBQztJQUVELG1DQUFZLEdBQVosVUFBYSxJQUFJO1FBQ2IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0lBQ2pFLENBQUM7SUFoRFEsWUFBWTtRQU54QixnQkFBUyxDQUFDO1lBQ1AsUUFBUSxFQUFFLEtBQUs7WUFDZixRQUFRLEVBQUUsTUFBTSxDQUFDLEVBQUU7WUFDbkIsV0FBVyxFQUFFLHNCQUFzQjtZQUNuQyxTQUFTLEVBQUUsQ0FBQyxVQUFVLENBQUM7U0FDMUIsQ0FBQzs7T0FDVyxZQUFZLENBaUR4QjtJQUFELG1CQUFDO0NBQUEsQUFqREQsSUFpREM7QUFqRFksb0NBQVkiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCwgVmlld0NoaWxkIH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcbmltcG9ydCB7IFJhZFNpZGVEcmF3ZXIgfSBmcm9tIFwibmF0aXZlc2NyaXB0LXVpLXNpZGVkcmF3ZXJcIjtcbmltcG9ydCB7IHJlZ2lzdGVyRWxlbWVudCB9IGZyb20gJ25hdGl2ZXNjcmlwdC1hbmd1bGFyL2VsZW1lbnQtcmVnaXN0cnknO1xuaW1wb3J0ICogYXMgbWFwIGZyb20gJ25hdGl2ZXNjcmlwdC1nb29nbGUtbWFwcy1zZGsnO1xuaW1wb3J0ICogYXMgYXBwIGZyb20gXCJ0bnMtY29yZS1tb2R1bGVzL2FwcGxpY2F0aW9uXCI7XG5cbnJlZ2lzdGVyRWxlbWVudCgnTWFwVmlldycsICgpID0+IG1hcC5NYXBWaWV3KTtcblxudmFyIHN0eWxlID0gcmVxdWlyZSgnLi9zdHlsZS5qc29uJyk7XG5cblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6IFwiTWFwXCIsXG4gICAgbW9kdWxlSWQ6IG1vZHVsZS5pZCxcbiAgICB0ZW1wbGF0ZVVybDogXCIuL21hcC5jb21wb25lbnQuaHRtbFwiLFxuICAgIHN0eWxlVXJsczogWycvbWFwLmNzcyddLFxufSlcbmV4cG9ydCBjbGFzcyBNYXBDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuXG4gICAgbGF0aXR1ZGUgPSA1Ni4wNjsgICAgICAgLy8gdGVtcCBsYXQgYW5kIGxuZyB2YWx1ZXMgdG8gYmUgb3ZlcndyaXR0ZW4gd2l0aCBsb2NhdGlvbiBkYXRhXG4gICAgbG9uZ2l0dWRlID0gLTMuNDI0OyAgICAgLy9cbiAgICB6b29tID0gNTsgLy9pbml0aWFsIHpvb20gdmFsdWVcbiAgICBtaW5ab29tID0gMDtcbiAgICBtYXhab29tID0gMjI7XG4gICAgYmVhcmluZyA9IDA7XG4gICAgdGlsdCA9IDA7XG4gICAgcGFkZGluZyA9IFs0MCw0MCw0MCw0MF07XG4gICAgbWFwVmlldzogbWFwLk1hcFZpZXc7XG5cbiAgICBsYXN0Q2FtZXJhOiBTdHJpbmc7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgLy8gVXNlIHRoZSBjb21wb25lbnQgY29uc3RydWN0b3IgdG8gaW5qZWN0IHByb3ZpZGVycy5cbiAgICB9XG5cbiAgICBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICAgICAgLy8gSW5pdCB5b3VyIGNvbXBvbmVudCBwcm9wZXJ0aWVzIGhlcmUuXG4gICAgfVxuXG4gICAgb25EcmF3ZXJCdXR0b25UYXAoKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IHNpZGVEcmF3ZXIgPSA8UmFkU2lkZURyYXdlcj5hcHAuZ2V0Um9vdFZpZXcoKTtcbiAgICAgICAgc2lkZURyYXdlci5zaG93RHJhd2VyKCk7XG4gICAgfVxuXG4gICAgLy9vbiBtYXAgbG9hZCBhZGQgbWFya2VyIG9uIHRoZSBsb2NhdGlvblxuICAgIG9uTWFwUmVhZHkoZXZlbnQpe1xuXG4gICAgICAgIFxuICAgICAgICB0aGlzLm1hcFZpZXcgPSBldmVudC5vYmplY3Q7XG5cbiAgICAgICAgdGhpcy5tYXBWaWV3LnNldFN0eWxlKHN0eWxlKTtcbiAgICAgICAgdGhpcy5tYXBWaWV3LnNldHRpbmdzLm15TG9jYXRpb25CdXR0b25FbmFibGVkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5tYXBWaWV3LnNldHRpbmdzLnpvb21HZXN0dXJlc0VuYWJsZWQgPSB0cnVlO1xuICAgICAgICB0aGlzLm1hcFZpZXcubXlMb2NhdGlvbkVuYWJsZWQgPSB0cnVlO1xuXG4gICAgICAgIHZhciB1c2VyTWFya2VyID0gbmV3IG1hcC5NYXJrZXIoKTtcbiAgICAgICAgdXNlck1hcmtlci5wb3NpdGlvbiA9IG1hcC5Qb3NpdGlvbi5wb3NpdGlvbkZyb21MYXRMbmcodGhpcy5sYXRpdHVkZSwgdGhpcy5sb25naXR1ZGUpO1xuICAgICAgICB1c2VyTWFya2VyLnVzZXJEYXRhID0ge2luZGV4OiAxfTtcbiAgICAgICAgdGhpcy5tYXBWaWV3LmFkZE1hcmtlcih1c2VyTWFya2VyKTtcblxuICAgICAgICBcbiAgICB9XG5cbiAgICBvbkNhbWVyYU1vdmUoYXJncykge1xuICAgICAgICBjb25zb2xlLmxvZyhcIkNhbWVyYSBtb3Zpbmc6IFwiICsgSlNPTi5zdHJpbmdpZnkoYXJncy5jYW1lcmEpKTtcbiAgICB9XG59XG4iXX0=