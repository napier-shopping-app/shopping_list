import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import { registerElement } from 'nativescript-angular/element-registry';
import * as app from "tns-core-modules/application";
import { MapboxViewApi, MapboxView, latitudeProperty, longitudeProperty } from "nativescript-mapbox";

import { Page } from "tns-core-modules/ui/page";

registerElement("Mapbox", () => MapboxView);
registerElement("MapView", () => require("nativescript-google-maps-sdk").MapView);
import { isAndroid, isIOS, device, screen } from "tns-core-modules/platform";

import * as imageSource from "tns-core-modules/image-source";
import * as Geolocation from "nativescript-geolocation";

import { Image } from "tns-core-modules/ui/image";
import { MapboxMarker } from "nativescript-mapbox";
import { MapView, Position, Marker } from "nativescript-google-maps-sdk";
import * as localStorage from "nativescript-localstorage";

@Component({
    selector: "Map",
    moduleId: module.id,
    templateUrl: "./map.component.html",
})

export class MapComponent implements OnInit {

    private map: MapboxViewApi;
    public latitude: number = 55.953251; // Edinburgh Lat/Long
    public longitude: number = -3.188267;
    
    private client_id = "1QWWA3GAGXBLY0P2DXBNDHZJSZ3EJITMODKAVZTI3P3PDTN2";
    private client_secret = "WXQMS5ZCI0W4FTYNS4AJSZM12GRSKHNCZPFH4NHHFLV0YY45";
    private shopQuery = "tesco,asda,sainsbury's";
    private mapView: MapView;
    constructor(private page: Page) {
      
        // Use the component constructor to inject providers.

    }

