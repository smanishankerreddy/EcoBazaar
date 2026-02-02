import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { OrderService } from '../../core/services/order.service';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="order-detail-container">
      <mat-card class="order-card" *ngIf="!isLoading && order">
        <mat-card-header>
          <mat-card-title>Order confirmed</mat-card-title>
          <mat-card-subtitle>Order #{{ order.id }} · {{ order.orderDate | date:'medium' }}</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <div class="sustainability-insight" *ngIf="order.totalCarbon != null">
            <mat-icon>eco</mat-icon>
            <div>
              <strong>Sustainability insight</strong>
              <p>This order’s carbon footprint is <strong>{{ order.totalCarbon | number:'1.2-2' }} kg CO₂e</strong>. Emission data is stored with your order.</p>
            </div>
          </div>

          <div class="order-summary">
            <div class="summary-row">
              <span>Total price</span>
              <strong>\${{ (order.totalPrice ?? 0) | number:'1.2-2' }}</strong>
            </div>
            <div class="summary-row carbon-row">
              <span>Total carbon footprint</span>
              <strong class="carbon-total">{{ order.totalCarbon | number:'1.2-2' }} kg CO₂e</strong>
            </div>
          </div>

          <h3>Items</h3>
          <ul class="order-items" *ngIf="order.items?.length">
            <li *ngFor="let item of order.items" class="order-item">
              <span class="item-name">{{ item.productName }}</span>
              <span class="item-qty">× {{ item.quantity }}</span>
              <span class="item-carbon">{{ (item.carbonImpact ?? 0) | number:'1.2-2' }} kg CO₂e/unit</span>
            </li>
          </ul>
        </mat-card-content>
        <mat-card-actions>
          <button mat-raised-button color="primary" routerLink="/products">Continue shopping</button>
          <button mat-button routerLink="/dashboard">My dashboard</button>
        </mat-card-actions>
      </mat-card>

      <div *ngIf="isLoading" class="loading">Loading order...</div>
      <div *ngIf="!isLoading && errorMessage" class="error-message">{{ errorMessage }}</div>
      <div *ngIf="!isLoading && !order && !errorMessage" class="not-found">Order not found.</div>
    </div>
  `,
  styles: [`
    .order-detail-container { padding: 24px; max-width: 700px; margin: 0 auto; }
    .order-card { padding: 24px; }
    .sustainability-insight {
      display: flex;
      gap: 16px;
      align-items: flex-start;
      background: #e8f5e9;
      border: 1px solid #c8e6c9;
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 24px;
    }
    .sustainability-insight mat-icon { color: #2e7d32; font-size: 32px; width: 32px; height: 32px; }
    .sustainability-insight p { margin: 8px 0 0; color: #333; }
    .order-summary {
      border-top: 1px solid #eee;
      padding-top: 16px;
      margin-bottom: 24px;
    }
    .summary-row { display: flex; justify-content: space-between; padding: 8px 0; }
    .carbon-row { border-top: 1px solid #eee; margin-top: 8px; padding-top: 8px; }
    .carbon-total { color: #2e7d32; }
    .order-items { list-style: none; padding: 0; margin: 0 0 24px 0; }
    .order-item {
      display: flex;
      gap: 12px;
      padding: 8px 0;
      border-bottom: 1px solid #f0f0f0;
    }
    .item-name { flex: 1; }
    .item-qty { color: #666; }
    .item-carbon { color: #2e7d32; font-size: 13px; }
    .loading, .error-message, .not-found { text-align: center; padding: 40px; }
    .error-message { color: #c62828; }
  `]
})
export class OrderDetailComponent implements OnInit {
  order: any = null;
  isLoading = false;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isLoading = true;
      this.orderService.getOrderById(+id).subscribe({
        next: (data) => {
          this.order = data;
          this.isLoading = false;
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Failed to load order';
          this.isLoading = false;
        }
      });
    }
  }
}
