import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { filter, Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatBadgeModule,
    MatDividerModule
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  cartItemCount = 0;
  private sub?: Subscription;

  constructor(
    public authService: AuthService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit() {
    // Refresh on initial load and after every navigation (covers login/register redirects)
    this.refreshUserState();
    this.sub = this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe(() => this.refreshUserState());
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  get userName(): string | null {
    return this.authService.getUserName();
  }

  get userRole(): string | null {
    return this.authService.getUserRole();
  }

  private refreshUserState() {
    this.loadCartCount();
  }

  loadCartCount() {
    if (this.authService.isLoggedIn() && this.userRole === 'USER') {
      this.cartService.getCart().subscribe({
        next: (cart) => {
          this.cartItemCount = cart?.items?.length || 0;
        },
        error: () => {
          this.cartItemCount = 0;
        }
      });
    } else {
      this.cartItemCount = 0;
    }
  }

  logout() {
    this.authService.logout();
  }

  getRoleLabel(role: string | null): string {
    if (!role) return '';
    const roleMap: { [key: string]: string } = {
      'USER': 'User',
      'SELLER': 'Seller',
      'ADMIN': 'Admin'
    };
    return roleMap[role] || role;
  }

  canAccessProducts(): boolean {
    return true; // Everyone can access products
  }

  canAccessCart(): boolean {
    return this.userRole === 'USER';
  }

  canAccessProfile(): boolean {
    return this.authService.isLoggedIn();
  }

  canAccessSeller(): boolean {
    return this.userRole === 'SELLER' || this.userRole === 'ADMIN';
  }

  canAccessAdmin(): boolean {
    return this.userRole === 'ADMIN';
  }
}
