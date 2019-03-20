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
    selector: "AddItem",
    moduleId: module.id,
    templateUrl: "./addItem.component.html"
})

export class AddItemComponent implements OnInit {
    private _activatedUrl: string;
    public itemList = [];
    public title: string; 
    constructor(private router: Router,private data: Data,private routerExtensions: RouterExtensions) {
        // Use the component constructor to inject providers.
        this.title = localStorage.getItem("selectedList")
        console.log(this.title);
        this.itemList = JSON.parse(localStorage.getItem(this.title));

    }

    ngOnInit(): void {
        // Init your component properties here.
    }

    onDrawerButtonTap(): void {
        const sideDrawer = <RadSideDrawer>app.getRootView();
        sideDrawer.showDrawer();
    }
    
    shoppingItem = "";
    listColor = "";

    
    save(): void {
       
       //alert("Added item: " + this.shoppingItem + " to " + this.title);
       this.itemList.push(this.shoppingItem);

       localStorage.setItem(this.title, JSON.stringify(this.itemList));
       this.routerExtensions.navigate(["/list"], { clearHistory: true });
       
   
}

}


