// cart.ts
// Displays cart contents, quantities, and total price.

import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { CartService, CartItem } from '../../services/cart';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../env/env';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatButtonModule, MatIconModule, MatCardModule],
  templateUrl: './cart.html',
  styleUrls: ['./cart.scss']
})
export class CartComponent implements OnInit {

  items: CartItem[] = [];

  constructor(
    private cartService: CartService,
    public router: Router,
    private cdr: ChangeDetectorRef,
    private http: HttpClient,
    private authService: AuthService,
  ) { }

  ngOnInit() {
    this.cartService.cart$.subscribe(items => {
      this.items = items;
      this.cdr.detectChanges();
    });
  }

  removeFromCart(productId: number) { this.cartService.removeFromCart(productId); }
  addToCart(item: CartItem) { this.cartService.addToCart(item.product); }

  getTotalPrice(): string {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
      .format(this.cartService.getTotalPrice());
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);
  }

  goBack() { this.router.navigate(['/products']); }
  //TODO: Refactor this later. We had to wire this up to work
  checkout() {
    const token = this.authService.getToken();
    if (!token) return;

    // Decode JWT to get user ID
    const payload = JSON.parse(atob(token.split('.')[1]));

    const body = {
      userId: payload.id,
      items: this.items.map(i => ({ productId: i.product.id, quantity: i.quantity })),
      total: this.cartService.getTotalPrice()
    };

    this.http.post(`http://localhost:3000/api/checkout`, body).subscribe({
      next: () => {
        this.cartService.clearCart();
        this.router.navigate(['/orders']);
      },
      error: () => {
        console.error('Checkout failed');
      }
    });
  }
}