import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Participant {
  salePositionId: number;
  customerName1: string;
  contactPersonName1: string;
  contactPersonName2: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class ParticipantsService {
  private apiUrl = 'http://localhost:8081/api/salepositions';

  constructor(private http: HttpClient) {}

  getParticipantsByProduct(productId: number): Observable<Participant[]> {
    return this.http.get<Participant[]>(`${this.apiUrl}/by-product-with-address/${productId}`);
  }
}
