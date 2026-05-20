import { Restaurant } from './restaurant';

export interface MenuItem {
  id:number;
  name:string;
  menuType:string;
  price:number;
  quantity:number;
  restaurant:Restaurant;
}
