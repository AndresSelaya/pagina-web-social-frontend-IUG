import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

export interface CustomerType {
  id: number;
  name: string;
}

export interface CustomerTypeResponse {
  customerTypeId: number;
  companyId: number;
  customerTypeName: string;
  version: number;
}

@Injectable({
  providedIn: 'root'
})
export class CustomerTypeService {
  private selectedTypeSubject = new BehaviorSubject<number>(3);
  selectedType$ = this.selectedTypeSubject.asObservable();
  private apiUrl = `${environment.BACK_END_HOST_IUG}/customertypes`;

  constructor(private http: HttpClient) {}

  getCustomerTypes(): Observable<CustomerType[]> {
    return this.http.get<CustomerTypeResponse[]>(this.apiUrl).pipe(
      map(response => response.map(item => ({
        id: item.customerTypeId,
        name: item.customerTypeName
      })))
    );
  }

  setSelectedType(id: number): void {
    this.selectedTypeSubject.next(id);
  }

  getCurrentType(): number {
    return this.selectedTypeSubject.value;
  }
}
