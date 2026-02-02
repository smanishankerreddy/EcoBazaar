import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CartService {
  private apiUrl = `${environment.apiUrl}/cart`;

  constructor(private http: HttpClient) {}

  getCart(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  addItem(productId: number, quantity: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/items`, { productId, quantity });
  }

  updateItem(itemId: number, quantity: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/items/${itemId}`, { quantity });
  }

  removeItem(itemId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/items/${itemId}`);
  }

  clearCart(): Observable<any> {
    return this.http.delete(`${this.apiUrl}/clear`);
  }

  addToCart(productId: number, quantity: number): Observable<any> {
    return this.addItem(productId, quantity);
  }

  getGreenRecommendations(): Observable<GreenSuggestion[]> {
    return this.http.get<GreenSuggestion[]>(`${this.apiUrl}/recommendations`);
  }
}

export interface GreenSuggestion {
  productId: number;
  productName: string;
  category: string;
  carbonImpact: number;
  price: number;
  imageUrl?: string;
  replacesProductId: number;
  replacesProductName: string;
  carbonSavedPerUnit: number;
  carbonSavedTotal: number;
}
