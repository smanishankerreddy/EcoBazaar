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
import { CartService, GreenSuggestion } from '../../core/services/cart.service';
import { OrderService } from '../../core/services/order.service';
import { NotificationService } from '../../core/services/notification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
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
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cart: any = null;
  greenSuggestions: GreenSuggestion[] = [];
  displayedColumns: string[] = ['product', 'quantity', 'price', 'carbon', 'actions'];
  isLoading = false;
  errorMessage = '';

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.loadCart();
  }

  loadCart() {
    this.isLoading = true;
    this.cartService.getCart().subscribe({
      next: (data) => {
        this.cart = data;
        this.isLoading = false;
        if (data?.items?.length) {
          this.loadRecommendations();
        } else {
          this.greenSuggestions = [];
        }
      },
      error: (error) => {
        console.error('Error loading cart:', error);
        this.errorMessage = 'Failed to load cart';
        this.isLoading = false;
      }
    });
  }

  loadRecommendations() {
    this.cartService.getGreenRecommendations().subscribe({
      next: (list) => {
        this.greenSuggestions = list || [];
      },
      error: () => {
        this.greenSuggestions = [];
      }
    });
  }

  updateQuantity(itemId: number, quantity: number | string) {
    const q = typeof quantity === 'string' ? parseInt(quantity, 10) : quantity;
    if (isNaN(q) || q < 1) {
      this.removeItem(itemId);
      return;
    }
    this.cartService.updateItem(itemId, q).subscribe({
      next: (data) => {
        this.cart = data;
        this.notificationService.showSuccess('Cart updated successfully!');
        this.loadRecommendations();
      },
      error: (error) => {
        console.error('Error updating item:', error);
        const errorMsg = error.error?.message || 'Failed to update item';
        this.errorMessage = errorMsg;
        this.notificationService.showError(errorMsg);
      }
    });
  }

  removeItem(itemId: number) {
    this.cartService.removeItem(itemId).subscribe({
      next: (data) => {
        this.cart = data;
        this.notificationService.showSuccess('Item removed from cart');
        this.loadRecommendations();
      },
      error: (error) => {
        console.error('Error removing item:', error);
        const errorMsg = error.error?.message || 'Failed to remove item';
        this.errorMessage = errorMsg;
        this.notificationService.showError(errorMsg);
      }
    });
  }

  clearCart() {
    if (confirm('Are you sure you want to clear your cart?')) {
      this.cartService.clearCart().subscribe({
        next: (data) => {
          this.cart = data;
          this.notificationService.showSuccess('Cart cleared successfully!');
        },
        error: (error) => {
          console.error('Error clearing cart:', error);
          const errorMsg = error.error?.message || 'Failed to clear cart';
          this.errorMessage = errorMsg;
          this.notificationService.showError(errorMsg);
        }
      });
    }
  }

  checkout() {
    if (!this.cart || !this.cart.items || this.cart.items.length === 0) {
      this.errorMessage = 'Cart is empty';
      this.notificationService.showWarning('Your cart is empty. Add some products first!');
      return;
    }

    this.isLoading = true;
    this.orderService.createOrder({}).subscribe({
      next: (order) => {
        this.notificationService.showSuccess('Order placed successfully! Thank you for shopping with EcoBazaar.');
        this.router.navigate(['/orders', order.id]);
      },
      error: (error) => {
        console.error('Error creating order:', error);
        const errorMsg = error.error?.message || 'Failed to create order';
        this.errorMessage = errorMsg;
        this.notificationService.showError(errorMsg);
        this.isLoading = false;
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
