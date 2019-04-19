import { Component, OnInit, ViewChild, ElementRef, NgZone } from "@angular/core";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import { alert, prompt } from "tns-core-modules/ui/dialogs";
import { TextField } from "tns-core-modules/ui/text-field";
import * as app from "tns-core-modules/application";
import { Page } from "tns-core-modules/ui/page/page";
import { RouterExtensions } from "nativescript-angular/router";
import * as firebase from "nativescript-plugin-firebase";
import * as localStorage from "nativescript-localstorage";
import * as user from "../shared/user.model";
import { Router } from "@angular/router";
import { registerContentQuery } from "@angular/core/src/render3";


@Component({
  selector: "Login",
  moduleId: module.id,
  templateUrl: "./login.component.html",
  styleUrls: ['./login.component.css'],
})


export class LoginComponent implements OnInit {

  constructor(private page: Page, private routerExtensions: RouterExtensions, private zone: NgZone) {
    // Use the component constructor to inject providers.
    this.page.actionBarHidden = true;
  }

  ngOnInit(): void {
    // Init your component properties here.
    localStorage.setItem('Shops', JSON.stringify(this.shops));
    var listener = { 
      onAuthStateChanged: function(data) {

        console.log(data.loggedIn ? "Logged in to firebase" : "Logged out from firebase");

        if (data.loggedIn) {

          console.log("User info", data.user);
          this.routerExtensions.navigate(['/home'], { clearHistory: true });
        }
      },
      thisArg: this
    };

    firebase.addAuthStateListener(listener);
    firebase.hasAuthStateListener(listener);

  }

  onDrawerButtonTap(): void {
    const sideDrawer = <RadSideDrawer>app.getRootView();
    sideDrawer.showDrawer();
  }
  shops = [];
  bypassLogin(){
    
    //localStorage.setItemObject('Shops', JSON.stringify(this.shops));
    this.routerExtensions.navigate(['/home'], { clearHistory: true });
  }

  //firebase login with google
  google() {
    firebase.login({
      type: firebase.LoginType.GOOGLE,
      // Optional 
      googleOptions: {
        //hostedDomain: "google.com"
      }
    }).then(
      function (user) {
        JSON.stringify(user);
        console.log(user.email);
        console.log(user.uid);
        //this.user.isLoggedIn = true;
        localStorage.setItemObject('user', JSON.stringify(this.user));
        this.routerExtensions.navigate(["/home"], { clearHistory: true});
      },
      function (errorMessage) {
        console.log(errorMessage);
      }
    );
  }

  //FOR TESTING ONLY
  anon() {

    firebase.login(
      {
        type: firebase.LoginType.ANONYMOUS
      })
      .then(
        function (user) {
          JSON.stringify(user);
          console.log("User ID: " + user.uid);
        }
      )
      .catch(
        function (errorMessage) {
          console.log(errorMessage);
        }
      )
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
      function (user) {
        JSON.stringify(user);
        console.log(user.email);
        console.log(user.uid);

        //this.user = new User(user.email, user.name);
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