    ngOnInit(): void {
        Geolocation.isEnabled().then(function (isEnabled) {
            if (!isEnabled) {
                Geolocation.enableLocationRequest().then(function () {
                }, function (e) {
                    console.log("Error: " + (e.message || e));
                });
            }else{
                let location = Geolocation.getCurrentLocation({desiredAccuracy: 3, updateDistance: 10, maximumAge: 20000, timeout: 20000}).
                then(function(loc) {
                    if (loc) {
                      
                        localStorage.setItem("latitude", loc.latitude);
                        localStorage.setItem("longitude", loc.longitude);
                    }
                }, function(e){
                    console.log("Error: " + e.message);
                });
            }
        }, function (e) {
            console.log("Error: " + (e.message || e));
        });
        console.log("Current location is: " + localStorage.getItem("latitude") + "/" + localStorage.getItem("longitude"));
        this.latitude = parseFloat(localStorage.getItem("latitude"));
        this.longitude =  parseFloat(localStorage.getItem("longitude"));
       
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

    onMapReady(args): void {
        console.log("testReady");
        if (isIOS) {
            this.mapView = args.object;
            this.mapView.latitude = this.latitude;
            this.mapView.longitude = this.longitude; 
            this.mapView.zoom = 15;
            
            var marker = new Marker();
            marker.position = Position.positionFromLatLng(this.latitude, this.longitude);
            marker.title = "Your location";

            marker.userData = { index: 1 };

            this.mapView.addMarker(marker);
            this.addMarker();
        } else if (isAndroid) {
            console.log("testAndroid");
            this.mapView = args.object;
            this.mapView.latitude = this.latitude;
            this.mapView.longitude = this.longitude; 
            this.mapView.zoom = 15;
            
            var marker = new Marker();
            marker.position = Position.positionFromLatLng(this.latitude, this.longitude);
            marker.title = "Your location";

            marker.userData = { index: 1 };

            this.mapView.addMarker(marker);
            this.addMarker();
            
        }


    }
    

    private addMarker(): void {
        if (isIOS) {
            console.log("Setting a marker...");
            fetch('https://api.foursquare.com/v2/venues/explore?client_id=' + this.client_id + '&client_secret=' + this.client_secret + '&v=20180323&limit=40&ll=55.953251,-3.188267&query=' + this.shopQuery)
                .then((response) => response.json())
                .then((r) => {
                    //console.log(r.response.groups[0].items[0].venue.name);
                    for (let i = 0; i < 40; i++) {
                        if ((r.response.groups[0].items[i].venue.name).toString().includes("Tesco")) {
                            var marker = new Marker();
                            marker.position = Position.positionFromLatLng(r.response.groups[0].items[i].venue.location.lat, r.response.groups[0].items[i].venue.location.lng);
                            marker.title = r.response.groups[0].items[i].venue.name;
                            marker.snippet = r.response.groups[0].items[i].venue.location.address;
                            marker.userData = { index: 1 };
                            marker.color = "blue";
                          
                            this.mapView.addMarker(marker);
    
                        } else if ((r.response.groups[0].items[i].venue.name).toString().includes("Asda")) {
                            var marker = new Marker();
                            marker.position = Position.positionFromLatLng(r.response.groups[0].items[i].venue.location.lat, r.response.groups[0].items[i].venue.location.lng);
                            marker.title = r.response.groups[0].items[i].venue.name;
                            marker.snippet = r.response.groups[0].items[i].venue.location.address;
                            marker.userData = { index: 1 };
                            marker.color = "green";
                        
                            this.mapView.addMarker(marker);
                        } else if ((r.response.groups[0].items[i].venue.name).toString().includes("Sainsbury's")) {
                            var marker = new Marker();
                            marker.position = Position.positionFromLatLng(r.response.groups[0].items[i].venue.location.lat, r.response.groups[0].items[i].venue.location.lng);
                            marker.title = r.response.groups[0].items[i].venue.name;
                            marker.snippet = r.response.groups[0].items[i].venue.location.address;
                            marker.userData = { index: 1 };
                            marker.color = "orange";
                           
                            this.mapView.addMarker(marker);
                        }
    
    
                    }
    
                }).catch((err) => {
                });
        }else{
            console.log("Setting a marker...");
            fetch('https://api.foursquare.com/v2/venues/explore?client_id=' + this.client_id + '&client_secret=' + this.client_secret + '&v=20180323&limit=40&ll=55.953251,-3.188267&query=' + this.shopQuery)
                .then((response) => response.json())
                .then((r) => {
                    //console.log(r.response.groups[0].items[0].venue.name);
                    for (let i = 0; i < 40; i++) {
                        if ((r.response.groups[0].items[i].venue.name).toString().includes("Tesco")) {
                            var marker = new Marker();
                            marker.position = Position.positionFromLatLng(r.response.groups[0].items[i].venue.location.lat, r.response.groups[0].items[i].venue.location.lng);
                            marker.title = r.response.groups[0].items[i].venue.name;
                            marker.snippet = r.response.groups[0].items[i].venue.location.address;
                            marker.userData = { index: 1 };
                            marker.color = "blue";
                            let icon = new Image();
                            icon.src = '~/app/images/blue2.png';
                            icon.imageSource = imageSource.fromFile('~/app/images/blue.png');
                            marker.icon = icon;
                            this.mapView.addMarker(marker);
    
                        } else if ((r.response.groups[0].items[i].venue.name).toString().includes("Asda")) {
                            var marker = new Marker();
                            marker.position = Position.positionFromLatLng(r.response.groups[0].items[i].venue.location.lat, r.response.groups[0].items[i].venue.location.lng);
                            marker.title = r.response.groups[0].items[i].venue.name;
                            marker.snippet = r.response.groups[0].items[i].venue.location.address;
                            marker.userData = { index: 1 };
                            marker.color = "green";
                            let icon = new Image();
                            icon.src = '~/app/images/green2.png';
                            icon.imageSource = imageSource.fromFile('~/app/images/green.png');
                            marker.icon = icon;
                            this.mapView.addMarker(marker);
                        } else if ((r.response.groups[0].items[i].venue.name).toString().includes("Sainsbury's")) {
                            var marker = new Marker();
                            marker.position = Position.positionFromLatLng(r.response.groups[0].items[i].venue.location.lat, r.response.groups[0].items[i].venue.location.lng);
                            marker.title = r.response.groups[0].items[i].venue.name;
                            marker.snippet = r.response.groups[0].items[i].venue.location.address;
                            marker.userData = { index: 1 };
                            marker.color = "orange";
                            let icon = new Image();
                            icon.src = '~/app/images/yellow2.png';
                            icon.imageSource = imageSource.fromFile('~/app/images/yellow.png');
                            marker.icon = icon;
                            this.mapView.addMarker(marker);
                        }
    
    
                    }
    
                }).catch((err) => {
                });
        }
        

    }

}