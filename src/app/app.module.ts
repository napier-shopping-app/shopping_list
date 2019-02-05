import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { NativeScriptUISideDrawerModule } from "nativescript-ui-sidedrawer/angular";
import * as platform from "platform";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";

declare var GMSServices: any;

if(platform.isIOS){
    GMSServices.provideAPIKey("AIzaSyCd7i6undwT0TthNkDdqOsb5418DgaOpMk");
}

@NgModule({
    bootstrap: [
        AppComponent
    ],
    imports: [
        AppRoutingModule,
        NativeScriptModule,
        NativeScriptUISideDrawerModule
    ],
    declarations: [
        AppComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class AppModule { }
