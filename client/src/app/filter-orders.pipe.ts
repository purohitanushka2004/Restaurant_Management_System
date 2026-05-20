import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterOrders'
})
export class FilterOrdersPipe implements PipeTransform {

  transform(orders: any[], searchText: string): any[] {

    if (!orders || !searchText) {
      return orders;
    }

    const search = searchText.toLowerCase().trim();

    return orders.filter(order => {

      // CUSTOMER
      const customerMatch =
        order.customerName
          ?.toLowerCase()
          .includes(search) ||

        order.user?.username
          ?.toLowerCase()
          .includes(search);

      // RESTAURANT
      const restaurantMatch =
        order.restaurantName
          ?.toLowerCase()
          .includes(search) ||

        order.restaurant?.name
          ?.toLowerCase()
          .includes(search);

      // STATUS
      const statusMatch =
        order.status
          ?.toLowerCase()
          .includes(search);

      // MENU ITEMS (EXACT MATCH)
      const menuItemMatch =
        order.menuItemNames?.some((item: string) =>

          item
            ?.toLowerCase()
            .trim() === search

        );

      return (
        customerMatch ||
        restaurantMatch ||
        statusMatch ||
        menuItemMatch
      );

    });
  }
}