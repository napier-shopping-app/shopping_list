import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";
import { NativeScriptFormsModule } from "nativescript-angular/forms";

import { addItemRoutingModule } from "./addItem-routing.module";
import { AddItemComponent } from "./addItem.component";

@NgModule({
    imports: [
        NativeScriptCommonModule,
        addItemRoutingModule,
        NativeScriptFormsModule
    ],
    declarations: [
        AddItemComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class AddItemModule { }
