// auth.guard.ts
// Protects routes from unauthenticated users.
// If a user tries to access a protected route without a valid token
// they get redirected to the login page automatically.

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';

export const authGuard: CanActivateFn = (route, state) => {
  // Inject the services we need
  const authService = inject(AuthService);
  const router = inject(Router);

  // Check if the user has a token in localStorage
  if (authService.isLoggedIn()) {
    // Token exists — allow navigation
    return true;
  }

  // No token — redirect to login page
  router.navigate(['/login']);
  return false;
};