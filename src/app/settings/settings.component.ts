import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import * as app from "tns-core-modules/application";
import { Switch } from "tns-core-modules/ui/switch";
import { Page, Observable } from "tns-core-modules/ui/page";
import { ObservableArray, ChangedData } from "tns-core-modules/data/observable-array";

let labels = ["Email", "Membership Type", "Shared with:"];
let values = ["email@test.com", "Premium", "N/A"];

@Component({
    selector: "Settings",
    moduleId: module.id,
    templateUrl: "./settings.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})


export class SettingsComponent implements OnInit {

    public username = "";
    public memberType = "";
    public settings: Array<Settings>;
    

    //load the userinfo in the constructor
    constructor(private page: Page) {
        // Use the component constructor to inject providers.
        this.loadUserInfo();
        this.settings = [];

        for(let i = 0; i < labels.length; i ++){

            this.settings.push(new Settings(labels[i], values[i]));
        }

    }

    ngOnInit(): void {
        // Init your component properties here.
        this.page.on('navigatedTo', (data) => {
        })

    }

    loadUserInfo(): void{

        this.username = values[0];
        this.memberType = values[1];
    }

    onDrawerButtonTap(): void {
        const sideDrawer = <RadSideDrawer>app.getRootView();
        sideDrawer.showDrawer();
    }
}

class Settings {

    constructor(public labels: string, public values: string) {


    }
}
