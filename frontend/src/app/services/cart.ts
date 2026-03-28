// cart.ts
// Manages cart state globally so it persists across page navigation.
// Uses a BehaviorSubject so any component can subscribe to cart changes.

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from './product';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../env/env';
import { AuthService } from '../services/auth';

export interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {

  // BehaviorSubject holds the current cart state and emits on every change
  private cartItems = new BehaviorSubject<CartItem[]>([]);

  // Observable that components subscribe to
  cart$ = this.cartItems.asObservable();

  // Add a product or increment its quantity
  addToCart(product: Product) {
    const current = this.cartItems.getValue();
    const existing = current.find(item => item.product.id === product.id);

    if (existing) {
      existing.quantity++;
      this.cartItems.next([...current]);
    } else {
      this.cartItems.next([...current, { product, quantity: 1 }]);
    }
  }

  // Remove one quantity or remove entirely if quantity hits zero
  removeFromCart(productId: number) {
    const current = this.cartItems.getValue();
    const existing = current.find(item => item.product.id === productId);

    if (!existing) return;

    if (existing.quantity <= 1) {
      this.cartItems.next(current.filter(item => item.product.id !== productId));
    } else {
      existing.quantity--;
      this.cartItems.next([...current]);
    }
  }

  // Get total number of items across all products
  getTotalCount(): number {
    return this.cartItems.getValue().reduce((sum, item) => sum + item.quantity, 0);
  }

  // Get total price
  getTotalPrice(): number {
    return this.cartItems.getValue().reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  }

  // Clear the cart
  clearCart() {
    this.cartItems.next([]);
  }

  // Get current items snapshot
  getItems(): CartItem[] {
    return this.cartItems.getValue();
  }
}