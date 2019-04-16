import { Category } from "../shared/category.model";

export class Item {

    public itemName: string;
    public category: Category;

    constructor(name){

        this.itemName = name;
        //this.category = cat;
    }

}