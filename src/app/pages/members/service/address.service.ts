import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface Address {
  addressId: number;
  version: number;
  name1: string;
  name2: string | null;
  name3: string | null;
}

export interface AddressWithCustomerInfo extends Address {
  customerName?: string;
  customerId?: number;
}

@Injectable({
  providedIn: 'root',
})
// ...existing code...
export class AddressService {
  private apiUrl = `${environment.BACK_END_HOST_IUG}`;

  constructor(private http: HttpClient) {}

  /**
   * Fetches the list of addresses from the API.
   * @returns An Observable containing an array of Address objects.
   */
  getAddresses(): Observable<Address[]> {
    return this.http.get<Address[]>(`${this.apiUrl}/addresses`);
  }

  /**
   * Fetches addresses by contact address ID.
   * @param contactAddressId The contact address ID to filter by
   * @returns An Observable containing an array of Address objects.
   */
  getAddressesByContactAddress(contactAddressId: number): Observable<Address[]> {
    return this.http.get<Address[]>(`${this.apiUrl}/addresses/by-contact-address/${contactAddressId}`);
  }

  /**
   * Fetches a specific address by its ID.
   * @param addressId The address ID to fetch
   * @returns An Observable containing a single Address object.
   */
  getAddressById(addressId: number): Observable<Address> {
    return this.http.get<Address>(`${this.apiUrl}/addresses/${addressId}`);
  }

  /**
   * Fetches the company name by contact address ID.
   * @param contactAddressId The contact address ID
   * @returns An Observable containing the company name as string
   */
  getCompanyName(contactAddressId: number): Observable<string> {
    return this.http.get(`${this.apiUrl}/addresses/${contactAddressId}`, { responseType: 'text' });
  }
}