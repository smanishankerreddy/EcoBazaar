import { Routes } from '@angular/router';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="padding: 20px;">
      <h1>Dashboard</h1>
      <div *ngIf="userInfo" style="margin-top: 20px;">
        <h2>Welcome, {{ userInfo.name }}!</h2>
        <p><strong>Email:</strong> {{ userInfo.email }}</p>
        <p><strong>Role:</strong> {{ userInfo.role }}</p>
        <p><strong>Phone:</strong> {{ userInfo.phone || 'Not provided' }}</p>
        <p><strong>Address:</strong> {{ userInfo.address || 'Not provided' }}</p>
      </div>
      <div *ngIf="!userInfo" style="margin-top: 20px;">
        <p>Loading user information...</p>
      </div>
    </div>
  `
})
export class DashboardComponent {
  userInfo: any = null;

  constructor() {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.userInfo = {
        name: localStorage.getItem('name') || 'User',
        email: localStorage.getItem('email') || 'user@example.com',
        role: localStorage.getItem('role') || 'USER',
        phone: '',
        address: ''
      };
    }
  }
}

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
  },
  {
    path: 'products',
    loadChildren: () => import('./features/products/products.routes').then(m => m.PRODUCT_ROUTES)
  },
  {
    path: 'profile',
    loadComponent: () => import('./features/profile/profile.component').then(m => m.ProfileComponent),
    canActivate: [authGuard]
  },
  {
    path: 'cart',
    loadComponent: () => import('./features/cart/cart.component').then(m => m.CartComponent),
    canActivate: [authGuard, roleGuard],
    data: { role: 'USER' }
  },
  {
    path: 'orders/:id',
    loadComponent: () => import('./features/orders/order-detail.component').then(m => m.OrderDetailComponent),
    canActivate: [authGuard, roleGuard],
    data: { role: 'USER' }
  },
  {
    path: 'seller',
    loadComponent: () => import('./features/seller/seller-dashboard.component').then(m => m.SellerDashboardComponent),
    canActivate: [authGuard, roleGuard],
    data: { role: 'SELLER' }
  },
  {
    path: 'admin',
    loadComponent: () => import('./features/admin/admin-dashboard.component').then(m => m.AdminDashboardComponent),
    canActivate: [authGuard, roleGuard],
    data: { role: 'ADMIN' }
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/user-dashboard.component').then(m => m.UserDashboardComponent),
    canActivate: [authGuard, roleGuard],
    data: { role: 'USER' }
  },
  {
    path: '',
    redirectTo: '/products',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/products'
  }
];
