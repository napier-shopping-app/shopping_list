import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import * as app from "tns-core-modules/application";
import { Switch } from "tns-core-modules/ui/switch";
import { Page, Observable } from "tns-core-modules/ui/page";
import * as localStorage from "nativescript-localstorage";
import * as firebase from "nativescript-plugin-firebase";
import { User } from "../shared/user.model";


let labels = [];
let values = [];

@Component({
    selector: "Settings",
    moduleId: module.id,
    templateUrl: "./settings.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})


export class SettingsComponent implements OnInit {

    public user;
    public username = "";
    public memberType = "";
    public uid;
    public userIcon = "";
    public settings: Array<Settings>;
    public tempUser: User;

    //load the userinfo in the constructor
    constructor(private page: Page) {
        // Use the component constructor to inject providers.
       
    }

    ngOnInit(): void {
        // Init your component properties here.
        this.getUser();
        this.loadSettings();
    }

    getUser(): void {

        this.user = localStorage.getItem("user");
        this.userIcon = this.user.photoURL;
        this.username = this.user.displayName;

        console.log(this.user.photoURL);
        console.log(this.user.displayName);
    }

    loadSettings(): void {

        this.user
        
    }

    onDrawerButtonTap(): void {
        const sideDrawer = <RadSideDrawer>app.getRootView();
        sideDrawer.showDrawer();
    }

    onItemTap(args) {

        const settingIndex = args.index;
        //console.log(settingIndex);
    }
}

class Settings {

    constructor(public labels: string, public values: string) {


    }
}
