import { Component, OnInit, ChangeDetectionStrategy, ViewChild, ElementRef } from "@angular/core";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import * as app from "tns-core-modules/application";
import * as localstorage from "nativescript-localstorage";
import { RouterExtensions } from "nativescript-angular/router";

let categories = ["Fresh Food", "Frozen Food", "Dry Goods", "Dairy Products"];
//let values = ["Cheese", "Potatoes", "Bread", "Coffee", "Milk", "Water", "Tea"];


@Component({
    selector: "List",
    moduleId: module.id,
    templateUrl: "./list.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class ListComponent implements OnInit {
    @ViewChild('listTitle') listTitle: ElementRef;
    public list: Array<Lists>;
    public items = [];
    public tempItems = [];
    private _activatedUrl: string;
    constructor(private routerExtensions: RouterExtensions) {
       
        // Use the component constructor to inject providers.
        this.list = [];

       

    }

    ngOnInit(): void {
        this.listTitle.nativeElement.text = localstorage.getItem("selectedList");
        // Init your component properties here.
        this.items = JSON.parse(localstorage.getItem(localStorage.getItem("selectedList")));

        for (let i = 0; i < (this.items.length); i++) {
            this.list.push(new Lists(this.items[i]));
        
        }
        
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
