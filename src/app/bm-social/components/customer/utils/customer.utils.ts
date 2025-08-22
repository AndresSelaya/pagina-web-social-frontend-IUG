import { inject, Injectable } from '@angular/core';
import { Observable, catchError, map, of, throwError } from 'rxjs';
import { CustomerService } from '../../../services/customer.service';

/**
 * Utility class for customer-related business logic and operations.
 * Works with CustomerService's reactive signals while providing additional functionality.
 */
@Injectable({ providedIn: 'root' })
export class CustomerUtils {
	private readonly customerService = inject(CustomerService);

	/**
	 * Gets customer address details with pagination
	 * @param page - Page number
	 * @param size - Page size
	 * @returns Observable emitting the address details
	 */
	getAddressDetails(page: number = 0, size: number = 2167): Observable<any> {
		return this.customerService.getAddressDetails(page, size).pipe(
			catchError(err => throwError(() => new Error('Failed to load customer address details')))
		);
	}


	getAddressDetailsAll(): Observable<any> {
		return this.customerService.getAddressDetailsAll().pipe(
			catchError(err => throwError(() => new Error('Failed to load all customer address details')))
		);
	}

	/**
	 * Toggle the visibleWeb property for a customer
	 * @param customerId - ID of the customer
	 * @returns Observable emitting the updated customer or status
	 */
	toggleVisibleWeb(customerId: number): Observable<any> {
		if (!customerId || customerId <= 0) {
			return throwError(() => new Error('Invalid customer ID'));
		}
		return this.customerService.toggleVisibleWeb(customerId).pipe(
			catchError(err => throwError(() => new Error('Failed to toggle visibleWeb')))
		);
	}

}
