import { Category } from "../shared/category.model";

export class Shop{

    public shopName: string;
    public _categories: Array<Category>;

    constructor(shopName, category){
        
        this.shopName = shopName;
        this._categories.push(category);
    }

    public set categories(category){

        this._categories.push(new Category(category));
    }

    
    public get categories() : Array<Category> {
        
        return this._categories; 
    }
    
}