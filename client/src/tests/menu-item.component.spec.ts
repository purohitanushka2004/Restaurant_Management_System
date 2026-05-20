import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { MenuItemComponent } from '../app/component/menu-item/menu-item.component';
import { MenuItemService } from '../app/shared/services/menu-item.service';
import { RestaurantService } from '../app/shared/services/restaurant.service';
import { AuthService } from '../app/shared/services/auth.service';
import { Router } from '@angular/router';
import { MenuItem } from '../app/model/menu-item';
import { Restaurant } from '../app/model/restaurant';
import { FilterMenuItemsPipe } from '../app/filter-menu-items.pipe';


describe('MenuItemComponent', () => {
  let component: MenuItemComponent;
  let fixture: ComponentFixture<MenuItemComponent>;
  let menuItemServiceSpy: jasmine.SpyObj<MenuItemService>;
  let restaurantServiceSpy: jasmine.SpyObj<RestaurantService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  const mockMenuItems: MenuItem[] = [
    { id: 1, name: 'Pizza', menuType: 'Veg', price: 299, quantity: 1, restaurant: { id: 1, name: 'Food Hub', location: '', address: '', email: '', phNumber: 0, menuItems: [] } }
  ]as any;

  const mockRestaurants: Restaurant[] = [
    { id: 1, name: 'Food Hub', location: 'City', address: '', email: '', phNumber: 1234567890, menuItems: [] }
  ]as any;

  beforeEach(async () => {
    const menuItemSpy = jasmine.createSpyObj('MenuItemService', ['getAllMenuItems', 'addMenuItem', 'updateMenuItem', 'deleteMenuItem']);
    const restaurantSpy = jasmine.createSpyObj('RestaurantService', ['getAll']);
    const authSpy = jasmine.createSpyObj('AuthService', ['getLoginStatus', 'getRole', 'logout']);
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [MenuItemComponent,FilterMenuItemsPipe],
      imports: [ReactiveFormsModule, FormsModule, HttpClientTestingModule],
      providers: [
        { provide: MenuItemService, useValue: menuItemSpy },
        { provide: RestaurantService, useValue: restaurantSpy },
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MenuItemComponent);
    component = fixture.componentInstance;
    menuItemServiceSpy = TestBed.inject(MenuItemService) as jasmine.SpyObj<MenuItemService>;
    restaurantServiceSpy = TestBed.inject(RestaurantService) as jasmine.SpyObj<RestaurantService>;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    menuItemServiceSpy.getAllMenuItems.and.returnValue(of(mockMenuItems));
    restaurantServiceSpy.getAll.and.returnValue(of(mockRestaurants));
    authServiceSpy.getLoginStatus.and.returnValue(true);
    authServiceSpy.getRole.and.returnValue('ADMIN');

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load menu items on init', () => {
    component.ngOnInit();
    expect(menuItemServiceSpy.getAllMenuItems).toHaveBeenCalled();
    expect(component.menuItems.length).toBe(1);
  });

  it('should load restaurants on init', () => {
    component.ngOnInit();
    expect(restaurantServiceSpy.getAll).toHaveBeenCalled();
    expect(component.restaurants.length).toBe(1);
  });

  it('should submit a new menu item', () => {
    menuItemServiceSpy.addMenuItem.and.returnValue(of(mockMenuItems[0]));
    component.menuItemForm.setValue({
      name: 'Burger',
      menuType: 'Non-Veg',
      quantity: 2,
      price: 199,
      restaurantId: 1
    });

    component.onSubmit();
    expect(menuItemServiceSpy.addMenuItem).toHaveBeenCalled();
  });

  it('should update an existing menu item', () => {
    menuItemServiceSpy.updateMenuItem.and.returnValue(of(mockMenuItems[0]));
    component.editingId = 1;
    component.menuItemForm.setValue({
      name: 'Pizza',
      menuType: 'Veg',
      quantity: 1,
      price: 299,
      restaurantId: 1
    });

    component.onSubmit();
    expect(menuItemServiceSpy.updateMenuItem).toHaveBeenCalledWith(1, jasmine.any(Object));
  });

  it('should patch form when editing a menu item', () => {
    component.editMenuItem(mockMenuItems[0]);
    expect(component.menuItemForm.value.name).toBe('Pizza');
    expect(component.editingId).toBe(1);
  });

  it('should delete a menu item', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    menuItemServiceSpy.deleteMenuItem.and.returnValue(of({})as any);
    component.deleteMenuItem(1);
    expect(menuItemServiceSpy.deleteMenuItem).toHaveBeenCalledWith(1);
  });

  it('should cancel edit and reset form', () => {
    component.menuItemForm.setValue({
      name: 'Pizza',
      menuType: 'Veg',
      quantity: 1,
      price: 299,
      restaurantId: 1
    });
    component.editingId = 1;
    component.cancelEdit();
    expect(component.menuItemForm.value.name).toBeNull();
    expect(component.editingId).toBeNull();
  });

  
});
