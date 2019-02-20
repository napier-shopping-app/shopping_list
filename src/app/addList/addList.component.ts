import { Component, OnInit } from "@angular/core";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import * as app from "tns-core-modules/application";
import * as view from "ui/core/view";
import { ObservableArray, ChangedData } from "tns-core-modules/data/observable-array";
import { Validators } from "@angular/forms";
import { Page } from "tns-core-modules/ui/page";


@Component({
    selector: "AddList",
    moduleId: module.id,
    templateUrl: "./addList.component.html"
})

export class AddListComponent implements OnInit {

    constructor() {
        // Use the component constructor to inject providers.
    }

    ngOnInit(): void {
        // Init your component properties here.
    }

    onDrawerButtonTap(): void {
        const sideDrawer = <RadSideDrawer>app.getRootView();
        sideDrawer.showDrawer();
    }
    list = new ObservableArray(2);
    title = "";
    listColor = "";
    
    color(args){
        var button = args.object;
        alert(button.id + " has been selected!");
        this.listColor = button.id; 
    }

    save() {
       
       alert("The list: " + this.title + " with color: " + this.listColor + " has been created!");
       const tempList = [this.title, this.listColor];
       this.list = new ObservableArray(tempList);
     
    }
    
}

