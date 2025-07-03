import { Component, OnInit } from '@angular/core';
import { CustomerService, Customer } from './service/customer.service';

@Component({
  selector: 'app-companies',
  templateUrl: 'companies.component.html',
  styleUrls: ['companies.component.scss']
})
export class CompaniesComponent implements OnInit {
  customers: Customer[] = [];
  idType: number = 3; // Valor por defecto, puedes cambiarlo según necesites

  constructor(private customerService: CustomerService) {}

  ngOnInit(): void {
    // Cargar customers por tipo y dirección
    this.loadCustomersByTypeAndAddress(this.idType);
  }

  /**
   * Método para cargar customers por tipo y dirección
   * @param idType ID del tipo de customer y dirección
   */
  loadCustomersByTypeAndAddress(idType: number): void {
    this.customerService.getCustomersByTypeAndAddress(idType).subscribe({
      next: (customers) => {
        console.log('Customers:', customers);
        this.customers = customers;
      },
      error: (error) => {
        console.error('Error fetching customers:', error);
      }
    });
  }

  /**
   * Método para cambiar entre diferentes consultas
   * @param event Evento del select
   */
  changeIdType(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const idType = Number(target.value);
    this.idType = idType;
    this.loadCustomersByTypeAndAddress(idType);
  }
}