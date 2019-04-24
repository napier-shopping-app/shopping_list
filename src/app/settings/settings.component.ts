import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import * as app from "tns-core-modules/application";
import { Switch } from "tns-core-modules/ui/switch";
import { Page, Observable, eachDescendant } from "tns-core-modules/ui/page";
import * as localStorage from "nativescript-localstorage";
import * as firebase from "nativescript-plugin-firebase";
import { User } from "../shared/user.model";


let tempListName = ["Account Type", "Radius", "Account Provider"];
let tempListValue = [];

@Component({
    selector: "Settings",
    moduleId: module.id,
    templateUrl: "./settings.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})


export class SettingsComponent implements OnInit {

    public user;
    public username;
    public memberType;
    public uid;
    public userIcon;
    public settings: Array<Settings>;
    public tempUser: User;
    public data = [];
    public nameList = [];
    //public tempListValue;
    //public tempListName

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

        this.userIcon = this.user.profileImageURL;
        this.username = this.user.name;
        this.uid = this.user.uid;
    }

    loadSettings(): void {

        //tempListName = [];
        //tempListValue = [];

        var onValueEvent = function(result) {

            localStorage.setItemObject("preferences", result.value);
            //console.log(result.value.radius);
        }

        firebase.addValueEventListener(onValueEvent, "/users/" + this.user.uid + '/preferences')
            .then(
                () => {
                    console.log("Event Listener Added");
                },
                (error) => {
                    console.error("Event Listener Error: " + error);
                });


        var preferenceArray = localStorage.getItem("preferences");

        for(var row in preferenceArray){

            tempListValue.push(preferenceArray[row]);
        }

        tempListValue.push(this.user.providers[0].id);

        for(let i = 0; i < tempListName.length; i++){

            this.data.push({ name: tempListName[i], value: tempListValue[i]});
            //console.log(tempListName[i], tempListValue[i]);
        }
    }

    onDrawerButtonTap(): void {
        const sideDrawer = <RadSideDrawer>app.getRootView();
        sideDrawer.showDrawer();
    }

    onItemTap(args) {

        const i = args.index;
        console.log(this.data[i].value);
    }
}

class Settings {

    constructor(public labels: string, public values: string) {


    }
}
