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
import { CartService } from '../../services/cart';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../env/env';
import { MatFormFieldModule } from '@angular/material/form-field';


@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatBadgeModule,
    MatToolbarModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule
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

  //Cart def
  cartCount = 0;

  constructor(
    private productService: ProductService,
    public router: Router,
    private cdr: ChangeDetectorRef,
    private cartService: CartService,
    private http: HttpClient,

  ) { }

ngOnInit() {
  this.cartService.cart$.subscribe(() => {
    this.cartCount = this.cartService.getTotalCount();
    this.cdr.detectChanges();
  });

  this.loadProducts();
}

loadProducts() {
  this.productService.getProducts().subscribe({
    next: (products) => {
      this.products = products;
      this.loading = false;
      this.cdr.detectChanges();
    },
    error: () => {
      this.error = 'Failed to load products';
      this.loading = false;
      this.cdr.detectChanges();
    }
  });
}


  // Add a product to the cart
  addToCart(product: Product) { this.cartService.addToCart(product); }

  // Remove one quantity of a product from the cart
  removeFromCart(productId: number) { this.cartService.removeFromCart(productId); }

  // Get quantity of a specific product in the cart
  getQuantity(productId: number): number {
    return this.cartService.getItems().find(i => i.product.id === productId)?.quantity || 0;
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
    return this.cartService.getItems().some(i => i.product.id === productId);
  }
  goToCart() { this.router.navigate(['/cart']); }

  searchQuery = '';

  searchProducts() {
    if (this.searchQuery.trim() === '') {
      // If empty search reload all products
      this.loadProducts();
      return;
    }
    this.http.get<Product[]>(`${environment.apiUrl}/api/products/search?q=${this.searchQuery}`)
      .subscribe({
        next: (products) => {
          this.products = products;
          this.cdr.detectChanges();
        },
        error: () => {
          this.error = 'Search failed';
          this.cdr.detectChanges();
        }
      });
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}