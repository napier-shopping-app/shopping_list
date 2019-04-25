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
import { Shop } from "../shared/shop.model";
import { empty } from "rxjs";

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
    public shopArray = [];

    constructor(private router: Router, private routerExtensions: RouterExtensions) {
        // Use the component constructor to inject services.


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

        this.shopArray.push(new Shop("Tesco", "Fresh"));
        this.shopArray[0].setCategories("Fruit");

        this.shopArray.push(new Shop("Sainsbury's", "Frozen"));
        this.shopArray[1].setCategories("Dairy");
        this.shopArray[1].setCategories("Drinks");

        this.shopArray.push(new Shop("Asda", "Grain"));
        this.shopArray[2].setCategories("Drinks");

        this.shopArray.push(new Shop("IKEA", "Furniture"));
        this.shopArray[3].setCategories("Stationary");

        this.shopArray.push(new Shop("Morrisons", "Meat"));
        this.shopArray[4].setCategories("Vegetables");

        console.log(this.shopArray);

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

                this.itemList.push({
                    itemName: this.tempList[i].itemName,
                    itemCategory: this.tempList[i].category.name,
                    itemCompleted: this.tempList[i].completed,
                });
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


    select(args) {

        console.log(args.object.text);

        var button = args.object;

        var shop = button.text;

        if (shop.includes("All")) {

            this.loadList();
        }
        else{

            this.itemList.splice(0, this.itemList.length);

            for(let i = 0; i < this.shopArray.length; i++){

                if(this.shopArray[i].shopName.includes(shop)){

                    var tempCat = this.shopArray[i]._categories;

                    for(let j = 0; j < tempCat.length; j++){

                        for(let x = 0; x < this.tempList.length; x++){

                            if(this.tempList[x].category.name.includes(tempCat[j].name)){

                                this.itemList.push({
                                    itemName: this.tempList[x].itemName,
                                    itemCategory: this.tempList[x].category.name,
                                    itemCompleted: this.tempList[x].completed,
                                });
                            }
                        }
                    }
                }
            }

            /* for (let i = 0; i < this.shopArray.length; i++) {

                if (this.shopArray[i].shopName.includes(shop)) {

                   var tempCat = this.shopArray[i]._categories;
                   console.log(tempCat);

                   for(let j = 0; j < this.itemList.length; j++){

                        for(let k = 0; k < tempCat.length; k++){

                            if(this.tempList[j].category.name.includes(tempCat[k].name)){

                                this.itemList.pop();
                            }
                        }                     
                   }
                }
            } */
        }
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

