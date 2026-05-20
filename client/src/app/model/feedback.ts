import { MenuItem } from "./menu-item";
import { Restaurant } from "./restaurant";

export interface Feedback {
 id:number;
 customerName:string;
 comment:string;
 rating:number;
 menuItem:MenuItem;
 restaurant:Restaurant;
}
