import { inject, Injectable } from '@angular/core';
import { Observable, catchError, map, of, switchMap, take, throwError } from 'rxjs';
import { CountryService } from '../../../services/country.service';
import { Country } from '../../../interfaces/country';

/**
 * Utility class for country-related business logic and operations.
 * Works with CountryService's reactive signals while providing additional functionality.
 */
@Injectable({ providedIn: 'root' })
export class CountryUtils {
  private readonly countryService = inject(CountryService);
//   private readonly customerUtils = inject(CustomerUtils); // Verify is used by customer

  /**
   * Gets a country by ID with proper error handling
   * @param id - ID of the country to retrieve
   * @returns Observable emitting the country or undefined if not found
   */
  getCountryById(id: number): Observable<Country | undefined> {
    if (!id || id <= 0) {
      return throwError(() => new Error('Invalid country ID'));
    }

    return this.countryService.getCountryById(id).pipe(
      catchError(err => {
        return throwError(() => new Error('Failed to load country'));
      })
    );
  }

  /**
   * Creates a new country with validation
   * @param countryName - Name for the new country
   * @param areaCode - Area code for the country
   * @param prefix - Prefix for the country
   * @param companyId - Company ID
   * @param currencyId - Currency ID
   * @returns Observable that completes when country is created
   */
  createNewCountry(countryName: string, areaCode: string, prefix: number, companyId: number, currencyId: number): Observable<void> {
    if (!countryName?.trim()) {
      return throwError(() => new Error('Country name cannot be empty'));
    }

    // Note: Since we only have a GET endpoint, we cannot actually create countries
    // This method is kept for interface compatibility but will throw an error
    return throwError(() => new Error('Create operation not supported by current API'));
  }

  /**
   * Checks if a COUNTRY exists (case-insensitive comparison)
   * @param countryName - Name to check
   * @returns Observable emitting boolean indicating existence
   */
  countryExists(countryName: string): Observable<boolean> {
    return this.countryService.getAllCountries().pipe(
      map(countries => countries.some(
        c => c.countryName.toLowerCase() === countryName.toLowerCase()
      )),
      catchError(err => {
        return throwError(() => new Error('Failed to check country existence'));
      })
    );
  }

  /**
   * Gets all countries sorted alphabetically by name
   * @returns Observable emitting sorted array of countries
   */
  getCountriesSortedByName(): Observable<Country[]> {
    return this.countryService.getAllCountries().pipe(
      map(countries => [...countries].sort((a, b) => a.countryName.localeCompare(b.countryName))),
      catchError(err => {
        return throwError(() => new Error('Failed to sort countries'));
      })
    );
  }

  /**
   * Refreshes countries data
   * @returns Observable that completes when refresh is done
   */
  refreshCountries(): Observable<void> {
    return new Observable<void>(subscriber => {
      this.countryService.refreshCountries();
      subscriber.next();
      subscriber.complete();
    });
  }

  /**
 * Deletes a country by ID and updates the internal countries signal.
 * @param id - ID of the country to delete
 * @returns Observable that completes when the deletion is done
 */
  deleteCountry(id: number): Observable<void> {
    // Note: Since we only have a GET endpoint, we cannot actually delete countries
    // This method is kept for interface compatibility but will throw an error
    return throwError(() => new Error('Delete operation not supported by current API'));
  }

  /**
   * Checks if a country is used by any customer.
   * @param id - ID of the country to check
   * @returns Observable emitting boolean indicating usage
   */
  /*private checkCountryUsage(id: number): Observable<boolean> {
    return this.customerUtils.getAllCustomers().pipe(
      map(customers => customers.some(customer => customer.country?.id === id)),
      catchError(() => of(false))
    );
  }*/

  /**
 * Updates a country by ID and updates the internal countries signal.
 * @param country - Country object with updated data
 * @returns Observable that completes when the update is done
 */
  updateCountry(country: Country): Observable<Country> {
    if(!country.countryId) {
      return throwError(() => new Error('Invalid country data'));
    }

    // Note: Since we only have a GET endpoint, we cannot actually update countries
    // This method is kept for interface compatibility but will throw an error
    return throwError(() => new Error('Update operation not supported by current API'));
  }
}