import { Component, OnInit, ChangeDetectionStrategy, ViewChild, ElementRef, ViewContainerRef } from "@angular/core";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import * as app from "tns-core-modules/application";
import { registerElement } from 'nativescript-angular/element-registry';
import { Router } from "@angular/router";
import { RouterExtensions } from "nativescript-angular/router";
import * as localstorage from "nativescript-localstorage";
import * as Geolocation from "nativescript-geolocation";
import * as firebase from "nativescript-plugin-firebase";
import { Item } from "../shared/item.model";
import { PullToRefresh } from 'nativescript-pulltorefresh';


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

    constructor(private router: Router, private routerExtensions: RouterExtensions) {
        // Use the component constructor to inject services.
        //gets user ID from firebase
        firebase.getCurrentUser()
            .then(user => localStorage.setItem("userID", user.uid))
            .catch(error => console.log(error));

        this.loadList();

    }

    ngAfterViewInit() {

    }

    ngOnInit(): void {
        // Init your component properties here.
        this.loadList();

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
                            console.log(loc.latitude);
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
    }

    //get list from firebase and load it to the listview
    loadList() {

        var onValueEvent = (result) => {

            this.tempList = [];

            //console.log(result);

            for (var row in result.value) {

                var jsonObj = result.value[row];
                this.tempList.push(new Item(jsonObj.name, jsonObj.category, jsonObj.completed));
                //console.log(jsonObj.name + " - " + jsonObj.category);
            }

            localStorage.setItemObject("listArray", this.tempList);
            this.itemList = [];

            for (let i = 0; i < this.tempList.length; i++) {

                this.itemList.push(this.tempList[i].itemName);
                
                //console.log("Testing: " + this.tempList[i].itemName);
                //console.log("Item Name: " + this.itemList[i]);
            }
        };



        // listen to changes in the /users/'uid' path
        firebase.addValueEventListener(onValueEvent, "/users/" + localStorage.getItem("userID"))
            .then(
                () => {
                    console.log("Event Listener Added");
                },
                (error) => {
                    console.error("Event Listener Error: " + error);
                });
    }



    onLongPress(event): void{

        console.log(event);
    }

    selectItem(args) {

        var elem = args.object;

        if(elem.style.textDecoration == "line-through"){

            elem.style.textDecoration = "none";
            firebase.update(
                '/users/' + localStorage.getItem("userID") + '/' + elem.text,
                {
                    completed: 0
                }
            )
            console.log(elem.text);
        }
        else{

            elem.style.textDecoration = "line-through";
            firebase.update(
                '/users/' + localStorage.getItem("userID") + '/' + elem.text,
                {
                    completed: 1
                }
            )
            console.log(elem.text);
        }
    }
    
        refreshList(args){

        var pullRefresh: PullToRefresh = args.object;

        setTimeout(function(){
            this.loadList();
            pullRefresh.refreshing = false;
        }, 1000);

        console.log("Refreshing List");
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

