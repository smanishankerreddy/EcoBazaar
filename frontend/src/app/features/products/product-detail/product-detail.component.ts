import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { ProductService } from '../../../core/services/product.service';
import { CartService } from '../../../core/services/cart.service';
import { Product } from '../../../shared/models/product.model';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatChipsModule
  ],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadProduct(Number(id));
    }
  }

  loadProduct(id: number) {
    this.isLoading = true;
    this.productService.getProductById(id).subscribe({
      next: (product) => {
        this.product = product;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading product:', error);
        this.isLoading = false;
      }
    });
  }

  addToCart() {
    if (this.product) {
      this.cartService.addToCart(this.product.id, 1).subscribe({
        next: () => {
          console.log('Product added to cart');
        },
        error: (error) => {
          console.error('Error adding to cart:', error);
        }
      });
    }
  }

  /** Same sample images as product list - consistent per product id */
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
}
