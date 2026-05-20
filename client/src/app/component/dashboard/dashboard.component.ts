import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { RestaurantService } from '../../shared/services/restaurant.service';
import { OrderService } from '../../shared/services/order.service';
import { FeedbackService } from '../../shared/services/feedback-service.service';
import { MenuItemService } from '../../shared/services/menu-item.service';

import { User } from '../../model/user';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  username: string = 'User';
  currentRole: string = 'CUSTOMER';
  activeTab: string = 'customer-order';
  sidebarCollapsed: boolean = false;
  currentDate: string = '';

  restaurants: any[] = [];
  orders: any[] = [];
  feedback: any[] = [];
  menuItems: any[] = [];
  assignments: any[] = [];
  customers: User[] = [];

  featuredDishes = [
    {
      name: 'Truffle Pasta',
      desc: 'Handmade pasta with black truffle & parmesan',
      img: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=600&q=80',
      tag: 'Chef\'s Pick',
      rating: 4.9
    },
    {
      name: 'Wagyu Steak',
      desc: 'A5 Japanese beef, 200g, herb butter',
      img: 'https://images.unsplash.com/photo-1558030006-450675393462?w=600&q=80',
      tag: 'Premium',
      rating: 4.8
    },
    {
      name: 'Grilled Salmon',
      desc: 'Atlantic salmon, citrus glaze, micro herbs',
      img: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&q=80',
      tag: 'Healthy',
      rating: 4.7
    },
    {
      name: 'Artisan Pizza',
      desc: 'Wood-fired, San Marzano tomatoes, buffalo mozzarella',
      img: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&q=80',
      tag: 'Bestseller',
      rating: 4.9
    },
    {
      name: 'Fresh Sushi',
      desc: 'Chef\'s 12-piece omakase platter',
      img: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=600&q=80',
      tag: 'Japanese',
      rating: 4.8
    },
    {
      name: 'Lava Chocolate Cake',
      desc: 'Warm molten centre, vanilla bean ice cream',
      img: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=600&q=80',
      tag: 'Dessert',
      rating: 5.0
    }
  ];

  constructor(
    private router: Router,
    private restaurantService: RestaurantService,
    private orderService: OrderService,
    private feedbackService: FeedbackService,
    private menuItemService: MenuItemService
  ) {}

  ngOnInit(): void {
    this.resolveUserAndRole();
    this.setActiveTabForRole();
    this.setCurrentDate();
    this.loadDashboardData();
  }

  private resolveUserAndRole(): void {
    this.username =
      localStorage.getItem('username') ||
      localStorage.getItem('userName') ||
      'User';

    const rawRole =
      localStorage.getItem('role') ||
      localStorage.getItem('userRole') ||
      '';

    this.currentRole = this.normalizeRole(rawRole);

    if (!this.currentRole || this.currentRole === 'CUSTOMER') {
      const token =
        localStorage.getItem('token') ||
        localStorage.getItem('jwtToken') ||
        '';

      if (token) {
        const decoded = this.decodeJwt(token);
        if (decoded) {
          const jwtRole =
            decoded['role'] ||
            decoded['roles'] ||
            decoded['userRole'] ||
            decoded['authorities'] ||
            '';

          const resolvedFromJwt = this.normalizeRole(
            Array.isArray(jwtRole) ? jwtRole[0] : jwtRole
          );

          if (resolvedFromJwt) {
            this.currentRole = resolvedFromJwt;
          }

          if (this.username === 'User') {
            this.username =
              decoded['sub'] ||
              decoded['username'] ||
              decoded['name'] ||
              'User';
          }
        }
      }
    }
  }

  private normalizeRole(raw: string): string {
    if (!raw) return 'CUSTOMER';
    const upper = String(raw).trim().toUpperCase();
    const stripped = upper.startsWith('ROLE_') ? upper.replace('ROLE_', '') : upper;
    if (['ADMIN', 'MANAGER', 'CUSTOMER'].includes(stripped)) return stripped;
    return 'CUSTOMER';
  }

  private decodeJwt(token: string): any {
    try {
      const payload = token.split('.')[1];
      const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
      return JSON.parse(decoded);
    } catch {
      return null;
    }
  }

  private setActiveTabForRole(): void {
    if (this.isAdmin()) {
      this.activeTab = 'admin-overview';
    } else if (this.isManager()) {
      this.activeTab = 'manager-overview';
    } else {
      this.activeTab = 'customer-home';
    }
  }

  private setCurrentDate(): void {
    const now = new Date();
    this.currentDate = now.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  private loadDashboardData(): void {
    if (this.isAdmin() || this.isManager()) {
      this.restaurantService.getAll().subscribe({
        next: (data: any[]) => { this.restaurants = data || []; },
        error: () => { this.restaurants = []; }
      });

      this.loadCustomers();

      if (this.isAdmin()) {
        this.restaurantService.getAssignments().subscribe({
          next: (data: any[]) => { this.assignments = data || []; },
          error: () => { this.assignments = []; }
        });
      }
    }

    this.orderService.getAllOrders().subscribe({
      next: (data: any[]) => { this.orders = data || []; },
      error: () => { this.orders = []; }
    });

    if (this.isAdmin() || this.isManager()) {
      this.feedbackService.getAllFeedbacks().subscribe({
        next: (data: any[]) => { this.feedback = data || []; },
        error: () => { this.feedback = []; }
      });
    }

    if (this.isManager()) {
      this.menuItemService.getAll().subscribe({
        next: (data: any[]) => { this.menuItems = data || []; },
        error: () => { this.menuItems = []; }
      });
    }
  }

  private loadCustomers(): void {
    this.restaurantService.getUserDetails().subscribe({
      next: (data: User[]) => {
        this.customers = data.filter((user: User) => {
          const role = String(user.role || '').trim().toUpperCase().replace('ROLE_', '');
          return role === 'CUSTOMER';
        });
      },
      error: () => { this.customers = []; }
    });
  }

  isAdmin(): boolean { return this.currentRole === 'ADMIN'; }
  isManager(): boolean { return this.currentRole === 'MANAGER'; }
  isCustomer(): boolean { return this.currentRole === 'CUSTOMER'; }

  setTab(tab: string): void { this.activeTab = tab; }
  toggleSidebar(): void { this.sidebarCollapsed = !this.sidebarCollapsed; }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  goToRestaurant(): void { this.router.navigate(['/restaurant']); }
  goToAssignManager(): void { this.router.navigate(['/assign-manager']); }
  goToMenuItems(): void { this.router.navigate(['/menu-item']); }
  goToOrders(): void { this.router.navigate(['/order']); }
  goToFeedback(): void { this.router.navigate(['/feedback']); }
  goToCustomers(): void { this.activeTab = 'manager-customers'; }

  get userInitial(): string {
    return this.username ? this.username.charAt(0).toUpperCase() : 'U';
  }

  get roleBadgeLabel(): string {
    switch (this.currentRole) {
      case 'ADMIN': return 'Administrator';
      case 'MANAGER': return 'Manager';
      case 'CUSTOMER': return 'Customer';
      default: return this.currentRole;
    }
  }

  get pageTitle(): string {
    if (this.isAdmin()) return 'Admin Control Center';
    if (this.isManager()) return 'Manager Operations';
    return 'Let Me Dine';
  }

  get recentRestaurants(): any[] { return this.restaurants.slice(0, 5); }
  get recentOrders(): any[] { return this.orders.slice(0, 5); }
  get recentFeedback(): any[] { return this.feedback.slice(0, 5); }
  get recentMenuItems(): any[] { return this.menuItems.slice(0, 5); }
  get recentCustomers(): User[] { return this.customers.slice(0, 5); }

  get pendingOrdersCount(): number {
    return this.orders.filter(o => o.status?.toUpperCase() === 'PENDING').length;
  }
  get processingOrdersCount(): number {
    return this.orders.filter(o => o.status?.toUpperCase() === 'PROCESSING').length;
  }
  get deliveredOrdersCount(): number {
    return this.orders.filter(o => o.status?.toUpperCase() === 'DELIVERED').length;
  }
  get cancelledOrdersCount(): number {
    return this.orders.filter(o => o.status?.toUpperCase() === 'CANCELLED').length;
  }

  get pendingOrdersPercent(): number {
    return this.orders.length ? Math.round((this.pendingOrdersCount / this.orders.length) * 100) : 0;
  }
  get processingOrdersPercent(): number {
    return this.orders.length ? Math.round((this.processingOrdersCount / this.orders.length) * 100) : 0;
  }
  get deliveredOrdersPercent(): number {
    return this.orders.length ? Math.round((this.deliveredOrdersCount / this.orders.length) * 100) : 0;
  }
  get cancelledOrdersPercent(): number {
    return this.orders.length ? Math.round((this.cancelledOrdersCount / this.orders.length) * 100) : 0;
  }
}
