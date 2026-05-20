import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterRestaurants'
})
export class FilterRestaurantsPipe implements PipeTransform {
  transform(restaurants: any[], searchText: string): any[] {
    if (!restaurants || !searchText) {
      return restaurants;
    }

    searchText = searchText.toLowerCase();

    return restaurants.filter(restaurant =>
      restaurant.name?.toLowerCase().includes(searchText) ||
      restaurant.location?.toLowerCase().includes(searchText)
    );
  }
}
