import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class StripeService {
  constructor(private http: HttpClient) {}

  createCheckoutSession(items: any[]) {
    return this.http.post<{url: string}>('http://localhost:8000/create-checkout-session', { items });
  }
}
