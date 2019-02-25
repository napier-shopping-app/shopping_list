import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import * as app from "tns-core-modules/application";
import { ActionItems } from "tns-core-modules/ui/action-bar/action-bar";
import { EventData, backgroundImageProperty } from "tns-core-modules/ui/page/page";
import { registerElement } from 'nativescript-angular/element-registry';
import { NavigationEnd, Router } from "@angular/router";
import { RouterExtensions } from "nativescript-angular/router";

import { Data } from "../providers/data/data";

registerElement('Fab', () => require('nativescript-floatingactionbutton').Fab);

@Component({
    selector: "Home",
    moduleId: module.id,
    templateUrl: "./home.component.html",
})

export class HomeComponent implements OnInit {
    private _activatedUrl: string;
    public title = "";
    public listColor = "";
    
    

    constructor(private router: Router, private routerExtensions: RouterExtensions,private data: Data) {
        // Use the component constructor to inject services.
        
        console.log(JSON.stringify(this.data.storage));
        if (typeof this.data.storage !== 'undefined'){
            this.title = this.data.storage.title;
            this.listColor = this.data.storage.listColor;
           
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

