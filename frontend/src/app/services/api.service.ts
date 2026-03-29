import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../env/env';


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private expressBaseApiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  healthCheck() {
    return this.http.get(`${this.expressBaseApiUrl}/health`);
  }
}