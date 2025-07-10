import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Salutation } from '../../../interfaces/salutation';

@Injectable({
  providedIn: 'root'
})
export class SalutationStateService {
  private readonly salutationToEditSource = new BehaviorSubject<Salutation | null>(null);
  
  public currentSalutation$ = this.salutationToEditSource.asObservable();

  constructor() { }

  setSalutationToEdit(salutation: Salutation | null): void {
    this.salutationToEditSource.next(salutation);
  }

  getCurrentSalutation(): Observable<Salutation | null> {
    return this.currentSalutation$;
  }

  clearCurrentSalutation(): void {
    this.salutationToEditSource.next(null);
  }
}
