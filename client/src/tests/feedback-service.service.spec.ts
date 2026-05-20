import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FeedbackService } from '../app/shared/services/feedback-service.service';
import { AuthService } from '../app/shared/services/auth.service';
import { environment } from '../environments/environment';
import { Feedback } from '../app/model/feedback';

describe('FeedbackService', () => {
  let service: FeedbackService;
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
        FeedbackService,
        { provide: AuthService, useValue: authSpy }
      ]
    });

    service = TestBed.inject(FeedbackService);
    httpMock = TestBed.inject(HttpTestingController);
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  // ✅ EXISTING TESTS

  it('should submit feedback', () => {
    const mockFeedback: Feedback = {} as any;

    service.submitFeedback(mockFeedback).subscribe(response => {
      expect(response).toEqual({ success: true });
    });

    const req = httpMock.expectOne(`${baseUrl}/api/feedback`);
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
    req.flush({ success: true });
  });

  it('should get feedback by menu item ID', () => {
    service.getFeedbackByMenuItem(1).subscribe(res => {
      expect(res.length).toBe(1);
    });

    const req = httpMock.expectOne(`${baseUrl}/api/feedback/menu/1`);
    expect(req.request.method).toBe('GET');
    req.flush([{}]);
  });

  it('should get all feedback details', () => {
    service.getFeedbackAllDetails().subscribe(res => {
      expect(res.length).toBe(1);
    });

    const req = httpMock.expectOne(`${baseUrl}/api/feedback`);
    req.flush([{}]);
  });

  // ✅ ✅ ✅ NEW 10 TEST CASES

  it('should include Authorization header in GET all', () => {
    service.getFeedbackAllDetails().subscribe();

    const req = httpMock.expectOne(`${baseUrl}/api/feedback`);
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
    req.flush([]);
  });

  it('should include Authorization header in GET by menu item', () => {
    service.getFeedbackByMenuItem(2).subscribe();

    const req = httpMock.expectOne(`${baseUrl}/api/feedback/menu/2`);
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
    req.flush([]);
  });

  it('should handle empty response for getFeedbackAllDetails', () => {
    service.getFeedbackAllDetails().subscribe(res => {
      expect(res.length).toBe(0);
    });

    const req = httpMock.expectOne(`${baseUrl}/api/feedback`);
    req.flush([]);
  });

  it('should handle empty response for getFeedbackByMenuItem', () => {
    service.getFeedbackByMenuItem(5).subscribe(res => {
      expect(res.length).toBe(0);
    });

    const req = httpMock.expectOne(`${baseUrl}/api/feedback/menu/5`);
    req.flush([]);
  });

  it('should handle error on submitFeedback', () => {
    service.submitFeedback({} as Feedback).subscribe({
      error: err => expect(err.status).toBe(500)
    });

    const req = httpMock.expectOne(`${baseUrl}/api/feedback`);
    req.flush('Error', { status: 500, statusText: 'Server Error' });
  });

  it('should handle error on getFeedbackAllDetails', () => {
    service.getFeedbackAllDetails().subscribe({
      error: err => expect(err.status).toBe(500)
    });

    const req = httpMock.expectOne(`${baseUrl}/api/feedback`);
    req.flush('Error', { status: 500, statusText: 'Server Error' });
  });

  it('should handle error on getFeedbackByMenuItem', () => {
    service.getFeedbackByMenuItem(1).subscribe({
      error: err => expect(err.status).toBe(404)
    });

    const req = httpMock.expectOne(`${baseUrl}/api/feedback/menu/1`);
    req.flush('Not found', { status: 404, statusText: 'Not Found' });
  });

  it('should call correct URL for submitFeedback', () => {
    service.submitFeedback({} as Feedback).subscribe();

    const req = httpMock.expectOne(`${baseUrl}/api/feedback`);
    expect(req.request.url).toContain('/api/feedback');
    req.flush({});
  });

  it('should use GET method for getFeedbackAllDetails', () => {
    service.getFeedbackAllDetails().subscribe();

    const req = httpMock.expectOne(`${baseUrl}/api/feedback`);
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('should use GET method for getFeedbackByMenuItem', () => {
    service.getFeedbackByMenuItem(3).subscribe();

    const req = httpMock.expectOne(`${baseUrl}/api/feedback/menu/3`);
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });
});