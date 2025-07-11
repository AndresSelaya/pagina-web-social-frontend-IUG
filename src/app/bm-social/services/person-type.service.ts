import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CreatePersonTypeRequest, PersonType, UpdatePersonTypeRequest } from '../interfaces/person-type';

@Injectable({
  providedIn: 'root'
})
export class PersonTypeService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment. BACK_END_HOST_IUG}/person-type`;

  private readonly httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    })
  };

  // Signals para estado reactivo
  private readonly _personTypes = signal<PersonType[]>([]);
  private readonly _loading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);

  // Exponer señales como read-only
  public personTypes = this._personTypes.asReadonly();
  public loading = this._loading.asReadonly();
  public error = this._error.asReadonly();

  constructor() {
    this.loadInitialData();
  }

  private loadInitialData(): void {
    this._loading.set(true);
    this.http.get<PersonType[]>(this.apiUrl, this.httpOptions).pipe(
      tap({
        next: (personTypes) => {
          this._personTypes.set(personTypes);
          this._error.set(null);
        },
        error: (err) => {
          this._error.set('Failed to load person types');
          console.error('Error loading person types:', err);
        }
      }),
      catchError(() => of([])),
      tap(() => this._loading.set(false))
    ).subscribe();
  }

  // CREATE
  addPersonType(person: CreatePersonTypeRequest): Observable<PersonType> {
    return this.http.post<PersonType>(this.apiUrl, person, this.httpOptions).pipe(
      tap({
        next: (newPerson) => {
          this._personTypes.update(personTypes => [...personTypes, newPerson]);
          this._error.set(null);
        },
        error: (err) => {
          this._error.set('Failed to add person');
          console.error('Error adding person:', err);
        }
      })
    );
  }

  // UPDATE
  updatePersonType(updatedPerson: UpdatePersonTypeRequest): Observable<PersonType> {
    return this.http.put<PersonType>(this.apiUrl, updatedPerson, this.httpOptions).pipe(
      tap({
        next: (res) => {
          this._personTypes.update(persons =>
            persons.map(p => p.personTypeId === res.personTypeId ? res : p)
          );
          this._error.set(null);
        },
        error: (err) => {
          this._error.set('Failed to update person');
          console.error('Error updating person:', err);
        }
      })
    );
  }
  
  // DELETE
  deletePersonType(id: number): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url, this.httpOptions).pipe(
      tap({
        next: () => {
          this._personTypes.update(persons =>
            persons.filter(p => p.personTypeId !== id)
          );
          this._error.set(null);
        },
        error: (err) => {
          this._error.set('Failed to delete person');
          console.error('Error deleting person:', err);
        }
      })
    );
  }  

  // READ
  getAllPersonTypes(): Observable<PersonType[]> {
    return this.http.get<PersonType[]>(this.apiUrl, this.httpOptions).pipe(
      tap(() => this._error.set(null)),
      catchError(err => {
        this._error.set('Failed to fetch persons');
        console.error('Error fetching persons:', err);
        return of([]);
      })
    );
  }
  
  getPersonById(id: number): Observable<PersonType | undefined> {
    return this.getAllPersonTypes().pipe(
      map(persons => persons.find(p => p.personTypeId === id))
    );
  }  

  public refreshPersonTypes(): void {
    this.loadInitialData();
  }
}