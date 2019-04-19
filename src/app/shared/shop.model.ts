import { Category } from "../shared/category.model";

export class Shop{

    public shopName: string;
    public category: Array<Category>;

    constructor(shopName, category){
        
        this.shopName = shopName;
        this.category = category;
    }
}