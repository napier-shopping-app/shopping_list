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

import { Data } from "../providers/data/data";

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
    

    constructor(private router: Router, private routerExtensions: RouterExtensions,private data: Data) {
        // Use the component constructor to inject services.
        this.shops = JSON.parse(localstorage.getItem("Shops"));
        var i;
       
        if(this.shops.length != 0){
            for (i = 0; i < this.shops.length; i++) {
                this.newShops = this.shops[i].split("|")
                console.log(this.shops[i]);
              } 
              
             
        }
    }
    ngAfterViewInit() {
        
        if(this.shops.length != 0 ){
            if (this.newShops.length > 2){
                for (let i = 0; i < (this.newShops.length-1); i+2) {
                    for(let j = 1; j < this.newShops.length; j+2){
                        let myButton = new Button();
                        
                        myButton.text = this.newShops[i];
                        myButton.backgroundColor = this.newShops[j]; 
                        this.stackLay.nativeElement.addChild(myButton);
                    }
                   
                  } 
            }else{
                let myButton = new Button();
                        
                        myButton.text = this.newShops[0];
                        myButton.backgroundColor = this.newShops[1]; 
                        this.stackLay.nativeElement.addChild(myButton);
            }
            
           
        }
       
       
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

