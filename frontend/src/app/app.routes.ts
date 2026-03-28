// app.routes.ts
// Defines all navigation routes for the SecureCart application.
// Protected routes use the authGuard to redirect unauthenticated users to login.

import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  // Default redirect — sends users to login page on first visit
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  // Login page — public, no guard needed
  {
    path: 'login',
    loadComponent: () => import('./pages/auth/auth').then(m => m.AuthComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/auth/auth').then(m => m.AuthComponent)
  },
  {
    path: 'products',
    loadComponent: () => import('./pages/products/products').then(m => m.ProductsComponent),
    canActivate: [authGuard]
  },
  {
    path: 'cart',
    loadComponent: () => import('./pages/cart/cart').then(m => m.CartComponent),
    canActivate: [authGuard]
  },
  {
    path: 'orders',
    loadComponent: () => import('./pages/orders/orders').then(m => m.OrdersComponent),
    canActivate: [authGuard]
  },

  // Dashboard — protected, requires valid JWT token
  // Component will be added in Story 4
  { path: 'dashboard', canActivate: [authGuard], children: [] },
];