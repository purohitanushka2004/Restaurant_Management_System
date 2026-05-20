import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Role, User } from '../../model/user';
import { Observable, of } from 'rxjs';
import { LoginRequest } from '../../model/loginrequest';
import { LoginResponse } from '../../model/login-response';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  register(user: any): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/api/auth/register`, user);
  }

  registerUser(user: User): Observable<User> {
    return this.register(user);
  }

  sendOtp(email: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/auth/send-otp`, { email }, { responseType: 'text' });
  }

  verifyOtp(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/auth/verify-otp`, data, { responseType: 'text' as 'json' });
  }

  login(loginRequest: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/api/auth/login`, loginRequest);
  }

  saveLoginData(response: LoginResponse): void {
    const normalizedRole = this.normalizeRole(response.role);

    localStorage.setItem('token', response.token);
    localStorage.setItem('userId', response.userId.toString());
    localStorage.setItem('username', response.username);
    localStorage.setItem('email', response.email);

    if (normalizedRole) {
      localStorage.setItem('role', normalizedRole);
    }
  }

   getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.baseUrl}/api/auth/users`,
      this.getAuthHeaders()
    );
  }

  private getAuthHeaders() {
    return {
      headers: {
        Authorization: `Bearer ${this.getToken()}`
      }
    };
  }
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getRole(): string | null {
    return this.normalizeRole(localStorage.getItem('role'));
  }

  getUserId(): number {
    return Number(localStorage.getItem('userId') || 0);
  }

  getUsername(): string | null {
    return localStorage.getItem('username');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getLoginStatus(): boolean {
    return this.isLoggedIn();
  }

  getLoggedInUser(): Observable<any> {
    const user = {
      id: this.getUserId(),
      userId: this.getUserId(),
      username: this.getUsername(),
      email: localStorage.getItem('email'),
      role: this.getRole()
    };

    return of(user);
  }

  logout(): void {
    localStorage.clear();
  }

  isAdmin(): boolean {
    return this.getRole() === 'ADMIN';
  }

  isManager(): boolean {
    return this.getRole() === 'MANAGER';
  }

  isCustomer(): boolean {
    return this.getRole() === 'CUSTOMER';
  }

  private normalizeRole(role: string | null): string | null {
    if (!role) {
      return null;
    }

    const cleaned = role.startsWith('ROLE_') ? role.slice(5) : role;
    return cleaned.toUpperCase();
  }
}