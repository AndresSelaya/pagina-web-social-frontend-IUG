// ...existing code...
import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { CustomerService, CustomerIU } from './service/customer.service';
import { CustomerType, CustomerTypeService } from './service/customer-type.service';

@Component({
  selector: 'app-companies',
  templateUrl: 'companies.component.html',
  styleUrls: ['companies.component.scss']
})
export class CompaniesComponent implements OnInit {
  dropdownRef: HTMLElement | null = null;
  toggleTypeDropdown(event: MouseEvent): void {
    event.stopPropagation();
    this.showTypeDropdown = !this.showTypeDropdown;
    if (this.showTypeDropdown) {
      setTimeout(() => {
        this.dropdownRef = (event.target as HTMLElement).closest('.customer-type-dropdown-container') as HTMLElement;
      });
    }
  }

  onDocumentClick(event: MouseEvent): void {
    if (!this.showTypeDropdown) return;
    const target = event.target as HTMLElement;
    if (this.dropdownRef && !this.dropdownRef.contains(target)) {
      this.showTypeDropdown = false;
    }
  }
  customers: CustomerIU[] = [];
  loading = false;
  idType: number[] = [];
  customerTypes: (CustomerType & { checked?: boolean })[] = [];
  showTypeDropdown = false;

  constructor(
    private customerService: CustomerService,
    private customerTypeService: CustomerTypeService
  ) {
    const current = this.customerTypeService.getCurrentType();
    this.idType = current ? [current] : [];
  }

  ngOnInit(): void {
    this.customerTypeService.getCustomerTypes().subscribe({
      next: (types) => {
        // Añadir propiedad checked a cada tipo
        this.customerTypes = types.map(type => ({ ...type, checked: this.idType.includes(type.id) }));
        if (this.idType.length > 0) {
          this.loadCustomersByTypeAndAddress(this.idType);
        }
      },
      error: (error) => {
        console.error('Error fetching customer types:', error);
      }
    });
  }

  /**
   * Carga customers para uno o varios tipos seleccionados
   * @param idTypes Array de IDs de tipo de customer
   */
  loadCustomersByTypeAndAddress(idTypes: number[]): void {
    this.customers = [];
    if (!idTypes || idTypes.length === 0) return;
    this.loading = true;
    const requests = idTypes.map(idType => this.customerService.getCustomersByCustomertypeCached(idType));
    forkJoin(requests).subscribe({
      next: (results) => {
        this.customers = results.flat();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching CustomerIU:', error);
        this.loading = false;
      }
    });
  }

  /**
   * Cambia los tipos seleccionados y recarga los customers
   */
  // No hace nada pero puede usarse para lógica reactiva si se requiere
  onTypeCheckChange(): void {}

  applyTypeFilter(): void {
    this.idType = this.customerTypes.filter(t => t.checked).map(t => t.id);
    if (this.idType.length > 0) {
      this.customerTypeService.setSelectedType(this.idType[0]);
    }
    this.loadCustomersByTypeAndAddress(this.idType);
  }
}