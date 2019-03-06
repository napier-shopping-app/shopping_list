import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import * as app from "tns-core-modules/application";
import { Switch } from "tns-core-modules/ui/switch";
import { Page, Observable } from "tns-core-modules/ui/page";


let labels = ["Account", "Membership Type", "Shared with:", "Map Radius"];
let values = ["email@test.com", "Premium", "N/A", "0.5km"];

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

    onItemTap(args) {

        const settingIndex = args.index;
        console.log(settingIndex);
    }
}

class Settings {

    constructor(public labels: string, public values: string) {


    }
}
