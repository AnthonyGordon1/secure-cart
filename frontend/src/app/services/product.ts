// product.ts
// Handles all HTTP calls to the products API endpoint.

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../env/env';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Fetch all products
  getProducts() {
    return this.http.get<Product[]>(`${this.apiUrl}/api/products`);
  }

  // Fetch a single product by ID
  getProduct(id: number) {
    return this.http.get<Product>(`${this.apiUrl}/api/products/${id}`);
  }
}