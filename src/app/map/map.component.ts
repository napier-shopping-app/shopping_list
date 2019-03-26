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
    public latitude: number = 55.953251; // Edinburgh Lat/Long
    public longitude: number = -3.188267;
    private client_id = "1QWWA3GAGXBLY0P2DXBNDHZJSZ3EJITMODKAVZTI3P3PDTN2";
    private client_secret = "WXQMS5ZCI0W4FTYNS4AJSZM12GRSKHNCZPFH4NHHFLV0YY45";
    private shopQuery = "tesco,asda"; 
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
    private userLat = "";
       private userLng = "";
    onMapReady(args): void{
        this.map.getUserLocation().then(
            function(userLocation){
               this.userlat =  userLocation.location.lat; 
               this.userlng = userLocation.location.lng;
            }
        )
            
        
         
        fetch('https://api.foursquare.com/v2/venues/explore?client_id=' + this.client_id + '&client_secret='+ this.client_secret + '&v=20180323&limit=25&ll='+this.userLat + ','+this.userLng +'&query=' + this.shopQuery)
        .then((response) => response.json())
        .then((r) => {
            //console.log(r.response.groups[0].items[0].venue.name);
            for(let i = 0; i < 25; i++){
                args.map.addMarkers([
                    {
                      lat: r.response.groups[0].items[i].venue.location.lat,
                      lng: r.response.groups[0].items[i].venue.location.lng,
                      title: r.response.groups[0].items[i].venue.name,
                      subtitle: ''
                    }]
                  );
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
    }

}