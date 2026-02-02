import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { ProductService } from '../../../core/services/product.service';
import { CartService } from '../../../core/services/cart.service';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Router } from '@angular/router';
import { Product } from '../../../shared/models/product.model';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatChipsModule,
    MatIconModule
  ],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  searchTerm = '';
  selectedCategory = '';
  selectedEcoRating = '';
  categories: string[] = [];
  isLoading = false;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private authService: AuthService,
    private notificationService: NotificationService,
    private router: Router
  ) {
    console.log('ProductListComponent constructor called');
  }

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  ngOnInit() {
    console.log('ProductListComponent initialized');
    this.loadProducts();
  }

  loadProducts() {
    this.isLoading = true;
    this.productService.getProducts().subscribe({
      next: (products: Product[]) => {
        // Only show products that are active and approved by admin
        const visibleProducts = (products || []).filter(p => p?.isActive && p?.isApproved);

        this.products = visibleProducts;
        this.filteredProducts = visibleProducts;
        this.categories = [...new Set(visibleProducts.map(p => p.category).filter(c => c != null))] as string[];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.products = [];
        this.filteredProducts = [];
        this.isLoading = false;
        // Show error message to user
        alert('Failed to load products. Please make sure the backend is running on http://localhost:8080');
      }
    });
  }

  onSearch() {
    this.applyFilters();
  }

  onCategoryChange() {
    this.applyFilters();
  }

  onEcoRatingChange() {
    this.applyFilters();
  }

  applyFilters() {
    this.filteredProducts = this.products.filter(product => {
      // Defense in depth: even if something slips into `products`, don't render it
      if (!product?.isActive || !product?.isApproved) return false;

      const matchesSearch = !this.searchTerm || 
        product.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesCategory = !this.selectedCategory || product.category === this.selectedCategory;
      const matchesEcoRating = !this.selectedEcoRating || product.ecoRating === this.selectedEcoRating;
      
      return matchesSearch && matchesCategory && matchesEcoRating;
    });
  }

  /** Sample images from src/images - applied randomly per product (by id) for all products */
  readonly SAMPLE_IMAGES = ['/images/sampletest1.jpg', '/images/sampletest2.jpg'];

  getProductImageUrl(product: Product): string {
    if (product?.imageUrl && (product.imageUrl.includes('sampletest') || product.imageUrl.startsWith('/images/'))) {
      return product.imageUrl;
    }
    const index = (product?.id ?? 0) % this.SAMPLE_IMAGES.length;
    return this.SAMPLE_IMAGES[index];
  }

  getEcoRatingColor(rating: string): string {
    switch (rating) {
      case 'EXCELLENT': return 'green';
      case 'GOOD': return 'blue';
      case 'FAIR': return 'orange';
      case 'POOR': return 'red';
      default: return 'gray';
    }
  }

  addToCart(product: Product) {
    if (!this.authService.isLoggedIn()) {
      this.notificationService.showWarning('Please login to add items to cart.');
      this.router.navigate(['/auth/login']);
      return;
    }

    if (this.authService.getUserRole() !== 'USER') {
      this.notificationService.showWarning('Only users can add items to cart.');
      return;
    }

    this.cartService.addToCart(product.id, 1).subscribe({
      next: () => {
        this.notificationService.showSuccess(`${product.name} added to cart successfully!`);
      },
      error: (error) => {
        console.error('Error adding to cart:', error);
        const errorMsg = error.error?.message || 'Failed to add product to cart. Please try again.';
        this.notificationService.showError(errorMsg);
      }
    });
  }
}
