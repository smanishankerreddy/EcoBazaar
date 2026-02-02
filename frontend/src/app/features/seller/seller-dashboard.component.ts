import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { ProductService } from '../../core/services/product.service';
import { NotificationService } from '../../core/services/notification.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-seller-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDialogModule,
    MatChipsModule
  ],
  templateUrl: './seller-dashboard.component.html',
  styleUrls: ['./seller-dashboard.component.scss']
})
export class SellerDashboardComponent implements OnInit {
  products: any[] = [];
  displayedColumns: string[] = ['name', 'price', 'stock', 'status', 'carbon', 'actions'];
  isAddingProduct = false;
  productForm: FormGroup;
  editingProduct: any = null;

  constructor(
    private productService: ProductService,
    private notificationService: NotificationService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      price: ['', [Validators.required, Validators.min(0.01)]],
      category: ['', [Validators.required]],
      carbonImpact: ['', [Validators.required, Validators.min(0)]],
      stockQuantity: ['', [Validators.required, Validators.min(0)]],
      ecoCertified: [false],
      ecoRating: ['GOOD', [Validators.required]],
      imageUrl: ['']
    });
  }

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getMyProducts().subscribe({
      next: (products: any[]) => {
        this.products = products || [];
      },
      error: (error) => {
        console.error('Error loading products:', error);
        // Fallback to filtering all products if endpoint doesn't exist yet
        this.productService.getProducts().subscribe({
          next: (allProducts: any[]) => {
            const userId = this.authService.getUserId();
            this.products = allProducts.filter((p: any) => p.sellerId == userId) || [];
          },
          error: () => {
            this.notificationService.showError('Failed to load products');
          }
        });
      }
    });
  }

  toggleAddProduct() {
    this.isAddingProduct = !this.isAddingProduct;
    this.editingProduct = null;
    if (this.isAddingProduct) {
      this.productForm.reset({
        ecoCertified: false,
        ecoRating: 'GOOD',
        stockQuantity: 0
      });
    }
  }

  editProduct(product: any) {
    this.editingProduct = product;
    this.isAddingProduct = true;
    this.productForm.patchValue({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      carbonImpact: product.carbonImpact,
      stockQuantity: product.stockQuantity,
      ecoCertified: product.ecoCertified,
      ecoRating: product.ecoRating,
      imageUrl: product.imageUrl || ''
    });
  }

  saveProduct() {
    if (this.productForm.valid) {
      const productData = {
        ...this.productForm.value,
        // sellerId will be set automatically by backend from authenticated user
      };

      const operation = this.editingProduct
        ? this.productService.updateProduct(this.editingProduct.id, productData)
        : this.productService.createProduct(productData);

      operation.subscribe({
        next: () => {
          this.notificationService.showSuccess(
            this.editingProduct ? 'Product updated successfully!' : 'Product created successfully!'
          );
          this.loadProducts();
          this.toggleAddProduct();
        },
        error: (error) => {
          console.error('Error saving product:', error);
          this.notificationService.showError('Failed to save product');
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

  getStatusBadge(product: any): string {
    if (!product.isActive) return 'Inactive';
    if (!product.isApproved) return 'Pending Approval';
    return 'Active';
  }

  getStatusColor(product: any): string {
    if (!product.isActive) return 'warn';
    if (!product.isApproved) return 'accent';
    return 'primary';
  }
}
