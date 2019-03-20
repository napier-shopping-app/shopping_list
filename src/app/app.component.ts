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
    public userName;
    public emailAddy;
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
            onAuthStateChanged: function(data) {
                
                console.log(data.loggedIn ? "Logged in to firebase" : "Logged out from firebase");

                if(data.loggedIn){
                    console.log("user's uid: " + (data.user.uid ? data.user.uid : "N/A"));
                    //this.loggedIn(data.user);
                }
            }
        }).then(
          instance => {
            console.log("firebase.init done");
          },
          error => {
            console.log(`firebase.init error: ${error}`);
          }
        );
        
        this.userName = "Placeholder";
        this.emailAddy = "placeholder@place.holder";
    }

    /* ngAfterViewInit(): void{

         this.drawer = this.drawerComponent.sideDrawer;
        this.changeDetectionRef.detectChanges();

        if(isIOS){
            this.drawer.ios.defaultSideDrawer.allowEdgeSwipe = false;
        }
    } */

/*     onLoaded(){

        if(isAndroid){

            this.drawer.android.setTouchTargetThreshold(0);
        }

    } */

    get sideDrawerTransition(): DrawerTransitionBase {

        
        return this._sideDrawerTransition;
    }

    loggedIn(user): void {

        this.routerExtensions.navigate(["/home"], { clearHistory: true});
        localStorage.setItemObject('user', user);
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