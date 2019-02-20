import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import * as app from "tns-core-modules/application";

let categories = ["Fresh Food", "Frozen Food", "Dry Goods", "Dairy Products"];
let values = ["Cheese", "Potatoes", "Bread", "Coffee"];


@Component({
    selector: "List",
    moduleId: module.id,
    templateUrl: "./list.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class ListComponent implements OnInit {

    public list: Array<Lists>;

    constructor() {
        // Use the component constructor to inject providers.
        this.list = [];

        for (let i = 0; i < categories.length; i++) {

            this.list.push(new Lists(categories[i], values[i]));

        }

    }

    ngOnInit(): void {
        // Init your component properties here.
    }

    onDrawerButtonTap(): void {
        const sideDrawer = <RadSideDrawer>app.getRootView();
        sideDrawer.showDrawer();
    }

}

class Lists {

    constructor(public categories: string, public values: string) {

    }

} 
