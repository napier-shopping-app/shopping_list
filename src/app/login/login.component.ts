import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import { alert, prompt } from "tns-core-modules/ui/dialogs";
import { TextField } from "tns-core-modules/ui/text-field";
import * as app from "tns-core-modules/application";
import { User } from "../shared/user.model";
import { Page } from "tns-core-modules/ui/page/page";
import { RouterExtensions } from "nativescript-angular/router";
import * as firebase from "nativescript-plugin-firebase";
import * as localStorage from "nativescript-localstorage";
import { Router } from "@angular/router";


@Component({
    selector: "Login",
    moduleId: module.id,
    templateUrl: "./login.component.html",
    styleUrls: ['./login.component.css'],
})

export class LoginComponent implements OnInit {

    user: User;
    
    constructor(private page: Page, private routerExtensions: RouterExtensions) {
        // Use the component constructor to inject providers.
        this.page.actionBarHidden = true;
    }

    ngOnInit(): void {
        // Init your component properties here.
    }

    onDrawerButtonTap(): void {
        const sideDrawer = <RadSideDrawer>app.getRootView();
        sideDrawer.showDrawer();
    }

        //firebase login with google
        google() {
            firebase.login({
                type: firebase.LoginType.GOOGLE,
                // Optional 
                googleOptions: {
                  hostedDomain: "mygsuitedomain.com"
                }
              }).then(
                  function (result) {
                    JSON.stringify(result);
                    console.log(result.email);
                    console.log(result.uid);
                    //this.user = new User(result.email, result.name);
                    //this.user.isLoggedIn = true;
                    //localStorage.setItemObject('user', JSON.stringify(this.user));
                    //this.routerExtensions.navigate(["/home"], { clearHistory: true});
                  },
                  function (errorMessage) {
                    console.log(errorMessage);
                  }
              );
        }
    
        //firebase login with facebook
        facebook() {
            firebase.login({
                type: firebase.LoginType.FACEBOOK,
                // Optional
                facebookOptions: {
                  // defaults to ['public_profile', 'email']
                  scope: ['public_profile', 'email']
                }
              }).then(
                  function (result) {
                    JSON.stringify(result);
                    console.log(result.email);
                    console.log(result.uid);
                    //this.user = new User(result.email, result.name);
                    //this.user.isLoggedIn = true;
                    //localStorage.setItemObject('user', JSON.stringify(this.user));
                    //this.routerExtensions.navigate(["/home"], { clearHistory: true});
                  },
                  function (errorMessage) {
                    console.log(errorMessage);
                  }
              );
        }
}
