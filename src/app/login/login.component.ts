import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import { alert, prompt } from "tns-core-modules/ui/dialogs";
import * as app from "tns-core-modules/application";
import { User } from "../shared/user.model";
import { Page } from "tns-core-modules/ui/page/page";
import { RouterExtensions } from "nativescript-angular/router";


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
    userName = "user@napier.org";
    userPass = "password";
    @ViewChild("password") password: ElementRef;
    @ViewChild("confirmPassword") confirmPassword: ElementRef;

    constructor(private page: Page, private routerExtensions: RouterExtensions) {
        // Use the component constructor to inject providers.
        //this.page.actionBarHidden = true;
        this.user = new User();
        this.user.email = "user@nativescript.org";
        this.user.password = "password";
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

    submit() {
        if (!this.user.email || !this.user.password) {
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

        if (this.user.email == this.userName && this.user.password == this.userPass) {

            this.processing = false;
            this.routerExtensions.navigate(["/home"], { clearHistory: true });
        }
        else{

            this.processing = false;
            this.alert("No account found");
        };
    }

    register() {
        if (this.user.password != this.user.confirmPassword) {
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
