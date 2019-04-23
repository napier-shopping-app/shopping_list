import { Component, OnInit, ViewChild, ChangeDetectorRef, AfterViewInit } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { RouterExtensions } from "nativescript-angular/router";
import { DrawerTransitionBase, RadSideDrawer, SlideInOnTopTransition } from "nativescript-ui-sidedrawer";
import { filter } from "rxjs/operators";
import * as app from "tns-core-modules/application";
import * as firebase from "nativescript-plugin-firebase";
import * as localStorage from "nativescript-localstorage";
import { User } from "./shared/user.model";
import { isIOS, isAndroid } from "tns-core-modules/ui/page/page";
import { RadSideDrawerComponent } from "nativescript-ui-sidedrawer/angular/side-drawer-directives";

@Component({
    moduleId: module.id,
    selector: "ns-app",
    templateUrl: "app.component.html"
})

export class AppComponent implements OnInit {

    //@ViewChild(RadSideDrawerComponent) public drawerComponent: RadSideDrawerComponent;
    //private drawer: RadSideDrawer;
    private _activatedUrl: string;
    private _sideDrawerTransition: DrawerTransitionBase;
    public user;
    public userName;
    public emailAddy;
    public userIcon;
    public uID;
    //public user: User;

    constructor(private router: Router, private routerExtensions: RouterExtensions, private changeDetectionRef: ChangeDetectorRef) {
        // Use the component constructor to inject services.
    }

    ngOnInit(): void {

        this._activatedUrl = "/main";
        this._sideDrawerTransition = new SlideInOnTopTransition();

        this.router.events
        .pipe(filter((event: any) => event instanceof NavigationEnd))
        .subscribe((event: NavigationEnd) => this._activatedUrl = event.urlAfterRedirects);

        firebase.init({
        }).then(
          instance => {
            console.log("firebase.init done");
          },
          error => {
            console.log(`firebase.init error: ${error}`);
          }
        );

        this.user = localStorage.getItem("user");

        this.userIcon = this.user.profileImageURL;
        this.userName = this.user.name;
        this.emailAddy = this.user.email;
        this.uID = this.user.uid;
        
        //this.userName = "Placeholder";
        //this.emailAddy = "placeholder@place.holder";
    }

    /* ngAfterViewInit(): void{

         this.drawer = this.drawerComponent.sideDrawer;
        this.changeDetectionRef.detectChanges();

        if(isIOS){
            this.drawer.ios.defaultSideDrawer.allowEdgeSwipe = false;
        }
    } */

    // onLoaded(){

    //     // if(isAndroid){

    //     //     this.drawer.android.setTouchTargetThreshold(0);
    //     // }

    // } 

    get sideDrawerTransition(): DrawerTransitionBase {

        
        return this._sideDrawerTransition;
    }

    loggedIn(): void {

        this.routerExtensions.navigate(['/login'], {
            transition: {
                name: "fade"
            }
        });
    }

    updateList(){

        let itemList = localStorage.getItem("listArray");
        var key = localStorage.getItem("listKey");

        for(let i = 0; i < itemList.length; i++){

            if(itemList[i].completed == 1){

                firebase.remove("/lists/" + key + "/grocery_list/" + itemList[i].itemName);
            }
        }

        //console.log("UID: " + this.uID);
        alert("List Updated");
        this.onNavItemTap('/home');
    }

    isComponentSelected(url: string): boolean {
        return this._activatedUrl === url;
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

    logout(){

        firebase.logout();
        localStorage.clear();
        this.routerExtensions.navigate(['/login'], {
            transition: {
                name: "fade"
            }
        });

        const sideDrawer = <RadSideDrawer>app.getRootView();
        sideDrawer.closeDrawer();
    }
}