"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var element_registry_1 = require("nativescript-angular/element-registry");
var app = require("tns-core-modules/application");
var nativescript_mapbox_1 = require("nativescript-mapbox");
element_registry_1.registerElement("Mapbox", function () { return nativescript_mapbox_1.MapboxView; });
var MapComponent = /** @class */ (function () {
    function MapComponent() {
        // Use the component constructor to inject providers.
        this.latitude = 37.33233141;
        this.longitude = -122.0312186;
    }
    MapComponent.prototype.ngOnInit = function () {
        // Init your component properties here.
    };
    MapComponent.prototype.onDrawerButtonTap = function () {
        var sideDrawer = app.getRootView();
        sideDrawer.showDrawer();
    };
    //on map load add marker on the location
    MapComponent.prototype.onMapReady = function (args) {
        this.map = args.map;
        console.log("Map Ready");
        this.map.getUserLocation().then(function (userLocation) {
            console.log(userLocation.location.lat + ", " + userLocation.location.lng);
        }), function (error) {
            console.error(error);
        };
    };
    MapComponent = __decorate([
        core_1.Component({
            selector: "Map",
            moduleId: module.id,
            templateUrl: "./map.component.html",
        }),
        __metadata("design:paramtypes", [])
    ], MapComponent);
    return MapComponent;
}());
exports.MapComponent = MapComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFwLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm1hcC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBeUU7QUFFekUsMEVBQXdFO0FBQ3hFLGtEQUFvRDtBQUNwRCwyREFBZ0U7QUFHaEUsa0NBQWUsQ0FBQyxRQUFRLEVBQUUsY0FBTSxPQUFBLGdDQUFVLEVBQVYsQ0FBVSxDQUFDLENBQUM7QUFRNUM7SUFNSTtRQUNJLHFEQUFxRDtRQUp6RCxhQUFRLEdBQVcsV0FBVyxDQUFDO1FBQy9CLGNBQVMsR0FBVyxDQUFDLFdBQVcsQ0FBQztJQUtqQyxDQUFDO0lBRUQsK0JBQVEsR0FBUjtRQUNJLHVDQUF1QztJQUMzQyxDQUFDO0lBRUQsd0NBQWlCLEdBQWpCO1FBQ0ksSUFBTSxVQUFVLEdBQWtCLEdBQUcsQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUNwRCxVQUFVLENBQUMsVUFBVSxFQUFFLENBQUM7SUFDNUIsQ0FBQztJQUVELHdDQUF3QztJQUN4QyxpQ0FBVSxHQUFWLFVBQVcsSUFBSTtRQUVYLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQztRQUNwQixPQUFPLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBRXpCLElBQUksQ0FBQyxHQUFHLENBQUMsZUFBZSxFQUFFLENBQUMsSUFBSSxDQUMzQixVQUFTLFlBQVk7WUFDakIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLEdBQUcsR0FBRyxJQUFJLEdBQUcsWUFBWSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUM5RSxDQUFDLENBQ0osRUFBRSxVQUFTLEtBQUs7WUFDYixPQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3pCLENBQUMsQ0FBQTtJQUNMLENBQUM7SUFqQ1EsWUFBWTtRQU54QixnQkFBUyxDQUFDO1lBQ1AsUUFBUSxFQUFFLEtBQUs7WUFDZixRQUFRLEVBQUUsTUFBTSxDQUFDLEVBQUU7WUFDbkIsV0FBVyxFQUFFLHNCQUFzQjtTQUN0QyxDQUFDOztPQUVXLFlBQVksQ0F1Q3hCO0lBQUQsbUJBQUM7Q0FBQSxBQXZDRCxJQXVDQztBQXZDWSxvQ0FBWSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0LCBWaWV3Q2hpbGQsIEVsZW1lbnRSZWYgfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xuaW1wb3J0IHsgUmFkU2lkZURyYXdlciB9IGZyb20gXCJuYXRpdmVzY3JpcHQtdWktc2lkZWRyYXdlclwiO1xuaW1wb3J0IHsgcmVnaXN0ZXJFbGVtZW50IH0gZnJvbSAnbmF0aXZlc2NyaXB0LWFuZ3VsYXIvZWxlbWVudC1yZWdpc3RyeSc7XG5pbXBvcnQgKiBhcyBhcHAgZnJvbSBcInRucy1jb3JlLW1vZHVsZXMvYXBwbGljYXRpb25cIjtcbmltcG9ydCB7IE1hcGJveFZpZXdBcGksIE1hcGJveFZpZXcgfSBmcm9tIFwibmF0aXZlc2NyaXB0LW1hcGJveFwiO1xuaW1wb3J0IHsgZXJyb3IgfSBmcm9tIFwidG5zLWNvcmUtbW9kdWxlcy90cmFjZS90cmFjZVwiO1xuXG5yZWdpc3RlckVsZW1lbnQoXCJNYXBib3hcIiwgKCkgPT4gTWFwYm94Vmlldyk7XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiBcIk1hcFwiLFxuICAgIG1vZHVsZUlkOiBtb2R1bGUuaWQsXG4gICAgdGVtcGxhdGVVcmw6IFwiLi9tYXAuY29tcG9uZW50Lmh0bWxcIixcbn0pXG5cbmV4cG9ydCBjbGFzcyBNYXBDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuXG4gICAgcHJpdmF0ZSBtYXA6IE1hcGJveFZpZXdBcGk7XG4gICAgbGF0aXR1ZGU6IG51bWJlciA9IDM3LjMzMjMzMTQxO1xuICAgIGxvbmdpdHVkZTogbnVtYmVyID0gLTEyMi4wMzEyMTg2O1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIC8vIFVzZSB0aGUgY29tcG9uZW50IGNvbnN0cnVjdG9yIHRvIGluamVjdCBwcm92aWRlcnMuXG5cbiAgICB9XG5cbiAgICBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICAgICAgLy8gSW5pdCB5b3VyIGNvbXBvbmVudCBwcm9wZXJ0aWVzIGhlcmUuXG4gICAgfVxuXG4gICAgb25EcmF3ZXJCdXR0b25UYXAoKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IHNpZGVEcmF3ZXIgPSA8UmFkU2lkZURyYXdlcj5hcHAuZ2V0Um9vdFZpZXcoKTtcbiAgICAgICAgc2lkZURyYXdlci5zaG93RHJhd2VyKCk7XG4gICAgfVxuXG4gICAgLy9vbiBtYXAgbG9hZCBhZGQgbWFya2VyIG9uIHRoZSBsb2NhdGlvblxuICAgIG9uTWFwUmVhZHkoYXJncyk6IHZvaWR7XG5cbiAgICAgICAgdGhpcy5tYXAgPSBhcmdzLm1hcDtcbiAgICAgICAgY29uc29sZS5sb2coXCJNYXAgUmVhZHlcIik7XG5cbiAgICAgICAgdGhpcy5tYXAuZ2V0VXNlckxvY2F0aW9uKCkudGhlbihcbiAgICAgICAgICAgIGZ1bmN0aW9uKHVzZXJMb2NhdGlvbil7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2codXNlckxvY2F0aW9uLmxvY2F0aW9uLmxhdCArIFwiLCBcIiArIHVzZXJMb2NhdGlvbi5sb2NhdGlvbi5sbmcpO1xuICAgICAgICAgICAgfVxuICAgICAgICApLCBmdW5jdGlvbihlcnJvcikge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnJvcik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKlxuICAgIG9uQ2FtZXJhTW92ZShhcmdzKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiQ2FtZXJhIG1vdmluZzogXCIgKyBKU09OLnN0cmluZ2lmeShhcmdzLmNhbWVyYSkpO1xuICAgIH0qL1xufVxuIl19