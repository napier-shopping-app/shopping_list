import { Component, OnInit } from "@angular/core";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import * as app from "tns-core-modules/application";
import * as view from "tns-core-modules/ui/core/view";
import { ObservableArray, ChangedData } from "tns-core-modules/data/observable-array";
import { Validators } from "@angular/forms";
import { Page } from "tns-core-modules/ui/page";
import { Data } from "../providers/data/data";
import {Router, NavigationExtras} from "@angular/router";
import { RouterExtensions } from "nativescript-angular/router";
import * as localStorage from "nativescript-localstorage";

@Component({
    selector: "AddList",
    moduleId: module.id,
    templateUrl: "./addList.component.html"
})

export class AddListComponent implements OnInit {
    private _activatedUrl: string;
    public shops = [];
    constructor(private router: Router,private data: Data,private routerExtensions: RouterExtensions) {
        // Use the component constructor to inject providers.
        this.shops = JSON.parse(localStorage.getItem("Shops"));

    }

    ngOnInit(): void {
        // Init your component properties here.
    }

    onDrawerButtonTap(): void {
        const sideDrawer = <RadSideDrawer>app.getRootView();
        sideDrawer.showDrawer();
    }
    
    title = "";
    listColor = "";
    items = [];
    
    color(args){
        var button = args.object;
        alert(button.id + " has been selected!");
        this.listColor = button.id; 
    }

    save(): void {
       
       //alert("The list: " + this.title + " with color: " + this.listColor + " has been created!");
      
       this.shops.push(this.title + "|" + this.listColor);
       localStorage.setItem("Shops", JSON.stringify(this.shops));
       localStorage.setItem(this.title, JSON.stringify(this.items));
       this.routerExtensions.navigate(["/home"], { clearHistory: true });
   
}

}


