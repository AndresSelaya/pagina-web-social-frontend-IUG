import { EnvironmentInjector, Injectable, inject } from '@angular/core';
import { Observable, catchError, filter, map, take, throwError, switchMap } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';
import { Salutation, CreateSalutationRequest, UpdateSalutationRequest } from '../../../interfaces/salutation';
import { SalutationService } from '../../../services/salutation.service';

/**
 * Utility class for salutation-related business logic and operations.
 * Works with SalutationService's reactive signals while providing additional functionality.
 */
@Injectable({ providedIn: 'root' }) 
export class SalutationUtils {
  private readonly salutationService = inject(SalutationService);
  private readonly injector = inject(EnvironmentInjector);

  /**
   * Gets a salutation by ID with proper error handling
   * @param id - ID of the salutation to retrieve
   * @returns Observable emitting the salutation or undefined if not found
   */
  getSalutationById(id: number): Observable<Salutation | undefined> {
    if (!id || id <= 0) {
      return throwError(() => new Error('Invalid salutation ID'));
    }

    return this.salutationService.getSalutationById(id).pipe(
      catchError(err => {
        console.error('Error fetching salutation:', err);
        return throwError(() => new Error('Failed to load salutation'));
      })
    );
  }

  /**
   * Creates a new salutation with validation
   * @param salutationText - Text for the new salutation
   * @param companyId - Company ID (defaults to 1)
   * @returns Observable that emits the created salutation
   */
  createNewSalutation(salutationText: string, companyId: number = 1): Observable<Salutation> {
    if (!salutationText?.trim()) {
      return throwError(() => new Error('Salutation text cannot be empty'));
    }

    const newSalutation: CreateSalutationRequest = {
      companyId,
      salutationText: salutationText.trim(),
      version: 1
    };

    return this.salutationService.addSalutation(newSalutation).pipe(
      catchError(err => {
        console.error('Error creating salutation:', err);
        return throwError(() => new Error('Failed to create salutation'));
      })
    );
  }

  /**
   * Checks if a salutation exists (case-insensitive comparison)
   * @param salutationText - Salutation text to check
   * @returns Observable emitting boolean indicating existence
   */
  salutationExists(salutationText: string): Observable<boolean> {
    return this.salutationService.getAllSalutations().pipe(
      map(salutations => salutations.some(
        s => s.salutationText.toLowerCase() === salutationText.toLowerCase()
      )),
      catchError(err => {
        console.error('Error checking salutation existence:', err);
        return throwError(() => new Error('Failed to check salutation existence'));
      })
    );
  }

  /**
   * Gets all salutations sorted alphabetically by salutationText
   * @returns Observable emitting sorted array of salutations
   */
  getSalutationsSortedByName(): Observable<Salutation[]> {
    return this.salutationService.getAllSalutations().pipe(
      map(salutations => [...salutations].sort((a, b) => a.salutationText.localeCompare(b.salutationText))),
      catchError(err => {
        console.error('Error sorting salutations:', err);
        return throwError(() => new Error('Failed to sort salutations'));
      })
    );
  }

  /**
   * Refreshes salutations data
   * @returns Observable that completes when refresh is done
   */
  refreshSalutations(): Observable<void> {
    return new Observable<void>(subscriber => {
      this.salutationService.refreshSalutations();
      subscriber.next();
      subscriber.complete();
    });
  }

  /**
   * Deletes a salutation by ID
   * @param id - ID of the salutation to delete
   * @returns Observable that completes when the deletion is done
   */
  deleteSalutation(id: number): Observable<void> {
    if (!id || id <= 0) {
      return throwError(() => new Error('Invalid salutation ID'));
    }

    return this.salutationService.deleteSalutation(id).pipe(
      catchError(err => {
        console.error('Error deleting salutation:', err);
        return throwError(() => new Error('Failed to delete salutation'));
      })
    );
  }

  /**
   * Updates a salutation
   * @param salutation - Salutation data to update
   * @returns Observable that emits the updated salutation
   */
  updateSalutation(salutation: Salutation): Observable<Salutation> {
    if (!salutation?.salutationId) {
      return throwError(() => new Error('Invalid salutation data'));
    }

    return this.salutationService.getSalutationById(salutation.salutationId).pipe(
      take(1),
      map((currentSalutation) => {
        if (!currentSalutation) {
          throw new Error('Salutation not found');
        }
        // Version conflict check can be added here if needed
        return salutation;
      }),
      switchMap((validatedSalutation: Salutation) => {
        const updateRequest: UpdateSalutationRequest = {
          salutationId: validatedSalutation.salutationId,
          companyId: validatedSalutation.companyId,
          salutationText: validatedSalutation.salutationText,
          version: validatedSalutation.version
        };
        return this.salutationService.updateSalutation(updateRequest);
      }),
      catchError((err) => {
        console.error('Error updating salutation:', err);
        return throwError(() => err);
      })
    );
  }

  private waitForUpdatedSalutation(id: number, observer: any) {
    return toObservable(this.salutationService.salutations).pipe(
      map(salutations => salutations.find(s => s.salutationId === id)),
      filter(updated => !!updated),
      take(1)
    ).subscribe({
      next: (updatedSalutation) => {
        observer.next(updatedSalutation);
        observer.complete();
      },
      error: (err) => observer.error(err)
    });
  }

  private listenForUpdateErrors(observer: any) {
    return toObservable(this.salutationService.error).pipe(
      filter(error => !!error),
      take(1)
    ).subscribe({
      next: (err) => observer.error(err)
    });
  }
}
