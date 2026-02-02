import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../core/services/cart.service';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule
  ],
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.scss']
})
export class UserDashboardComponent implements OnInit {
  cart: any = null;
  displayedColumns: string[] = ['product', 'quantity', 'price', 'carbon', 'actions'];
  isLoading = false;
  errorMessage = '';

  constructor(
    private cartService: CartService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.loadCart();
  }

  loadCart() {
    this.isLoading = true;
    this.errorMessage = '';
    this.cartService.getCart().subscribe({
      next: (data) => {
        this.cart = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading cart:', error);
        this.errorMessage = 'Failed to load your cart';
        this.isLoading = false;
      }
    });
  }

  updateQuantity(itemId: number, quantity: number) {
    const qty = Number(quantity);
    if (!Number.isFinite(qty)) return;
    if (qty < 1) {
      this.removeItem(itemId);
      return;
    }
    this.cartService.updateItem(itemId, qty).subscribe({
      next: (data) => {
        this.cart = data;
        this.notificationService.showSuccess('Cart updated');
      },
      error: (error) => {
        console.error('Error updating item:', error);
        const msg = error.error?.message || 'Failed to update item';
        this.notificationService.showError(msg);
      }
    });
  }

  removeItem(itemId: number) {
    this.cartService.removeItem(itemId).subscribe({
      next: (data) => {
        this.cart = data;
        this.notificationService.showSuccess('Item removed');
      },
      error: (error) => {
        console.error('Error removing item:', error);
        const msg = error.error?.message || 'Failed to remove item';
        this.notificationService.showError(msg);
      }
    });
  }

  getTotalPrice(): number {
    return this.cart?.totalPrice || 0;
  }

  getTotalCarbon(): number {
    return this.cart?.totalCarbon || 0;
  }
}

