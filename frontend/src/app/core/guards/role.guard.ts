import { inject } from '@angular/core';
import { CanActivateFn, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    router.navigate(['/auth/login']);
    return false;
  }

  const expectedRole = route.data['role'];
  if (!expectedRole) {
    return true; // No role requirement
  }

  const userRole = authService.getUserRole();
  
  // ADMIN can access everything
  if (userRole === 'ADMIN') {
    return true;
  }
  
  // Check if user has the required role
  if (userRole === expectedRole) {
    return true;
  } else {
    // Redirect based on user role
    if (userRole === 'SELLER') {
      router.navigate(['/seller']);
    } else if (userRole === 'USER') {
      router.navigate(['/products']);
    } else {
      router.navigate(['/products']);
    }
    return false;
  }
};
