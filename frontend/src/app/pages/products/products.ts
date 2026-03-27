// products.ts
// Displays the product catalog in a responsive grid of Material cards.

import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ProductService, Product } from '../../services/product';


@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatBadgeModule,
    MatToolbarModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './products.html',
  styleUrls: ['./products.scss']
})
export class ProductsComponent implements OnInit {

  // All products fetched from the backend
  products: Product[] = [];

  // Cart stored as a map of product ID to quantity
  cart: Map<number, number> = new Map();

  // Loading state
  loading = true;

  // Error message
  error = '';

  constructor(
    private productService: ProductService,
    private router: Router,
    private cdr: ChangeDetectorRef

  ) { }

  ngOnInit() {
    this.productService.getProducts().subscribe({
      next: (products) => {
        console.log('Products received:', products);
        this.products = products;
        this.loading = false;
        // Force Angular to detect the changes
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log('Error:', err);
        this.error = 'Failed to load products';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  // Add a product to the cart
  addToCart(product: Product) {
    const current = this.cart.get(product.id) || 0;
    this.cart.set(product.id, current + 1);
  }
  // Remove one quantity of a product from the cart
  removeFromCart(productId: number) {
    const current = this.cart.get(productId) || 0;
    if (current <= 1) {
      // Remove entirely if quantity hits zero
      this.cart.delete(productId);
    } else {
      this.cart.set(productId, current - 1);
    }
  }

  // Get quantity of a specific product in the cart
  getQuantity(productId: number): number {
    return this.cart.get(productId) || 0;
  }

  // Get total number of items in cart
  get cartCount(): number {
    let total = 0;
    this.cart.forEach(qty => total += qty);
    return total;
  }

  // Format price as currency
  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  }

  // Check if a product is in the cart
  isInCart(productId: number): boolean {
    return this.cart.has(productId);
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}