import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { RestaurantComponent } from '../app/component/restaurant/restaurant.component';
import { RestaurantService } from '../app/shared/services/restaurant.service';
import { AuthService } from '../app/shared/services/auth.service';
import { Restaurant } from '../app/model/restaurant';
import { User } from '../app/model/user';
import { FilterRestaurantsPipe } from '../app/filter-restaurants.pipe';


describe('RestaurantComponent', () => {
  let component: RestaurantComponent;
  let fixture: ComponentFixture<RestaurantComponent>;
  let restaurantServiceSpy: jasmine.SpyObj<RestaurantService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  const mockRestaurants: Restaurant[] = [
    { id: 1, name: 'Food Hub', address: '123 Street', location: 'City', email: 'food@example.com', phNumber: 9876543210, menuItems: [] }
  ]as any;

  const mockUsers: User[] = [
    { id: 1, username: 'admin', email: 'admin@example.com', password: '', role: 'ADMIN' }
  ]as any;

  beforeEach(async () => {
    const restaurantSpy = jasmine.createSpyObj('RestaurantService', ['getAll', 'create', 'updateRestaurant', 'deleteById', 'getUserDetails']);
    const authSpy = jasmine.createSpyObj('AuthService', ['getRole', 'logout']);
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [RestaurantComponent,FilterRestaurantsPipe ],
      imports: [ReactiveFormsModule, FormsModule, HttpClientTestingModule],
      providers: [
        { provide: RestaurantService, useValue: restaurantSpy },
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerMock },
        
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RestaurantComponent);
    component = fixture.componentInstance;
    restaurantServiceSpy = TestBed.inject(RestaurantService) as jasmine.SpyObj<RestaurantService>;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    authServiceSpy.getRole.and.returnValue('ADMIN');
    restaurantServiceSpy.getAll.and.returnValue(of(mockRestaurants));
    restaurantServiceSpy.getUserDetails.and.returnValue(of(mockUsers));
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load restaurants on init', () => {
    component.ngOnInit();
    expect(component.restaurants.length).toBe(1);
    expect(component.restaurants[0].name).toBe('Food Hub');
    expect(restaurantServiceSpy.getAll).toHaveBeenCalled();
  });

  it('should submit new restaurant', () => {
    restaurantServiceSpy.create.and.returnValue(of(mockRestaurants[0]));
    component.restaurantForm.setValue({
      name: 'New Place',
      address: '456 Street',
      location: 'Town',
      email: 'new@example.com',
      phNumber: '1234567890',
      menuItems: []
    });

    component.onSubmit();
    expect(restaurantServiceSpy.create).toHaveBeenCalled();
  });

  it('should edit restaurant and patch form', () => {
    component.editRestaurant(mockRestaurants[0]);
    expect(component.editingId).toBe(1);
    expect(component.restaurantForm.value.name).toBe('Food Hub');
  });

  it('should cancel edit and reset form', () => {
    component.cancelEdit();
    expect(component.editingId).toBeNull();
    expect(component.restaurantForm.value.name).toBeNull();
  });

  it('should delete restaurant', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    restaurantServiceSpy.deleteById.and.returnValue(of());
    component.restaurants = [...mockRestaurants];

    component.deleteRestaurant(1);
    expect(restaurantServiceSpy.deleteById).toHaveBeenCalledWith(1);
    expect(component.restaurants.length).toBe(1);
  });

  it('should logout and navigate to login', () => {
    component.logout();
    expect(authServiceSpy.logout).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should fetch user role details', () => {
    component.getUserRoleDetails();
    expect(component.users.length).toBe(1);
    expect(component.users[0].username).toBe('admin');
    expect(restaurantServiceSpy.getUserDetails).toHaveBeenCalled();
  });
});
