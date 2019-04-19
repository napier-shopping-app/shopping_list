import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import { RadSideDrawer } from "nativescript-ui-sidedrawer";
import * as app from "tns-core-modules/application";
import * as view from "tns-core-modules/ui/core/view";
import { ObservableArray, ChangedData } from "tns-core-modules/data/observable-array";
import { Validators } from "@angular/forms";
import { Page } from "tns-core-modules/ui/page";
import { Data } from "../providers/data/data";
import { Router, NavigationExtras } from "@angular/router";
import { RouterExtensions } from "nativescript-angular/router";
import * as localStorage from "nativescript-localstorage";
import { ListPicker } from "tns-core-modules/ui/list-picker";
let pokemonList = [" ", "Tesco", "ASDA", "Morrisons", "Sainsburies", "IKEA",
    "M&S", "ALDI", "LIDL", "Co-Op", "Costcutter"];

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
    public shops = [];
    public pokemons: Array<string> = [];
    public picked: string;
    constructor(private router: Router, private data: Data, private routerExtensions: RouterExtensions) {
        // Use the component constructor to inject providers.
        this.shops = JSON.parse(localStorage.getItem("Shops"));
        for (let pokemon of pokemonList) {
            this.pokemons.push(pokemon);
        }
    }
    showPicker() {
        this.test.nativeElement.style.visibility = "visible";

    }

    update() {


    }

    public selectedIndexChanged(args) {
        let picker = <ListPicker>args.object;
        this.picker = picker;
        this.picked = this.pokemons[picker.selectedIndex];
    }
    ngOnInit(): void {
        // Init your component properties here.
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

    save(): void {

        //alert("The list: " + this.title + " with color: " + this.listColor + " has been created!");

        this.shops.push(this.title + "|" + this.listColor);
        localStorage.setItem("Shops", JSON.stringify(this.shops));
        localStorage.setItem(this.title, JSON.stringify(this.items));
        this.routerExtensions.navigate(["/home"], { clearHistory: true });
    }

}


