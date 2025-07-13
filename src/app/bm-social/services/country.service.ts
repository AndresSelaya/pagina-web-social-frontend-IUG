import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, finalize, map, of, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Country } from '../interfaces/country';


@Injectable({
  providedIn: 'root'
})
export class CountryService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.BACK_END_HOST_IUG}/countries`;

  // Signals
  private readonly _countries = signal<Country[]>([]);
  private readonly _loading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);

  public countries = this._countries.asReadonly();
  public loading = this._loading.asReadonly();
  public error = this._error.asReadonly();

  private readonly httpOptions = {
  //  withCredentials: true,
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    })
  };

  constructor() {}

  public loadInitialData(): Observable<Country[]> {
    this._loading.set(true);
    return this.http.get<Country[]>(this.apiUrl, this.httpOptions).pipe(
      tap(countries => {
        this._countries.set(countries);
        this._error.set(null);
      }),
      catchError(() => of([])),
      finalize(() => this._loading.set(false))
    );
  }

  // ==================== CREATE OPERATIONS ====================
  /**
   * Creates a new country record
   * @param country Country data (without countryId and companyId)
   * @returns Observable with the created Country object
   * @throws Error when validation fails or server error occurs
   */
  addCountry(country: Omit<Country, 'countryId' | 'companyId'>): Observable<Country> {
    this._loading.set(true);
    return this.http.post<Country>(this.apiUrl, country, this.httpOptions).pipe(
      tap({
        next: (newCountry) => {
          this._countries.update(countries => [...countries, newCountry]);
          this._error.set(null);
        },
        error: (err) => {
          this._error.set('Failed to add country');
          console.error('Error adding country:', err);
        }
      }),
      finalize(() => this._loading.set(false))
    );
  }

  // ==================== UPDATE OPERATIONS ====================
  /**
   * Updates an existing country record
   * @param country Country data with all required fields including countryId
   * @returns Observable with the updated Country object
   * @throws Error when validation fails or server error occurs
   */
  updateCountry(country: Country): Observable<Country> {
    if (!country.countryId) {
      return throwError(() => new Error('Country ID is required for update'));
    }

    this._loading.set(true);
    return this.http.put<Country>(this.apiUrl, country, this.httpOptions).pipe(
      tap({
        next: (updatedCountry) => {
          this._countries.update(countries => 
            countries.map(c => c.countryId === updatedCountry.countryId ? updatedCountry : c)
          );
          this._error.set(null);
        },
        error: (err) => {
          this._error.set('Failed to update country');
          console.error('Error updating country:', err);
        }
      }),
      finalize(() => this._loading.set(false))
    );
  }

  // ==================== DELETE OPERATIONS ====================
  /**
   * Deletes a country by ID
   * @param countryId Country identifier
   * @returns Observable that completes when deletion is successful
   * @throws Error when country not found or server error occurs
   */
  deleteCountry(countryId: number): Observable<void> {
    if (!countryId || countryId <= 0) {
      return throwError(() => new Error('Invalid country ID'));
    }

    this._loading.set(true);
    const deleteUrl = `${this.apiUrl}/${countryId}`;
    
    return this.http.delete<void>(deleteUrl, this.httpOptions).pipe(
      tap({
        next: () => {
          this._countries.update(countries => 
            countries.filter(c => c.countryId !== countryId)
          );
          this._error.set(null);
        },
        error: (err) => {
          this._error.set('Failed to delete country');
          console.error('Error deleting country:', err);
        }
      }),
      finalize(() => this._loading.set(false))
    );
  }

  // ==================== READ OPERATIONS ====================
  /**
   * Retrieves all countries from the API
   * @returns Observable with Country array
   * @throws Error when server request fails
   */
  getAllCountries(): Observable<Country[]> {
    this._loading.set(true);
    return this.http.get<Country[]>(this.apiUrl, this.httpOptions).pipe(
      tap((countries) => {
        this._countries.set(countries);
        this._error.set(null);
      }),
      catchError(err => {
        this._error.set('Failed to fetch countries');
        console.error('Error fetching countries:', err);
        return of([]);
      }),
      finalize(() => this._loading.set(false))
    );
  }

  /**
   * Retrieves a single country by ID
   * @param id Country identifier
   * @returns Observable with Country object
   * @throws Error when country not found or server error occurs
   */
  getCountryById(id: number): Observable<Country | undefined> {
    return this.getAllCountries().pipe(
      map(countries => countries.find(t => t.countryId === id))
    );
  }  

  public refreshCountries(): void {
    this.getAllCountries().subscribe();
  }
}