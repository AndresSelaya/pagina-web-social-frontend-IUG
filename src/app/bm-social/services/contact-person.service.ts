import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';


@Injectable({
	providedIn: 'root'
})

export class ContactPersonService {

	private readonly http = inject(HttpClient);
	private readonly baseUrl = `${environment.BACK_END_HOST_IUG}`;


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
