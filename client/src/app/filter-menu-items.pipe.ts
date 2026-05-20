import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterMenuItems'
})
export class FilterMenuItemsPipe implements PipeTransform {
  transform(menuItems: any[], searchText: string): any[] {
    if (!menuItems || !searchText) {
      return menuItems;
    }

    searchText = searchText.toLowerCase();

    return menuItems.filter(item =>
      item.name?.toLowerCase().includes(searchText) ||
      item.menuType?.toLowerCase().includes(searchText) ||
      item.restaurant?.name?.toLowerCase().includes(searchText)
    );
  }
}
