import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../../../environments/environment';

// ...existing code...

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

// Interfaz para la respuesta del endpoint /customersiu/filter-by-customertype/idType
export interface CustomerIU {
  customerId: number;
  customerNumber: string;
  companyId: number;
  employeeId: number;
  expectedTurnover: number;
  numberOfEmployees: number;
  invoiceShipping: number;
  payConditionId: number;
  payMoralityId: number;
  customerType: {
    id: number;
    name: string;
  };
  branch: {
    id: number;
    name: string;
  };
  address: {
    id: number;
    name1: string;
    city: {
      name: string;
      zip: string;
      country: {
        name: string;
        prefix: number;
      };
    };
    imageBase64: string;
  };
  contact: {
    phone: string;
    fax: string;
    email: string;
    website: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  private apiUrl = `${environment.BACK_END_HOST_IUG}`;
  private customersByTypeCache = new Map<number, CustomerIU[]>();

  constructor(private http: HttpClient) {}

  /**
   * Obtiene customers por tipo con cache local para evitar llamadas repetidas.
   */
  getCustomersByCustomertypeCached(idType: number): Observable<CustomerIU[]> {
    if (this.customersByTypeCache.has(idType)) {
      return of(this.customersByTypeCache.get(idType)!);
    }
    return new Observable<CustomerIU[]>(observer => {
      this.getCustomersByCustomertype(idType).subscribe({
        next: (data) => {
          this.customersByTypeCache.set(idType, data);
          observer.next(data);
          observer.complete();
        },
        error: (err) => observer.error(err)
      });
    });
  }

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
  /**
   * Fetches customers from the new endpoint by customer type ID.
   * @param idType The customer type ID
   * @returns An Observable containing an array of Customer objects.
   */
  getCustomersByCustomertype(idType: number): Observable<CustomerIU[]> {
    return this.http.get<CustomerIU[]>(`${this.apiUrl}/customersiu/filter-by-customertype/${idType}`);
  }
}