import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CustomerService {
  private readonly baseUrl = 'http://localhost:8081/api/customers';

  constructor(private http: HttpClient) {}

  getAddressDetails(page: number = 0, size: number = 20): Observable<any> {
    return this.http.get(`${this.baseUrl}/address-details`, {
      params: { page: page.toString(), size: size.toString() }
    });
  }

  getAddressDetailsAll(): Observable<any> {
    return this.http.get(`${this.baseUrl}/address-details/all`);
  }

  toggleVisibleWeb(customerId: number): Observable<any> {
    return this.http.patch(`${this.baseUrl}/${customerId}/toggle-visibleweb`, {});
  }
}
