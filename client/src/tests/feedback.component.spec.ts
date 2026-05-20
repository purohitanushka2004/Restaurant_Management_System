import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { FeedbackComponent } from '../app/component/feedback/feedback.component';
import { FeedbackService } from '../app/shared/services/feedback-service.service';
import { RestaurantService } from '../app/shared/services/restaurant.service';
import { MenuItemService } from '../app/shared/services/menu-item.service';
import { AuthService } from '../app/shared/services/auth.service';
import { OrderService } from '../app/shared/services/order.service';

import { User } from '../app/model/user';
import { Feedback } from '../app/model/feedback';

describe('FeedbackComponent', () => {
  let component: FeedbackComponent;
  let fixture: ComponentFixture<FeedbackComponent>;
  let feedbackServiceSpy: jasmine.SpyObj<FeedbackService>;
  let restaurantServiceSpy: jasmine.SpyObj<RestaurantService>;
  let menuItemServiceSpy: jasmine.SpyObj<MenuItemService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let orderServiceSpy: jasmine.SpyObj<OrderService>;

  const mockUser: User = {
    id: 1,
    username: 'john',
    email: 'john@example.com',
    password: '',
    role: 'CUSTOMER'
  } as any;

  const mockFeedback: Feedback = {
    id: 1,
    customerName: 'john',
    comment: 'Great food!',
    rating: 5,
    menuItem: {
      id: 1,
      name: 'Pizza',
      menuType: 'Veg',
      price: 299,
      quantity: 1,
      restaurant: { id: 1, name: 'Food Hub' }
    } as any,
    restaurant: { id: 1, name: 'Food Hub' } as any
  } as any;

  beforeEach(async () => {
    const feedbackSpy = jasmine.createSpyObj('FeedbackService', ['submitFeedback', 'getFeedbackAllDetails']);
    const restaurantSpy = jasmine.createSpyObj('RestaurantService', ['getAll']);
    const menuItemSpy = jasmine.createSpyObj('MenuItemService', ['getAllMenuItems']);
    const authSpy = jasmine.createSpyObj('AuthService', ['getRole', 'getLoggedInUser']);
    const orderSpy = jasmine.createSpyObj('OrderService', ['getOrdersByCustomer']);

    await TestBed.configureTestingModule({
      declarations: [FeedbackComponent],
      imports: [ReactiveFormsModule, FormsModule, HttpClientTestingModule],
      providers: [
        { provide: FeedbackService, useValue: feedbackSpy },
        { provide: RestaurantService, useValue: restaurantSpy },
        { provide: MenuItemService, useValue: menuItemSpy },
        { provide: AuthService, useValue: authSpy },
        { provide: OrderService, useValue: orderSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FeedbackComponent);
    component = fixture.componentInstance;

    feedbackServiceSpy = TestBed.inject(FeedbackService) as any;
    restaurantServiceSpy = TestBed.inject(RestaurantService) as any;
    menuItemServiceSpy = TestBed.inject(MenuItemService) as any;
    authServiceSpy = TestBed.inject(AuthService) as any;
    orderServiceSpy = TestBed.inject(OrderService) as any;

    feedbackServiceSpy.getFeedbackAllDetails.and.returnValue(of([mockFeedback]));
    restaurantServiceSpy.getAll.and.returnValue(of([]));
    menuItemServiceSpy.getAllMenuItems.and.returnValue(of([mockFeedback.menuItem]));
    authServiceSpy.getRole.and.returnValue('CUSTOMER');
    authServiceSpy.getLoggedInUser.and.returnValue(of(mockUser));
    orderServiceSpy.getOrdersByCustomer.and.returnValue(of(true));

    fixture.detectChanges();
  });

  // ✅ EXISTING

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form and load data on init', () => {
    expect(component.feedbackForm).toBeDefined();
    expect(component.feedback.length).toBe(1);
    expect(component.availableMenuItems.length).toBe(1);
    expect(component.loggedInUser?.username).toBe('john');
    expect(component.isCustomerAvailabe).toBeTrue();
  });

  // ✅ ✅ ✅ NEW 10 TEST CASES

  // it('should not submit invalid form', () => {
  //   component.feedbackForm.patchValue({ rating: null });
  //   component.onSubmit();
  //   expect(component.feedbackForm.invalid).toBeTrue();
  // });

  it('should submit valid feedback', () => {
    feedbackServiceSpy.submitFeedback.and.returnValue(of(mockFeedback));

    component.feedbackForm.patchValue({
      customerName: 'john',
      comment: 'Nice',
      rating: 5
    });

    component.onSubmit();

    expect(feedbackServiceSpy.submitFeedback).toHaveBeenCalled();
  });

  it('should reset form after submit', () => {
    feedbackServiceSpy.submitFeedback.and.returnValue(of(mockFeedback));
    component.onSubmit();
    expect(component.feedbackForm.pristine).toBeTrue();
  });

  it('should load feedback list', () => {
    expect(component.feedback.length).toBeGreaterThan(0);
  });

  it('should handle empty feedback response', () => {
    feedbackServiceSpy.getFeedbackAllDetails.and.returnValue(of([]));
    component.getFeedbackAllDetails();
    expect(component.feedback.length).toBe(0);
  });

  it('should set logged in user', () => {
    expect(component.loggedInUser?.username).toBe('john');
  });

  it('should set customer availability', () => {
    expect(component.isCustomerAvailabe).toBeTrue();
  });

  it('should load menu items', () => {
    expect(component.availableMenuItems.length).toBeGreaterThan(0);
  });

  it('should call service on submit', () => {
    feedbackServiceSpy.submitFeedback.and.returnValue(of(mockFeedback));
    component.feedbackForm.patchValue({ rating: 5, comment: 'Good' });

    component.onSubmit();

    expect(feedbackServiceSpy.submitFeedback).toHaveBeenCalled();
  });

  it('should call getFeedbackAllDetails on init', () => {
    expect(feedbackServiceSpy.getFeedbackAllDetails).toHaveBeenCalled();
  });
});