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
import { ListViewEventData } from "nativescript-ui-listview";
import { RadListViewComponent } from "nativescript-ui-listview/angular";
import { View } from 'tns-core-modules/ui/core/view';

registerElement('Fab', () => require('nativescript-floatingactionbutton').Fab);

@Component({
    selector: "Home",
    moduleId: module.id,
    templateUrl: "./home.component.html",
})

export class HomeComponent implements OnInit {
    @ViewChild('stackLay') stackLay: ElementRef;
    @ViewChild('test') test: ElementRef;
    @ViewChild("myListView") listViewComponent: RadListViewComponent;
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
    
     onCellSwiping(args: ListViewEventData) {
        var swipeLimits = args.data.swipeLimits;
        var currentItemView = args.object;
        var currentView;

        if (args.data.x > 200) {
            console.log("Notify perform left action");
        } else if (args.data.x < -200) {
            console.log("Notify perform right action");
        }
    }

     onSwipeCellStarted(args: ListViewEventData) {
        const swipeLimits = args.data.swipeLimits;
        const swipeView = args['object'];
    
        const rightItem = swipeView.getViewById<View>('delete-view');
        swipeLimits.left = 0; 
        swipeLimits.right = rightItem.getMeasuredWidth();
        swipeLimits.threshold = rightItem.getMeasuredWidth() / 2;
        
    }
    // << angular-listview-swipe-action-release-limits
    // >> angular-listview-swipe-action-release-execute
     onSwipeCellFinished(args: ListViewEventData) {
    }
    // << angular-listview-swipe-action-release-execute
    // >> angular-listview-swipe-action-handlers
     onRightSwipeClick(args) {
        console.log("Left swipe click");
        
           
            
        firebase.remove("/users/" + this.user.uid + "/grocery_list/" + args.object.bindingContext.itemName);
        this.itemList.splice(this.itemList.indexOf(args.object.bindingContext), 1);    
        

       
        this.listViewComponent.listView.notifySwipeToExecuteFinished();

    }

     
    // << angular-listview-swipe-action-handlers

     onPullToRefreshInitiated(args: any) {
       this.loadList();
       this.listViewComponent.listView.notifyPullToRefreshFinished();
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

