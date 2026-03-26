// app.routes.ts
// Defines all navigation routes for the SecureCart application.
// Protected routes use the authGuard to redirect unauthenticated users to login.

import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  // Default redirect — sends users to login page on first visit
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  // Login page — public, no guard needed
  { path: 'login', children: [] },

  // Dashboard — protected, requires valid JWT token
  // Component will be added in Story 4
  { path: 'dashboard', canActivate: [authGuard], children: [] },
];