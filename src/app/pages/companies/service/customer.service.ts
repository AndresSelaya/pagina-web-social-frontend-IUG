import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface Customer {
  customerId: number;
  customerNumber: string;
  name1: string;
  name2: string | null;
  imageData?: string | null; // base64 string
}

export interface CustomerInfo {
  customerId: number;
  name1: string;
}

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  private apiUrl = `${environment.BACK_END_HOST_IUG}`;

  constructor(private http: HttpClient) {}

  /**
   * Fetches customers by customer type and address ID.
   * @param idType The customer type and address ID
   * @returns An Observable containing an array of Customer objects.
   */
  getCustomersByTypeAndAddress(idType: number): Observable<Customer[]> {
    return this.http.get<Customer[]>(`${this.apiUrl}/customers/by-customertype-and-address/${idType}`);
  }

  /**
   * Fetches all customers from the API.
   * @returns An Observable containing an array of Customer objects.
   */
  getCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(`${this.apiUrl}/customers`);
  }

  /**
   * Fetches a specific customer by its ID.
   * @param customerId The customer ID to fetch
   * @returns An Observable containing a single Customer object.
   */
  getCustomerById(customerId: number): Observable<Customer> {
    return this.http.get<Customer>(`${this.apiUrl}/customers/${customerId}`);
  }
}