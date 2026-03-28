// auth.interceptor.ts
// Intercepts every outgoing HTTP request and attaches the JWT token
// if one exists in localStorage. This runs automatically on every
// request so you never have to manually add the token in each service.

import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Get the AuthService instance using Angular's inject function
  const authService = inject(AuthService);

  // Read the JWT token from localStorage
  const token = authService.getToken();

  // If a token exists, clone the request and add the Authorization header
  // HTTP requests are immutable in Angular so we cannot modify them directly
  if (token) {
    const clonedReq = req.clone({
      // Bearer is the standard prefix for JWT tokens in Authorization headers
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    // Pass the cloned request with the token attached
    return next(clonedReq);
  }

  // If no token exists, pass the original request through unchanged
  return next(req);
};