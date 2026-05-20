import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { OrderComponent } from '../app/component/order/order.component';
import { OrderService } from '../app/shared/services/order.service';
import { AuthService } from '../app/shared/services/auth.service';
import { RestaurantService } from '../app/shared/services/restaurant.service';
import { MenuItemService } from '../app/shared/services/menu-item.service';
import { Router } from '@angular/router';
import { User } from '../app/model/user';
import { Order } from '../app/model/order';
import { FilterOrdersPipe } from '../app/filter-orders.pipe';


describe('OrderComponent', () => {
  let component: OrderComponent;
  let fixture: ComponentFixture<OrderComponent>;
  let orderServiceSpy: jasmine.SpyObj<OrderService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let restaurantServiceSpy: jasmine.SpyObj<RestaurantService>;
  let menuItemServiceSpy: jasmine.SpyObj<MenuItemService>;
  let routerSpy: jasmine.SpyObj<Router>;

  const mockUser: User = { id: 1, username: 'john', email: 'john@example.com', password: '', role: 'CUSTOMER' }as any;
  const mockOrder: Order = {
    id: 1,
    customerName: 'john',
    orderTime: new Date().toISOString(),
    status: 'Order',
    totalAmount: 100,
    restaurant: { id: 1, name: '', location: '', address: '', email: '', phNumber: 0, menuItems: [] }as any,
    items: [],
    user: mockUser
  }as any;

  beforeEach(async () => {
    const orderSpy = jasmine.createSpyObj('OrderService', ['getAllOrders', 'placeOrder', 'cancelOrder']);
    const authSpy = jasmine.createSpyObj('AuthService', ['getLoggedInUser']);
    const restaurantSpy = jasmine.createSpyObj('RestaurantService', ['getAll']);
    const menuItemSpy = jasmine.createSpyObj('MenuItemService', ['getAllMenuItems']);
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [OrderComponent,FilterOrdersPipe],
      imports: [ReactiveFormsModule, FormsModule, HttpClientTestingModule],
      providers: [
        { provide: OrderService, useValue: orderSpy },
        { provide: AuthService, useValue: authSpy },
        { provide: RestaurantService, useValue: restaurantSpy },
        { provide: MenuItemService, useValue: menuItemSpy },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(OrderComponent);
    component = fixture.componentInstance;
    orderServiceSpy = TestBed.inject(OrderService) as jasmine.SpyObj<OrderService>;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    restaurantServiceSpy = TestBed.inject(RestaurantService) as jasmine.SpyObj<RestaurantService>;
    menuItemServiceSpy = TestBed.inject(MenuItemService) as jasmine.SpyObj<MenuItemService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    orderServiceSpy.getAllOrders.and.returnValue(of([mockOrder]));
    authServiceSpy.getLoggedInUser.and.returnValue(of(mockUser));
    restaurantServiceSpy.getAll.and.returnValue(of([]));
    menuItemServiceSpy.getAllMenuItems.and.returnValue(of([]));

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

 

  it('should calculate total amount correctly', () => {
    component.items.push(component['fb'].group({ price: 50, quantity: 2 }));
    component.items.push(component['fb'].group({ price: 25, quantity: 1 }));
    const total = component.getTotalAmount();
    expect(total).toBe(125);
  });

  it('should submit a new order', () => {
    component.loggedInUser = mockUser;
    component.orderForm.patchValue({
      customerName: 'john',
      orderDate: component.getTodayDate(),
      totalAmount: 100,
      restaurantId: 1,
      status: 'Order',
      items: [],
      userId: 1
    });

    component.onSubmit();
    expect(component.pendingOrders.length).toBe(1);
  });

  it('should confirm and submit pending order', () => {
    orderServiceSpy.placeOrder.and.returnValue(of(mockOrder));
    component.pendingOrders = [mockOrder];

    component.submitPendingOrder(mockOrder);
    expect(orderServiceSpy.placeOrder).toHaveBeenCalledWith(mockOrder);
  });

  it('should cancel an order', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    orderServiceSpy.cancelOrder.and.returnValue(of({}));

    component.cancelOrder(mockOrder);
    expect(orderServiceSpy.cancelOrder).toHaveBeenCalledWith(mockOrder.id);
  });

  it('should view an order and disable form', () => {
    component.viewOrder(mockOrder);
    expect(component.editingId).toBe(mockOrder.id);
    expect(component.orderForm.disabled).toBeTrue();
  });

  it('should cancel view and enable form', () => {
    component.cancelView();
    expect(component.editingId).toBeNull();
    expect(component.orderForm.enabled).toBeTrue();
  });
});
