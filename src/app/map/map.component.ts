import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import { registerElement } from 'nativescript-angular/element-registry';
import * as app from "tns-core-modules/application";
import { MapboxViewApi, MapboxView } from "nativescript-mapbox";
import { error } from "tns-core-modules/trace/trace";

registerElement("Mapbox", () => MapboxView);

@Component({
    selector: "Map",
    moduleId: module.id,
    templateUrl: "./map.component.html",
})

export class MapComponent implements OnInit {

    private map: MapboxViewApi;
    latitude: number = 55.933205;
    longitude: number = -3.213681;

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
    onMapReady(args): void{

        this.map = args.map;
        console.log("Map Ready");

        this.map.getUserLocation().then(
            function(userLocation){
                console.log(userLocation.location.lat + ", " + userLocation.location.lng);
            }
        ), function(error) {
            console.error(error);
        }

        this.map.trackUser({
            mode: "FOLLOW",
            animated: true
        });
    }

    /*
    onCameraMove(args) {
        console.log("Camera moving: " + JSON.stringify(args.camera));
    }*/
}