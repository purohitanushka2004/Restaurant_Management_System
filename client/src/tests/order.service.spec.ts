import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { OrderService } from '../app/shared/services/order.service';
import { AuthService } from '../app/shared/services/auth.service';
import { environment } from '../environments/environment';
import { Order } from '../app/model/order';


describe('OrderService', () => {
  let service: OrderService;
  let httpMock: HttpTestingController;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  const mockToken = 'mock-jwt-token';
  const baseUrl = environment.apiUrl;

  beforeEach(() => {
    const authSpy = jasmine.createSpyObj('AuthService', ['getToken']);
    authSpy.getToken.and.returnValue(mockToken);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        OrderService,
        { provide: AuthService, useValue: authSpy }
      ]
    });

    service = TestBed.inject(OrderService);
    httpMock = TestBed.inject(HttpTestingController);
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should place an order', () => {
    const mockOrder: Order = { id: 1, customerName: 'John', orderTime: new Date(), status: 'PLACED', totalAmount: 100, restaurant: { id: 1, name: '', location: '', address: '', email: '', phNumber: 0, menuItems: [] }, items: [], user: { id: 1, username: '', email: '', password: '', role: 'CUSTOMER' } }as any;

    service.placeOrder(mockOrder).subscribe(order => {
      expect(order.id).toBe(1);
    });

    const req = httpMock.expectOne(`${baseUrl}/api/orders`);
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
    req.flush(mockOrder);
  });

  it('should get all orders', () => {
    const mockOrders: Order[] = [{ id: 1, customerName: 'John', orderTime: new Date(), status: 'PLACED', totalAmount: 100, restaurant: { id: 1, name: '', location: '', address: '', email: '', phNumber: 0, menuItems: [] }, items: [], user: { id: 1, username: '', email: '', password: '', role: 'CUSTOMER' } }]as any;

    service.getAllOrders().subscribe(orders => {
      expect(orders.length).toBe(1);
    });

    const req = httpMock.expectOne(`${baseUrl}/api/orders`);
    expect(req.request.method).toBe('GET');
    req.flush(mockOrders);
  });

  it('should get order by ID', () => {
    const mockOrder: Order = { id: 1, customerName: 'John', orderTime: new Date(), status: 'PLACED', totalAmount: 100, restaurant: { id: 1, name: '', location: '', address: '', email: '', phNumber: 0, menuItems: [] }, items: [], user: { id: 1, username: '', email: '', password: '', role: 'CUSTOMER' } }as any;

    service.getOrderById(1).subscribe(order => {
      expect(order.id).toBe(1);
    });

    const req = httpMock.expectOne(`${baseUrl}/api/orders/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockOrder);
  });

  it('should get orders by customer ID', () => {
    const mockOrders = [{ id: 1, customerName: 'John' }];

    service.getOrdersByCustomer(1).subscribe(orders => {
      expect(orders.length).toBe(1);
    });

    const req = httpMock.expectOne(`${baseUrl}/api/orders/userId/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockOrders);
  });

  it('should cancel an order', () => {
    service.cancelOrder(1).subscribe(response => {
      expect(response).toEqual({ success: true });
    });

    const req = httpMock.expectOne(`${baseUrl}/api/orders/1/cancel`);
    expect(req.request.method).toBe('PUT');
    req.flush({ success: true });
  });
});
