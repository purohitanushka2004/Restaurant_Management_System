import { Restaurant } from './restaurant';
import { MenuItem } from './menu-item';
import { User } from './user';

export interface Order {

  id: number;

  customerName: string;

  orderTime: Date;

  status: string;

  totalAmount: number;

  restaurant?: Restaurant;

  user?: User;

  // ✅ ADD THIS
  menuItemNames?: string[];

}
