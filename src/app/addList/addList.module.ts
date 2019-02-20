import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";
import { NativeScriptFormsModule } from "nativescript-angular/forms";

import { addListRoutingModule } from "./addList-routing.module";
import { AddListComponent } from "./addList.component";

@NgModule({
    imports: [
        NativeScriptCommonModule,
        addListRoutingModule,
        NativeScriptFormsModule
    ],
    declarations: [
        AddListComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class AddListModule { }
