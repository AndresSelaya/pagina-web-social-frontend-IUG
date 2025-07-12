import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PersonType } from '../../../interfaces/person-type';

@Injectable({ providedIn: 'root' })
export class PersonTypeStateService {
  private readonly editPersonSource = new BehaviorSubject<PersonType | null>(null);
  currentPerson$ = this.editPersonSource.asObservable();

  setPersonTypeToEdit(title: PersonType | null): void {
    this.editPersonSource.next(title);
  }

  clearPersonType() {
    this.editPersonSource.next(null);
  }
}