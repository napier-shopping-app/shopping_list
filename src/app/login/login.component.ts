import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import { alert, prompt } from "tns-core-modules/ui/dialogs";
import { TextField } from "tns-core-modules/ui/text-field";
import * as app from "tns-core-modules/application";
import { User } from "../shared/user.model";
import { Page } from "tns-core-modules/ui/page/page";
import { RouterExtensions } from "nativescript-angular/router";
import * as localStorage from "nativescript-localstorage"; //conflict sorted was all lowercase previously **NEEDS CHECKED**

@Component({
    selector: "Login",
    moduleId: module.id,
    templateUrl: "./login.component.html",
    styleUrls: ['./login.component.css'],
})

export class LoginComponent implements OnInit {

    isLoggingIn = true;
    user: User;
    processing = false;
    txtEmail = "";
    txtPassword = "";
    txtConfirmPassword = "";
    @ViewChild("password") password: ElementRef;
    @ViewChild("confirmPassword") confirmPassword: ElementRef;
    list = []; 
    
    constructor(private page: Page, private routerExtensions: RouterExtensions) {
        // Use the component constructor to inject providers.
        this.page.actionBarHidden = true;
        this.user = new User();
        this.user.email = "user@nativescript.org";
        this.user.password = "password";
        var shops = JSON.stringify(this.list);
        
        localStorage.setItem("Shops", shops);
        //this.user.email = this.txtEmail;
        //this.user.password = this.txtPassword;
    }

    ngOnInit(): void {
        // Init your component properties here.
    }

    onDrawerButtonTap(): void {
        const sideDrawer = <RadSideDrawer>app.getRootView();
        sideDrawer.showDrawer();
    }

    toggleForm() {
        this.isLoggingIn = !this.isLoggingIn;
    }

    submit(txtEmail, txtPassword, txtConfirmPassword) {

        this.txtEmail = txtEmail;
        this.txtPassword = txtPassword;
        this.txtConfirmPassword = txtConfirmPassword;
        this.user = new User(this.txtEmail, this.txtPassword);
        localStorage.clear();

        if (!this.txtEmail || !this.txtPassword) {
            this.alert("Please provide both an email address and password.");
            return;
        }

        this.processing = true;

        if (this.isLoggingIn) {
            this.login();
        } else {
            this.register();
        }
    }

    login() {

        //console.log("User Details: " + this.txtEmail + " " + this.txtPassword);
        localStorage.setItemObject('user', JSON.stringify(this.user)); //saves user object locally
        //console.log("Keys Stored: ", localStorage.length);
        this.routerExtensions.navigate(["/home"], { clearHistory: true }); //reroutes the login pages on login to home page
    }

    register() {
        if (this.txtPassword != this.txtConfirmPassword) {
            this.alert("Your passwords do not match.");
            this.processing = false;
            return;
        }
        else{

        }
    }

    forgotPassword() {
        prompt({
            title: "Forgot Password",
            message: "Enter the email address you used to register Napier Shopping to reset your password.",
            inputType: "email",
            defaultText: "",
            okButtonText: "Ok",
            cancelButtonText: "Cancel"
        });
    }

    focusPassword() {
        this.password.nativeElement.focus();
    }
    focusConfirmPassword() {
        if (!this.isLoggingIn) {
            this.confirmPassword.nativeElement.focus();
        }
    }

    alert(message: string) {
        return alert({
            title: "Napier Shopping",
            okButtonText: "OK",
            message: message
        });
    }

}
