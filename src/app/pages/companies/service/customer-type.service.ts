import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface CustomerType {
  id: number;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class CustomerTypeService {
  private selectedTypeSubject = new BehaviorSubject<number>(3); // valor por defecto
  selectedType$ = this.selectedTypeSubject.asObservable();

  private customerTypes: CustomerType[] = [
    { id: 1, name: 'Interessent' },
    { id: 2, name: 'Kunde' },
    { id: 3, name: 'Partner' },
    { id: 4, name: 'Pot. Interessent' },
    { id: 5, name: 'Kein Interesse' }
  ];

  constructor() {}

  getCustomerTypes(): CustomerType[] {
    return this.customerTypes;
  }

  setSelectedType(id: number): void {
    this.selectedTypeSubject.next(id);
  }

  getCurrentType(): number {
    return this.selectedTypeSubject.value;
  }
}
