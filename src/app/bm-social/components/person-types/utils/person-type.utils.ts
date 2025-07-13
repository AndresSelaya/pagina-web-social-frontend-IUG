import { EnvironmentInjector, Injectable, inject } from '@angular/core';
import { Observable, catchError, map, take, throwError, switchMap } from 'rxjs';
import { PersonTypeService } from '../../../services/person-type.service';
import { CreatePersonTypeRequest, PersonType, UpdatePersonTypeRequest } from '../../../interfaces/person-type';

/**
 * Utility class for person-related business logic and operations.
 * Works with PersonTypeService's reactive signals while providing additional functionality.
 */
@Injectable({ providedIn: 'root' }) 
export class PersonTypeUtils {
  private readonly personService = inject(PersonTypeService);
  private readonly injector = inject(EnvironmentInjector);

  /**
   * Gets a perrson by ID with proper error handling
   * @param id - ID of the person to retrieve
   * @returns Observable emitting the person or undefined if not found
   */
  getPersonById(id: number): Observable<PersonType | undefined> {
    if (!id || id <= 0) {
      return throwError(() => new Error('Invalid title ID'));
    }

    return this.personService.getPersonById(id).pipe(
      catchError(err => {
        console.error('Error fetching person:', err);
        return throwError(() => new Error('Failed to load person'));
      })
    );
  }

  /**
   * Creates a new person with validation
   * @param name - Text for the new person
   * @param companyId - Company ID (defaults to 1)
   * @returns Observable that emits the created person
   */
  createNewPerson(name: string, companyId: number = 1): Observable<PersonType> {
    if (!name?.trim()) {
      return throwError(() => new Error('Person name cannot be empty'));
    }

    const newPerson: CreatePersonTypeRequest = {
      companyId,
      personTypeName: name.trim(),
      version: 1
    };

    return this.personService.addPersonType(newPerson).pipe(
      catchError(err => {
        console.error('Error creating person:', err);
        return throwError(() => new Error('Failed to create person'));
      })
    );
  }

  /**
   * Checks if a person exists (case-insensitive comparison)
   * @param name - Person text to check
   * @returns Observable emitting boolean indicating existence
   */
  personExists(name: string): Observable<boolean> {
    return this.personService.getAllPersonTypes().pipe(
      map(persons => persons.some(
        p => p.personTypeName.toLowerCase() === name.toLowerCase()
      )),
      catchError(err => {
        console.error('Error checking person existence:', err);
        return throwError(() => new Error('Failed to check person existence'));
      })
    );
  }

  /**
   * Gets all persons sorted alphabetically by name
   * @returns Observable emitting sorted array of persons
   */
  getPersonsSortedByName(): Observable<PersonType[]> {
    return this.personService.getAllPersonTypes().pipe(
      map(persons => [...persons].sort((a, b) => a.personTypeName.localeCompare(b.personTypeName))),
      catchError(err => {
        console.error('Error sorting persons:', err);
        return throwError(() => new Error('Failed to sort persons'));
      })
    );
  }

  /**
   * Refreshes persons data
   * @returns Observable that completes when refresh is done
   */
  refreshPersons(): Observable<void> {
    return new Observable<void>(subscriber => {
      this.personService.refreshPersonTypes();
      subscriber.next();
      subscriber.complete();
    });
  }

  /**
   * Deletes a person by ID
   * @param id - ID of the person to delete
   * @returns Observable that completes when the deletion is done
   */
  deletePerson(id: number): Observable<void> {
    if (!id || id <= 0) {
      return throwError(() => new Error('Invalid person ID'));
    }

    return this.personService.deletePersonType(id).pipe(
      catchError(err => {
        console.error('Error deleting person:', err);
        return throwError(() => new Error('Failed to delete person'));
      })
    );
  }

  /**
   * Updates a person
   * @param person - Person data to update
   * @returns Observable that emits the updated person
   */
  updatePerson(person: PersonType): Observable<PersonType> {
    if (!person?.personTypeId) {
      return throwError(() => new Error('Invalid person data'));
    }

    return this.personService.getPersonById(person.personTypeId).pipe(
      take(1),
      map((currentPerson) => {
        if (!currentPerson) {
          throw new Error('Person not found');
        }
        // Version conflict check can be added here if needed
        return person;
      }),
      switchMap((validatedPerson: PersonType) => {
        const updateRequest: UpdatePersonTypeRequest = {
          personTypeId: validatedPerson.personTypeId,
          companyId: validatedPerson.companyId,
          personTypeName: validatedPerson.personTypeName,
          version: validatedPerson.version
        };
        return this.personService.updatePersonType(updateRequest);
      }),
      catchError((err) => {
        console.error('Error updating person:', err);
        return throwError(() => err);
      })
    );
  }

}