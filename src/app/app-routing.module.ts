import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";

const routes: Routes = [
    { path: "", redirectTo: "/login", pathMatch: "full" },
    { path: "home", loadChildren: "~/app/home/home.module#HomeModule" },
    { path: "map", loadChildren: "~/app/map/map.module#MapModule" },
    { path: "login", loadChildren: "~/app/login/login.module#LoginModule" },
    { path: "list", loadChildren: "~/app/list/list.module#ListModule" },
    { path: "addList", loadChildren: "~/app/addList/addList.module#AddListModule" },
    { path: "addItem", loadChildren: "~/app/addItem/addItem.module#AddItemModule" },
    { path: "featured", loadChildren: "~/app/featured/featured.module#FeaturedModule" },
    { path: "settings", loadChildren: "~/app/settings/settings.module#SettingsModule" }
];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule]
})
export class AppRoutingModule { }
