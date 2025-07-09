import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { Salutation, CreateSalutationRequest, UpdateSalutationRequest } from '../interfaces/salutation';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SalutationService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.BACK_END_HOST_DEV}/api/salutations`;

  private readonly httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    })
  };

  // Signals para estado reactivo
  private readonly _salutations = signal<Salutation[]>([]);
  private readonly _loading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);

  // Exponer señales como read-only
  public salutations = this._salutations.asReadonly();
  public loading = this._loading.asReadonly();
  public error = this._error.asReadonly();

  constructor() {
    this.loadInitialData();
  }

  private loadInitialData(): void {
    this._loading.set(true);
    this.http.get<Salutation[]>(this.apiUrl, this.httpOptions).pipe(
      tap({
        next: (salutations) => {
          this._salutations.set(salutations);
          this._error.set(null);
        },
        error: (err) => {
          this._error.set('Failed to load salutations');
          console.error('Error loading salutations:', err);
        }
      }),
      catchError(() => of([])),
      tap(() => this._loading.set(false))
    ).subscribe();
  }

  // CREATE
  addSalutation(salutation: CreateSalutationRequest): Observable<Salutation> {
    return this.http.post<Salutation>(this.apiUrl, salutation, this.httpOptions).pipe(
      tap({
        next: (newSalutation) => {
          this._salutations.update(salutations => [...salutations, newSalutation]);
          this._error.set(null);
        },
        error: (err) => {
          this._error.set('Failed to add salutation');
          console.error('Error adding salutation:', err);
        }
      })
    );
  }

  // UPDATE
  updateSalutation(updatedSalutation: UpdateSalutationRequest): Observable<Salutation> {
    return this.http.put<Salutation>(this.apiUrl, updatedSalutation, this.httpOptions).pipe(
      tap({
        next: (res) => {
          this._salutations.update(salutations =>
            salutations.map(s => s.salutationId === res.salutationId ? res : s)
          );
          this._error.set(null);
        },
        error: (err) => {
          this._error.set('Failed to update salutation');
          console.error('Error updating salutation:', err);
        }
      })
    );
  }
  
  // DELETE
  deleteSalutation(id: number): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url, this.httpOptions).pipe(
      tap({
        next: () => {
          this._salutations.update(salutations =>
            salutations.filter(s => s.salutationId !== id)
          );
          this._error.set(null);
        },
        error: (err) => {
          this._error.set('Failed to delete salutation');
          console.error('Error deleting salutation:', err);
        }
      })
    );
  }  

  // READ
  getAllSalutations(): Observable<Salutation[]> {
    return this.http.get<Salutation[]>(this.apiUrl, this.httpOptions).pipe(
      tap(() => this._error.set(null)),
      catchError(err => {
        this._error.set('Failed to fetch salutations');
        console.error('Error fetching salutations:', err);
        return of([]);
      })
    );
  }
  
  getSalutationById(id: number): Observable<Salutation | undefined> {
    return this.getAllSalutations().pipe(
      map(salutations => salutations.find(s => s.salutationId === id))
    );
  }  

  public refreshSalutations(): void {
    this.loadInitialData();
  }
}
