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
    private router: Router,
    private cdr: ChangeDetectorRef
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
  checkout() { this.router.navigate(['/checkout']); }
}