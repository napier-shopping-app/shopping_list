import { Component, OnInit, ChangeDetectionStrategy, ViewChild, ElementRef, ViewContainerRef } from "@angular/core";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import * as app from "tns-core-modules/application";
import { registerElement } from 'nativescript-angular/element-registry';
import { Router } from "@angular/router";
import { RouterExtensions } from "nativescript-angular/router";
import * as localStorage from "nativescript-localstorage";
import * as Geolocation from "nativescript-geolocation";
import * as firebase from "nativescript-plugin-firebase";
import { Item } from "../shared/item.model";


registerElement('Fab', () => require('nativescript-floatingactionbutton').Fab);

@Component({
    selector: "Home",
    moduleId: module.id,
    templateUrl: "./home.component.html",
})

export class HomeComponent implements OnInit {
    @ViewChild('stackLay') stackLay: ElementRef;
    @ViewChild('test') test: ElementRef;
    private _activatedUrl: string;

    public itemList = [];
    public tempList;
    public tempName: string;
    public user;
    public uID: string;

    constructor(private router: Router, private routerExtensions: RouterExtensions) {
        // Use the component constructor to inject services.
    }

    ngAfterViewInit() {

    }

    ngOnInit(): void {
        // Init your component properties here.
        //gets user current location and saves it to localstorage
        Geolocation.isEnabled().then(function (isEnabled) {
            if (!isEnabled) {
                Geolocation.enableLocationRequest().then(function () {
                }, function (e) {
                    console.log("Error: " + (e.message || e));
                });
            } else {
                let location = Geolocation.getCurrentLocation({ desiredAccuracy: 3, updateDistance: 10, maximumAge: 20000, timeout: 20000 }).
                    then(function (loc) {
                        if (loc) {
                            localStorage.setItem("latitude", String(loc.latitude));
                            localStorage.setItem("longitude", String(loc.longitude));
                        }
                    }, function (e) {
                        console.log("Error: " + e.message);
                    });
            }
        }, function (e) {
            console.log("Error: " + (e.message || e));
        });
        console.log("Current location is: " + localStorage.getItem("latitude") + "/" + localStorage.getItem("longitude"));

        this.user = localStorage.getItem("user");
        this.uID = this.user.uid;

        this.loadList();
    }

    //get list from firebase and load it to the listview
    loadList() {

        var onValueEvent = (result) => {

            this.tempList = [];


            for (var row in result.value) {

                var jsonObj = result.value[row];
                this.tempList.push(new Item(jsonObj.name, jsonObj.category, jsonObj.completed));
            }

            localStorage.setItemObject("listArray", this.tempList);
            this.itemList = [];

            for (let i = 0; i < this.tempList.length; i++) {

                this.itemList.push(this.tempList[i].itemName);
            }
        };

        // listen to changes in the /users/'uid' path
        firebase.addValueEventListener(onValueEvent, "/users/" + this.user.uid + '/grocery_list')
            .then(
                () => {
                    console.log("Event Listener Added");
                },
                (error) => {
                    console.error("Event Listener Error: " + error);
                });
    }



    onLongPress(event): void {

        console.log(event);
    }

    //toggles a strike-through and updates the database
    selectItem(args) {

        var elem = args.object;

        if (elem.style.textDecoration == "line-through") {

            elem.style.textDecoration = "none";
            firebase.update(
                '/users/' + this.user.uid + '/grocery_list/' + elem.text,
                {
                    completed: 0
                }
            )
            console.log(elem.text);
        }
        else {

            elem.style.textDecoration = "line-through";
            elem.style.fontAttributes = "Bold";
            firebase.update(
                '/users/' + this.user.uid + '/grocery_list/' + elem.text,
                {
                    completed: 1
                }
            )
            console.log(elem.text);
        }
    }


    select(args){

        console.log(args);
    }

    onDrawerButtonTap(): void {
        const sideDrawer = <RadSideDrawer>app.getRootView();
        sideDrawer.showDrawer();
    }

    onNavItemTap(navItemRoute: string): void {
        this.routerExtensions.navigate([navItemRoute], {
            transition: {
                name: "fade"
            }
        });

        const sideDrawer = <RadSideDrawer>app.getRootView();
        sideDrawer.closeDrawer();
    }

    isComponentSelected(url: string): boolean {

        return this._activatedUrl === url;
    }

}

