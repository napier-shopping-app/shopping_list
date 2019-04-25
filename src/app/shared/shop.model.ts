import { Category } from "../shared/category.model";

export class Shop{

    public shopName: string;
    public _categories = [];

    constructor(shopName, category){
        
        this.shopName = shopName;
        this._categories.push(new Category(category));
    }

    public setCategories(category){

        this._categories.push(new Category(category));
    }

    
    public get categories() : Array<Category> {
        
        return this._categories; 
    }
    
}