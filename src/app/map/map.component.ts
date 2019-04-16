import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import { registerElement } from 'nativescript-angular/element-registry';
import * as app from "tns-core-modules/application";
import { MapboxViewApi, MapboxView, latitudeProperty, longitudeProperty } from "nativescript-mapbox";
import { error } from "tns-core-modules/trace/trace";
import { Page } from "tns-core-modules/ui/page";
import {Label} from "tns-core-modules/ui/label";
registerElement("Mapbox", () => MapboxView);
registerElement("MapView", () => require("nativescript-google-maps-sdk").MapView);
import {isIOS, isAndroid} from "tns-core-modules/platform";
import { MapboxMarker } from "nativescript-mapbox";
import * as mapsModule from "nativescript-google-maps-sdk";

@Component({
    selector: "Map",
    moduleId: module.id,
    templateUrl: "./map.component.html",
    template: `
    <GridLayout>
        <MapView (mapReady)="onMapReady($event)"></MapView>
    </GridLayout>
    `
})

export class MapComponent implements OnInit {
    @ViewChild("MapView") mapView: ElementRef;
    private map: MapboxViewApi;
    public latitude: number = 55.953251; // Edinburgh Lat/Long
    public longitude: number = -3.188267;
    private client_id = "1QWWA3GAGXBLY0P2DXBNDHZJSZ3EJITMODKAVZTI3P3PDTN2";
    private client_secret = "WXQMS5ZCI0W4FTYNS4AJSZM12GRSKHNCZPFH4NHHFLV0YY45";
    private shopQuery = "tesco,asda,sainsbury's"; 
    constructor(private page: Page) {
        // Use the component constructor to inject providers.

    }

    ngOnInit(): void {
        // Init your component properties here.

        // this.page.on('navigatingFrom', (data) => {

        //     this.map.destroy(); //used for android, stops app from crashing when navigating away from page
        // })
    

    }

     
    onDrawerButtonTap(): void {
        const sideDrawer = <RadSideDrawer>app.getRootView();
        sideDrawer.showDrawer();
    }
    @ViewChild('cards') cards: ElementRef;
    //on map load add marker on the location
    private userLat = "";
       private userLng = "";
       
    onMapReady(args): void{
        if(isIOS){

    
            // fetch('https://api.foursquare.com/v2/venues/'+ r.response.groups[0].items[i].venue.id + '?client_id=1QWWA3GAGXBLY0P2DXBNDHZJSZ3EJITMODKAVZTI3P3PDTN2&client_secret=WXQMS5ZCI0W4FTYNS4AJSZM12GRSKHNCZPFH4NHHFLV0YY45&v=20180323')
        
        fetch('https://api.foursquare.com/v2/venues/explore?client_id=' + this.client_id + '&client_secret='+ this.client_secret + '&v=20180323&limit=40&ll=55.953251,-3.188267&query=' + this.shopQuery)
        .then((response) => response.json())
        .then((r) => {
            //console.log(r.response.groups[0].items[0].venue.name);
            for(let i = 0; i < 40; i++){
                if( (r.response.groups[0].items[i].venue.name).toString().includes("Tesco")){
                    args.map.addMarkers([
                        {
                          lat: r.response.groups[0].items[i].venue.location.lat,
                          lng: r.response.groups[0].items[i].venue.location.lng,
                          title: r.response.groups[0].items[i].venue.name,
                          subtitle: r.response.groups[0].items[i].venue.location.address,
                          iconPath: 'app/images/blue.png',
                        }]
                      );
                }else if( (r.response.groups[0].items[i].venue.name).toString().includes("Asda")){
                    args.map.addMarkers([
                        {
                          lat: r.response.groups[0].items[i].venue.location.lat,
                          lng: r.response.groups[0].items[i].venue.location.lng,
                          title: r.response.groups[0].items[i].venue.name,
                          subtitle: r.response.groups[0].items[i].venue.location.address,
                          iconPath: 'app/images/green.png',
                        }]
                      );
                }else if( (r.response.groups[0].items[i].venue.name).toString().includes("Sainsbury's")){
                    args.map.addMarkers([
                        {
                          lat: r.response.groups[0].items[i].venue.location.lat,
                          lng: r.response.groups[0].items[i].venue.location.lng,
                          title: r.response.groups[0].items[i].venue.name,
                          subtitle: r.response.groups[0].items[i].venue.location.address,
                          iconPath: 'app/images/yellow.png',
                        }]
                      );
                }
               
                 
            }
           
        }).catch((err) => {
        });

        
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
    }else if (isAndroid){
        var mapView = args.object;

        console.log("Setting a marker...");
        var marker = new mapsModule.Marker();
        marker.position = mapsModule.Position.positionFromLatLng(-33.86, 151.20);
        marker.title = "Sydney";
        marker.snippet = "Australia";
        marker.userData = { index : 1};
        mapView.addMarker(marker);
        
        // Disabling zoom gestures
        mapView.settings.zoomGesturesEnabled = false;
    }
    function onMarkerSelect(args) {
        console.log("Clicked on " +args.marker.title);
     }
     
     function onCameraChanged(args) {
         console.log("Camera changed: " + JSON.stringify(args.camera)); 
     }
     
     function onCameraMove(args) {
         console.log("Camera moving: "+JSON.stringify(args.camera));
     }
}


}