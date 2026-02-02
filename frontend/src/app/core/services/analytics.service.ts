import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private apiUrl = `${environment.apiUrl}/analytics`;

  constructor(private http: HttpClient) {}

  getSalesAnalytics(): Observable<any> {
    return this.http.get(`${this.apiUrl}/sales`);
  }

  getCarbonReport(): Observable<any> {
    return this.http.get(`${this.apiUrl}/carbon`);
  }
}
