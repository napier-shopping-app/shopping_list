import { Component, OnInit, ChangeDetectionStrategy, ViewChild, ElementRef } from "@angular/core";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import * as app from "tns-core-modules/application";
import * as localstorage from "nativescript-localstorage";
import { RouterExtensions } from "nativescript-angular/router";
import { ObservableArray } from "tns-core-modules/data/observable-array";
import { Observable } from "tns-core-modules/data/observable";
import { Item } from "../shared/item.model";

@Component({
    selector: "List",
    moduleId: module.id,
    templateUrl: "./list.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class ListComponent implements OnInit{
    @ViewChild('listTitle') listTitle: ElementRef;
    public list: Array<Lists>;
    public items = [];
    public tempItems = [];
    private _activatedUrl: string;

    constructor(private routerExtensions: RouterExtensions) {

    }

    ngOnInit(): void {
        
        
    }

    onDrawerButtonTap(): void {
        const sideDrawer = <RadSideDrawer>app.getRootView();
        sideDrawer.showDrawer();
    }

    selectItem(args) {

        var elem = args.object;

        if(elem.style.textDecoration == "line-through"){

            elem.style.textDecoration = "none";
        }
        else{

            elem.style.textDecoration = "line-through";
            elem.style.textDecorationColor = "red";
        }
    }
    addItem(){
        this.routerExtensions.navigate(["/addItem"], { clearHistory: true });
        console.log("teleporting")
    }
    

}

class Lists {

    constructor(public values: string) {

    }

} 
