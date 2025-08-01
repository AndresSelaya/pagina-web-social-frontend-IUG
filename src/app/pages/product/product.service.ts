import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Product {
  productId: number;
  productName: string;
  initDateTime: number;
  endDateTime: number;
  price: number;
  priceGross: number;
  productType: {
    typeId: number;
    typeName: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = 'http://localhost:8081/api/products';

  constructor(private http: HttpClient) {}

  getProductsByType(typeId: number): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/by-type/${typeId}`);
  }
}
