import { Component, OnInit, ChangeDetectionStrategy, ViewChild, ElementRef} from "@angular/core";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import * as app from "tns-core-modules/application";
import { ActionItems } from "tns-core-modules/ui/action-bar/action-bar";
import { EventData, backgroundImageProperty } from "tns-core-modules/ui/page/page";
import { registerElement } from 'nativescript-angular/element-registry';
import { NavigationEnd, Router } from "@angular/router";
import { RouterExtensions } from "nativescript-angular/router";
import { Button } from "tns-core-modules/ui/button";
import {StackLayout} from "ui/layouts/stack-layout";
import * as localstorage from "nativescript-localstorage";


registerElement('Fab', () => require('nativescript-floatingactionbutton').Fab);

@Component({
    selector: "Home",
    moduleId: module.id,
    templateUrl: "./home.component.html",
})

export class HomeComponent implements OnInit {
    @ViewChild('stackLay') stackLay: ElementRef;
    private _activatedUrl: string;
    public title = "";
    public listColor = "";
    public shops = [];
    public newShops = [];
    public latitude: number = 55.953251; // Edinburgh Lat/Long
    public longitude: number = -3.188267;

    constructor(private router: Router, private routerExtensions: RouterExtensions) {
        // Use the component constructor to inject services.
       

    fetch('https://api.foursquare.com/v2/venues/explore?client_id=1QWWA3GAGXBLY0P2DXBNDHZJSZ3EJITMODKAVZTI3P3PDTN2&client_secret=WXQMS5ZCI0W4FTYNS4AJSZM12GRSKHNCZPFH4NHHFLV0YY45&v=20180323&limit=1&ll=55.953251,-3.188267&query=coffee')
    .then((response) => response.json())
    .then((r) => {
      console.log(r);
    }).catch((err) => {
    });


    }
    ngAfterViewInit() {
        this.shops = JSON.parse(localstorage.getItem("Shops"));
        
        localstorage.removeItem("selectedList")
        if(this.shops.length != 0){
            for (let i = 0; i < (this.shops.length); i++) {
                this.newShops = this.shops[i].split("|")
                console.log(this.shops[i]);
                let myButton = new Button();
                        
                myButton.text = this.newShops[0];
                myButton.width = 240;
                myButton.height = 240; 
                
                myButton.backgroundColor = this.newShops[1]; 
                this.stackLay.nativeElement.addChild(myButton);
                myButton.on("tap", function(args: EventData) {
                    let button = <Button>args.object;
                    button.borderWidth = 2;
                    button.borderColor = "black";
                    
                    
                    localstorage.setItem("selectedList", button.text)
                })
              } 
              
             
        }

        console.log(this.newShops.length);
        console.log(this.shops.length);
       
       
       
    }
    viewList(args:EventData){
        
        this.routerExtensions.navigate(["/list"], { clearHistory: true });
    }
    ngOnInit(): void {
        // Init your component properties here.

    }

    onDrawerButtonTap(): void {
        const sideDrawer = <RadSideDrawer>app.getRootView();
        sideDrawer.showDrawer();
    }
    onNavItemTap(navItemRoute: string): void {
        this.routerExtensions.navigate([navItemRoute], {
            transition: {
                name: "fade"
            }
        });

        const sideDrawer = <RadSideDrawer>app.getRootView();
        sideDrawer.closeDrawer();
    }
    isComponentSelected(url: string): boolean {

        return this._activatedUrl === url;
    }
}

