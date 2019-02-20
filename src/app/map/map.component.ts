import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import { registerElement } from 'nativescript-angular/element-registry';
import * as app from "tns-core-modules/application";
import { MapboxViewApi, MapboxView, latitudeProperty, longitudeProperty } from "nativescript-mapbox";
import { error } from "tns-core-modules/trace/trace";
import { Page } from "tns-core-modules/ui/page";

registerElement("Mapbox", () => MapboxView);


@Component({
    selector: "Map",
    moduleId: module.id,
    templateUrl: "./map.component.html",
})

export class MapComponent implements OnInit {

    private map: MapboxViewApi;
    public latitude: number = 56.060442;
    public longitude: number = -3.424992;

    constructor(private page: Page) {
        // Use the component constructor to inject providers.

    }

    ngOnInit(): void {
        // Init your component properties here.

        this.page.on('navigatingFrom', (data) => {

            this.map.destroy(); //used for android, stops app from crashing when navigating away from page
        })

    }

    onDrawerButtonTap(): void {
        const sideDrawer = <RadSideDrawer>app.getRootView();
        sideDrawer.showDrawer();
    }

    //on map load add marker on the location
    onMapReady(args): void{

        this.map = args.map;
        console.log("Map Ready");

        this.map.trackUser({
            mode: "FOLLOW",
            animated:true
        })

        this.map.setZoomLevel(
            {
              level: 15, // mandatory, 0-20
              animated: false // default true
            }
        )
    }

}