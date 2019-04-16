import { Component, OnInit, ChangeDetectionStrategy, ViewChild, ElementRef,ViewContainerRef } from "@angular/core";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import * as app from "tns-core-modules/application";
import { ActionItems } from "tns-core-modules/ui/action-bar/action-bar";
import { EventData, backgroundImageProperty } from "tns-core-modules/ui/page/page";
import { registerElement } from 'nativescript-angular/element-registry';
import { NavigationEnd, Router } from "@angular/router";
import { RouterExtensions } from "nativescript-angular/router";
import { Button } from "tns-core-modules/ui/button";
import {Label} from "tns-core-modules/ui/label";
import { StackLayout } from "ui/layouts/stack-layout";
import * as localstorage from "nativescript-localstorage";


registerElement('Fab', () => require('nativescript-floatingactionbutton').Fab);

@Component({
    selector: "Home",
    moduleId: module.id,
    templateUrl: "./home.component.html",
})

export class HomeComponent implements OnInit {
    @ViewChild('stackLay') stackLay: ElementRef;
    @ViewChild('test') test: ElementRef;
    private _activatedUrl: string;
    public title = "";
    public listColor = "";
    public shops = [];
    public newShops = [];
    public latitude: number = 55.953251; // Edinburgh Lat/Long
    public longitude: number = -3.188267;
    private client_id = "1QWWA3GAGXBLY0P2DXBNDHZJSZ3EJITMODKAVZTI3P3PDTN2";
    private client_secret = "WXQMS5ZCI0W4FTYNS4AJSZM12GRSKHNCZPFH4NHHFLV0YY45";
    private shopQuery = ""; 
    constructor(private router: Router, private routerExtensions: RouterExtensions) {
        // Use the component constructor to inject services.
      

        fetch('https://api.foursquare.com/v2/venues/explore?client_id=' + this.client_id + '&client_secret='+ this.client_secret + '&v=20180323&limit=5&ll=55.953251,-3.188267&query=' + this.shopQuery)
            .then((response) => response.json())
            .then((r) => {
                console.log(r.response.groups[0].items[0].venue.name);
            }).catch((err) => {
            });
    }
  
    ngAfterViewInit() {
        this.shops = JSON.parse(localstorage.getItem("Shops"));

        localstorage.removeItem("selectedList")
        if (this.shops.length != 0) {
            for (let i = 0; i < (this.shops.length); i++) {
                this.newShops = this.shops[i].split("|")
            
                let myButton = new Button();

                myButton.text = this.newShops[0];
                myButton.width = 140;
                myButton.height = 140;
                myButton.marginLeft = 10;
                myButton.marginTop = 3; 
                myButton.borderRadius = 7; 

                myButton.backgroundColor = this.newShops[1];
                this.stackLay.nativeElement.addChild(myButton);
                myButton.on("tap", function (args: EventData) {
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

    viewList(args: EventData) {

        this.routerExtensions.navigate(["/list"], { clearHistory: true });
    }
    addItem(args: EventData) {
        
        let a = new StackLayout();
        let t = new Label(); 
        let b = new Button(); 
       
        a.height = 100; 
        a.backgroundColor = "gray"; 
        b.text = "Button";

        t.text = "test";
        a.addChild(b);
        a.addChild(t); 

        this.test.nativeElement.addChild(a);
        //this.routerExtensions.navigate(["/list"], { clearHistory: true });
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

