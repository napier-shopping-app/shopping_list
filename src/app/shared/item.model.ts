import { Category } from "../shared/category.model";

export class Item {

    public itemName: string;
    public category: Category;
    public completed: number;

    constructor(name, cat, completed){

        this.itemName = name;
        this.category = new Category(cat);
        this.completed = completed;
    }

}