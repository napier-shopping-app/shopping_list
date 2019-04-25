import { Component, OnInit, ViewChild, ElementRef, NgZone } from "@angular/core";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import { alert, prompt } from "tns-core-modules/ui/dialogs";
import * as app from "tns-core-modules/application";
import { Page } from "tns-core-modules/ui/page/page";
import { RouterExtensions } from "nativescript-angular/router";
import * as firebase from "nativescript-plugin-firebase";
import * as localStorage from "nativescript-localstorage";

import { registerElement } from 'nativescript-angular/element-registry';
import { Gif } from 'nativescript-gif';
registerElement('Gif', () => Gif);

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
    //checks if user is logged in already then redirects to home
    var listener = {
      onAuthStateChanged: function (data) {

        console.log(data.loggedIn ? "Logged in to firebase" : "Logged out from firebase");

        if (data.loggedIn) {

          //console.log("User info", data.user);
          localStorage.setItemObject("user", data.user);
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

        //JSON.stringify(user);
        //console.log("Email: " + user.email);
        //console.log("New User: " + user.additionalUserInfo.isNewUser);

        var newUser: boolean = user.additionalUserInfo.isNewUser;
        var item = "Apples";

        console.log("UID: " + user.uid);
        //this.user.isLoggedIn = true;
        localStorage.setItemObject('user', user);


        //initialises new users with a list and preferences
        if (newUser) {

          console.log("Preparing new User: " + user.uid);
          var groceryPath = "/grocery_list/" + item;
          var prefPath = "/preferences";
          var data = {};

          data[groceryPath] = { name: item, category: "Fresh", completed: 0 };
          data[prefPath] = { account_type: "Free", radius: 10000};


          firebase.update('/users/' + user.uid, data);

          this.routerExtensions.navigate(["/home"], { clearHistory: true });
        }
        else {

          this.routerExtensions.navigate(["/home"], { clearHistory: true });
        }

      },
      function (errorMessage) {
        console.log(errorMessage);
        alert(errorMessage);
      }
    );
  }

  //FOR TESTING ONLY
  /* anon() {

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
  } */

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

        var newUser = user.additionalUserInfo.isNewUser;
        JSON.stringify(user);
        localStorage.setItemObject('user', user);
        var item = "Apples";


        if (newUser) {

          console.log("Preparing new User: " + user.uid);
          var groceryPath = "/grocery_list/" + item;
          var prefPath = "/preferences";
          var data = {};

          data[groceryPath] = { name: item, category: "Fresh", completed: 0 };
          data[prefPath] = { account_type: "Free", radius: 10000 };


          firebase.update('/users/' + user.uid, data);

          this.routerExtensions.navigate(["/home"], { clearHistory: true });
        }
        else {

          this.routerExtensions.navigate(["/home"], { clearHistory: true });
        }

      },
      function (errorMessage) {
        console.log(errorMessage);
        alert(errorMessage);
      }
    );
  }

}
