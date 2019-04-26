import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import * as app from "tns-core-modules/application";
import { Data } from "../providers/data/data";
import { Router, NavigationExtras } from "@angular/router";
import { RouterExtensions } from "nativescript-angular/router";
import * as localStorage from "nativescript-localstorage";
import { ListPicker } from "tns-core-modules/ui/list-picker";
import * as firebase from "nativescript-plugin-firebase";
let categoryList = [" ", "Frozen", "Fresh", "Vegetables", "Fruit", "Meat",
    "Dairy", "Grain", "Drinks", "Furniture", "Stationary"];

@Component({
    selector: "AddList",
    moduleId: module.id,
    templateUrl: "./addList.component.html"
})

export class AddListComponent implements OnInit {
    @ViewChild('picker') test: ElementRef;
    @ViewChild('textField') textField: ElementRef;
    picker: ListPicker;
    private _activatedUrl: string;
    public categories: Array<string> = [];
    public picked: string;
    public uID: string;
    public user;

    constructor(private router: Router, private data: Data, private routerExtensions: RouterExtensions) {
        // Use the component constructor to inject providers.
        for (let category of categoryList) {
            this.categories.push(category);
        }
    }
    showPicker() {
        
        this.test.nativeElement.style.visibility = "visible";

    }

    public selectedIndexChanged(args) {
        let picker = <ListPicker>args.object;
        this.picker = picker;
        this.picked = this.categories[picker.selectedIndex];
    }

    ngOnInit(): void {
        // Init your component properties here.
        this.user = localStorage.getItem("user");
        this.uID = this.user.uid;
    }

    onDrawerButtonTap(): void {
        const sideDrawer = <RadSideDrawer>app.getRootView();
        sideDrawer.showDrawer();
    }

    title = "";
    listColor = "";
    items = [];

    color(args) {
        var button = args.object;
        alert(button.id + " has been selected!");
        this.listColor = button.id;
    }

    //adds new item to firebase RTDB
    addItem(): void {

        var item = this.title;

        if (item === "") {

            alert("Please enter an Item Name");

        }

        else {
            firebase.update(
                '/users/' + this.user.uid + '/grocery_list/' + item,
                {
                    name: item,
                    category: this.picked,
                    completed: 0
                }
            )

            this.routerExtensions.navigate(["/home"], { clearHistory: true });
        }
    }

}


