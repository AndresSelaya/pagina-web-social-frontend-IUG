import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class ContactPersonService {
	private baseUrl = 'http://localhost:8081/api';

	constructor(private http: HttpClient) {}

	/**
	 * Get contact person by addressId and contactPersonId
	 */
	getContactPersonById(addressId: number, contactPersonId: number): Observable<any> {
		return this.http.get(`${this.baseUrl}/contactpersons/${addressId}/${contactPersonId}`);
	}

	/**
	 * Get all contact persons (paginated)
	 */
	getAllContactPersons(page: number = 0, size: number = 3845): Observable<any> {
		return this.http.get(`${this.baseUrl}/addresses/contact-persons?page=${page}&size=${size}`);
	}

	/**
	 * Get all contact persons 
	 */
	getAllContactPerson(): Observable<any> {
		return this.http.get(`${this.baseUrl}/contactpersons/all`);
	}
	/**
	 * Toggle visibleWeb for a contact person (PATCH)
	 */
	toggleVisibleWeb(addressId: number, contactPersonId: number): Observable<any> {
		return this.http.patch(`${this.baseUrl}/contactpersons/${addressId}/${contactPersonId}/toggle-visibleweb`, {});
	}
}
