import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from './shared/services/auth.service';


@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

  constructor(private auth: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {

    // Check login first
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/login']);
      return false;
    }

    // Get expected roles from route data
    const expectedRoles = route.data['roles'] as string[];

    // If no roles defined → allow access (only login required)
    if (!expectedRoles || expectedRoles.length === 0) {
      return true;
    }

    const userRole = this.auth.getRole();

    // Check if user's role matches allowed roles
    if (expectedRoles.includes(userRole!)) {
      return true;
    }

    // If role not allowed → redirect
    this.router.navigate(['/login']);
    return false;
  }
}