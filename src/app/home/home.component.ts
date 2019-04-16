import { Component, OnInit, ChangeDetectionStrategy, ViewChild, ElementRef,ViewContainerRef } from "@angular/core";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import * as app from "tns-core-modules/application";
import { ActionItems } from "tns-core-modules/ui/action-bar/action-bar";
import { EventData, backgroundImageProperty, eachDescendant } from "tns-core-modules/ui/page/page";
import { registerElement } from 'nativescript-angular/element-registry';
import { NavigationEnd, Router } from "@angular/router";
import { RouterExtensions } from "nativescript-angular/router";
import { Button } from "tns-core-modules/ui/button";
import {Label} from "tns-core-modules/ui/label";
import { StackLayout } from "ui/layouts/stack-layout";
import * as localstorage from "nativescript-localstorage";
import * as firebase from "nativescript-plugin-firebase";
import { Item } from "../shared/item.model";
import { forEach } from "@angular/router/src/utils/collection";


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

    public itemList: Array<Item>;
    public list: Array<string>;

    constructor(private router: Router, private routerExtensions: RouterExtensions) {
        // Use the component constructor to inject services.
      
        firebase.getCurrentUser()
        .then(user => localStorage.setItem("userID", user.uid))
        .catch(error => console.log(error));

    }
  
    ngAfterViewInit() {
    
    }

    ngOnInit(): void {
        // Init your component properties here.

        this.itemList = [];

          var onValueEvent = function(result) {
            //console.log("Event type: " + result.type);
            //console.log("Key: " + result.key);
            console.log("Value: " + JSON.stringify(result.value));

            var jsonObj = JSON.parse(result.value);
            //console.log("JSON Response: " + JSON.stringify(result));
            //JSON.stringify(result);
            //console.log("JSON Response: " + JSON.stringify(result.value.Fresh.Strawberries));
            for(let i = 0; i < jsonObj.length; i++){

                this.list.push(jsonObj[i].name);
                console.log(jsonObj[i].name);
            }

          };
        
          // listen to changes in the /companies path
          firebase.addValueEventListener(onValueEvent, "/users/" + localStorage.getItem("userID")).then(
            function(listenerWrapper) {
              var path = listenerWrapper.path;
              var listeners = listenerWrapper.listeners; // an Array of listeners added
              // you can store the wrapper somewhere to later call 'removeEventListeners'
            }
          );
          this.list = [];

     /*    for(let i = 0; i < this.itemList.length; i++){

            this.list.push(new Item(this.itemList[i]));
        } */
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

