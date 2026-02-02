import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private apiUrl = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) {}

  getAllProducts(page: number = 0): Observable<any> {
    return this.http.get(`${this.apiUrl}/list?page=${page}`);
  }

  getProducts(): Observable<any> {
    return this.http.get(`${this.apiUrl}/list`);
  }

  getProductById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  searchProducts(keyword: string, page: number = 0): Observable<any> {
    return this.http.get(`${this.apiUrl}/search?keyword=${keyword}&page=${page}`);
  }

  createProduct(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  updateProduct(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getMyProducts(): Observable<any> {
    return this.http.get(`${this.apiUrl}/my-products`);
  }
}
