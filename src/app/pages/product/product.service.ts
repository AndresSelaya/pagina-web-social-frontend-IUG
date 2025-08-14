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

  createProduct(product: any): Observable<any> {
    // Convertir fechas a timestamp si vienen como string
    const toTimestamp = (val: any) => val ? new Date(val).getTime() : null;
    const body = {
      accountId: null,
      closingDateTime: toTimestamp(product.closingDateTime),
      companyId: 8543,
      currentVersion: product.currentVersion,
      descriptionId: null,
      endDateTime: toTimestamp(product.endDateTime),
      eventAddress: product.eventAddress,
      initDateTime: toTimestamp(product.initDateTime),
      langTextId: null,
      maxParticipant: product.maxParticipant,
      price: product.price,
      priceGross: product.priceGross,
      productGroupId: null,
      productName: product.productName,
      productNumber: product.productNumber,
      productTypeId: 1582,
      unitId: null,
      vatId: 40,
      version: 1,
      websiteLink: product.websiteLink
    };
    return this.http.post<any>(this.apiUrl, body);
  }
}
