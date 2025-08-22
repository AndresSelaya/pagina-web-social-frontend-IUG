import { inject, Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ContactPersonService } from '../../../services/contact-person.service';

@Injectable({ providedIn: 'root' })
export class ContactPersonUtils {
    private readonly contactPersonService = inject(ContactPersonService);

    /**
     * Get contact person by addressId and contactPersonId
     */
    getContactPersonById(addressId: number, contactPersonId: number): Observable<any> {
        if (!addressId || !contactPersonId) {
            return throwError(() => new Error('Invalid addressId or contactPersonId'));
        }
        return this.contactPersonService.getContactPersonById(addressId, contactPersonId).pipe(
            catchError(err => throwError(() => new Error('Failed to load contact person')))
        );
    }

    /**
     * Get all contact persons (paginated)
     */
    getAllContactPersons(page: number = 0, size: number = 3845): Observable<any> {
        return this.contactPersonService.getAllContactPersons(page, size).pipe(
            catchError(err => throwError(() => new Error('Failed to load contact persons')))
        );
    }

    /**
     * Get all contact persons 
     */
    getAllContactPerson(): Observable<any> {
        return this.contactPersonService.getAllContactPerson().pipe(
            catchError(err => throwError(() => new Error('Failed to load all contact persons')))
        );
    }

    /**
     * Toggle visibleWeb for a contact person (PATCH)
     */
    toggleVisibleWeb(addressId: number, contactPersonId: number): Observable<any> {
        if (!addressId || !contactPersonId) {
            return throwError(() => new Error('Invalid addressId or contactPersonId'));
        }
        return this.contactPersonService.toggleVisibleWeb(addressId, contactPersonId).pipe(
            catchError(err => throwError(() => new Error('Failed to toggle visibleWeb')))
        );
    }

    // Utilidades existentes
    formatContactPersonName(firstName: string, lastName: string): string {
        return `${firstName} ${lastName}`;
    }

    validateContactPersonEmail(email: string): boolean {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    }

    generateContactPersonId(): string {
        return 'CP-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    }
}