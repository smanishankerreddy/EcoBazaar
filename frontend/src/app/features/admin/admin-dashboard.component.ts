import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';
import { UserService } from '../../core/services/user.service';
import { ProductService } from '../../core/services/product.service';
import { NotificationService } from '../../core/services/notification.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatChipsModule,
    MatTabsModule
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  users: any[] = [];
  products: any[] = [];
  pendingProducts: any[] = [];
  
  userColumns: string[] = ['name', 'email', 'role', 'ecoScore', 'status', 'actions'];
  productColumns: string[] = ['name', 'seller', 'price', 'status', 'actions'];

  constructor(
    private userService: UserService,
    private productService: ProductService,
    private notificationService: NotificationService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.loadUsers();
    this.loadProducts();
  }

  loadUsers() {
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users || [];
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.notificationService.showError('Failed to load users');
      }
    });
  }

  loadProducts() {
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products || [];
        this.pendingProducts = products.filter((p: any) => !p.isApproved && p.isActive) || [];
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.notificationService.showError('Failed to load products');
      }
    });
  }

  approveProduct(productId: number) {
    this.http.post(`${environment.apiUrl}/admin/approve-product/${productId}`, {}).subscribe({
      next: () => {
        this.notificationService.showSuccess('Product approved successfully!');
        this.loadProducts();
      },
      error: (error) => {
        console.error('Error approving product:', error);
        this.notificationService.showError('Failed to approve product');
      }
    });
  }

  deleteUser(userId: number) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(userId).subscribe({
        next: () => {
          this.notificationService.showSuccess('User deleted successfully!');
          this.loadUsers();
        },
        error: (error) => {
          console.error('Error deleting user:', error);
          this.notificationService.showError('Failed to delete user');
        }
      });
    }
  }

  deleteProduct(productId: number) {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(productId).subscribe({
        next: () => {
          this.notificationService.showSuccess('Product deleted successfully!');
          this.loadProducts();
        },
        error: (error) => {
          console.error('Error deleting product:', error);
          this.notificationService.showError('Failed to delete product');
        }
      });
    }
  }

  getRoleLabel(role: string): string {
    const roleMap: { [key: string]: string } = {
      'USER': 'User',
      'SELLER': 'Seller',
      'ADMIN': 'Admin'
    };
    return roleMap[role] || role;
  }
}
