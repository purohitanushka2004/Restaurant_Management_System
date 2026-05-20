import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RestaurantService } from '../app/shared/services/restaurant.service';
import { AuthService } from '../app/shared/services/auth.service';
import { environment } from '../environments/environment';
import { Restaurant } from '../app/model/restaurant';


describe('RestaurantService', () => {
  let service: RestaurantService;
  let httpMock: HttpTestingController;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  const apiUrl = environment.apiUrl;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('AuthService', ['getToken']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        RestaurantService,
        { provide: AuthService, useValue: spy }
      ]
    });

    service = TestBed.inject(RestaurantService);
    httpMock = TestBed.inject(HttpTestingController);
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    authServiceSpy.getToken.and.returnValue('mock-token');
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all restaurants', () => {
    const mockRestaurants: Restaurant[] = [
      { id: 1, name: 'Tasty Bites', location: 'Chennai' },
      { id: 2, name: 'Spice Hub', location: 'Mumbai' }
    ]as any;

    service.getAll().subscribe(restaurants => {
      expect(restaurants.length).toBe(2);
      expect(restaurants).toEqual(mockRestaurants);
    });

    const req = httpMock.expectOne(`${apiUrl}/api/restaurants`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe('Bearer mock-token');
    req.flush(mockRestaurants);
  });

  it('should fetch restaurant by ID', () => {
    const mockRestaurant: Restaurant = { id: 1, name: 'Tasty Bites', location: 'Chennai' }as any;

    service.getRestaurantById(1).subscribe(restaurant => {
      expect(restaurant).toEqual(mockRestaurant);
    });

    const req = httpMock.expectOne(`${apiUrl}/api/restaurants/1`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe('Bearer mock-token');
    req.flush(mockRestaurant);
  });

  it('should create a restaurant', () => {
    const newRestaurant: Restaurant = { id: 3, name: 'New Place', location: 'Delhi' }as any;

    service.create(newRestaurant).subscribe(restaurant => {
      expect(restaurant).toEqual(newRestaurant);
    });

    const req = httpMock.expectOne(`${apiUrl}/api/restaurants`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newRestaurant);
    expect(req.request.headers.get('Authorization')).toBe('Bearer mock-token');
    req.flush(newRestaurant);
  });

  it('should update a restaurant', () => {
    const updatedRestaurant: Restaurant = { id: 1, name: 'Updated Place', location: 'Chennai' }as any;

    service.updateRestaurant(1, updatedRestaurant).subscribe(restaurant => {
      expect(restaurant).toEqual(updatedRestaurant);
    });

    const req = httpMock.expectOne(`${apiUrl}/api/restaurants/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedRestaurant);
    expect(req.request.headers.get('Authorization')).toBe('Bearer mock-token');
    req.flush(updatedRestaurant);
  });
it('should handle error when fetching all restaurants', () => {
  service.getAll().subscribe({
    next: () => fail('expected an error'),
    error: (err) => {
      expect(err.status).toBe(500);
      expect(err.statusText).toBe('Server Error');
    }
  });

  const req = httpMock.expectOne(`${apiUrl}/api/restaurants`);
  expect(req.request.method).toBe('GET');

  req.flush('Error occurred', { status: 500, statusText: 'Server Error' });
});

  it('should delete a restaurant by ID', () => {
    service.deleteById(1).subscribe(response => {
      expect(response).toBeNull();
    });

    const req = httpMock.expectOne(`${apiUrl}/api/restaurants/1`);
    expect(req.request.method).toBe('DELETE');
    expect(req.request.headers.get('Authorization')).toBe('Bearer mock-token');
    req.flush(null);
  });
});
