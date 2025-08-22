import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
@Injectable({ providedIn: 'root' })
export class CustomerService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.BACK_END_HOST_IUG}/customers`;


  getAddressDetails(page: number = 0, size: number = 20): Observable<any> {
    return this.http.get(`${this.baseUrl}/address-details`, {
      params: { page: page.toString(), size: size.toString() }
    });
  }

  getAddressDetailsAll(): Observable<any> {
    return this.http.get(`${this.baseUrl}/address-details/all`);
  }

  toggleVisibleWeb(customerId: number): Observable<any> {
    return this.http.patch(`${this.baseUrl}/${customerId}/toggle-visibleweb`, {});
  }
}
