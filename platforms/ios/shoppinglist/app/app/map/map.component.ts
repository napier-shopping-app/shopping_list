import { Component, OnInit, ViewChild } from "@angular/core";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import { registerElement } from 'nativescript-angular/element-registry';
import * as map from 'nativescript-google-maps-sdk';
import * as app from "tns-core-modules/application";

registerElement('MapView', () => map.MapView);

var style = require('./style.json');


@Component({
    selector: "Map",
    moduleId: module.id,
    templateUrl: "./map.component.html",
    styleUrls: ['/map.css'],
})
export class MapComponent implements OnInit {

    latitude = 56.06;       // temp lat and lng values to be overwritten with location data
    longitude = -3.424;     //
    zoom = 5; //initial zoom value
    minZoom = 0;
    maxZoom = 22;
    bearing = 0;
    tilt = 0;
    padding = [40,40,40,40];
    mapView: map.MapView;

    lastCamera: String;

    constructor() {
        // Use the component constructor to inject providers.
    }

    ngOnInit(): void {
        // Init your component properties here.
    }

    onDrawerButtonTap(): void {
        const sideDrawer = <RadSideDrawer>app.getRootView();
        sideDrawer.showDrawer();
    }

    //on map load add marker on the location
    onMapReady(event){

        
        this.mapView = event.object;

        this.mapView.setStyle(style);
        this.mapView.settings.myLocationButtonEnabled = true;
        this.mapView.settings.zoomGesturesEnabled = true;
        this.mapView.myLocationEnabled = true;

        var userMarker = new map.Marker();
        userMarker.position = map.Position.positionFromLatLng(this.latitude, this.longitude);
        userMarker.userData = {index: 1};
        this.mapView.addMarker(userMarker);

        
    }

    onCameraMove(args) {
        console.log("Camera moving: " + JSON.stringify(args.camera));
    }
}
