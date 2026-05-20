import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MenuItemService } from '../app/shared/services/menu-item.service';
import { AuthService } from '../app/shared/services/auth.service';
import { environment } from '../environments/environment';
import { MenuItem } from '../app/model/menu-item';


describe('MenuItemService', () => {
  let service: MenuItemService;
  let httpMock: HttpTestingController;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  const apiUrl = environment.apiUrl;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('AuthService', ['getToken']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        MenuItemService,
        { provide: AuthService, useValue: spy }
      ]
    });

    service = TestBed.inject(MenuItemService);
    httpMock = TestBed.inject(HttpTestingController);
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    authServiceSpy.getToken.and.returnValue('mock-token');
  });

  afterEach(() => {
    httpMock.verify();
  });


  it('should fetch all menu items', () => {
    const mockItems: MenuItem[] = [
      { id: 1, name: 'Pizza', price: 10 },
      { id: 2, name: 'Burger', price: 8 }
    ]as any;

    service.getAllMenuItems().subscribe(items => {
      expect(items.length).toBe(2);
      expect(items).toEqual(mockItems);
    });

    const req = httpMock.expectOne(`${apiUrl}/api/menuItems`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe('Bearer mock-token');
    req.flush(mockItems);
  });

  it('should fetch a menu item by ID', () => {
    const mockItem: MenuItem = { id: 1, name: 'Pizza', price: 10 } as any;

    service.getMenuItemById(1).subscribe(item => {
      expect(item).toEqual(mockItem);
    });

    const req = httpMock.expectOne(`${apiUrl}/api/menuItems/1`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe('Bearer mock-token');
    req.flush(mockItem);
  });

  it('should add a new menu item', () => {
    const newItem: MenuItem = { id: 3, name: 'Pasta', price: 12 }as any;

    service.addMenuItem(newItem).subscribe(item => {
      expect(item).toEqual(newItem);
    });

    const req = httpMock.expectOne(`${apiUrl}/api/menuItems`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newItem);
    expect(req.request.headers.get('Authorization')).toBe('Bearer mock-token');
    req.flush(newItem);
  });

  it('should update a menu item', () => {
    const updatedItem: MenuItem = { id: 1, name: 'Pizza Deluxe', price: 15 }as any;

    service.updateMenuItem(1, updatedItem).subscribe(item => {
      expect(item).toEqual(updatedItem);
    });

    const req = httpMock.expectOne(`${apiUrl}/api/menuItems/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedItem);
    expect(req.request.headers.get('Authorization')).toBe('Bearer mock-token');
    req.flush(updatedItem);
  });

  it('should delete a menu item', () => {
    service.deleteMenuItem(1).subscribe(response => {
      expect(response).toBeNull();
    });

    const req = httpMock.expectOne(`${apiUrl}/api/menuItems/1`);
    expect(req.request.method).toBe('DELETE');
    expect(req.request.headers.get('Authorization')).toBe('Bearer mock-token');
    req.flush(null);
  });
});
