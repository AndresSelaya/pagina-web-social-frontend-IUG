import { Component, OnInit, OnDestroy, SimpleChanges } from '@angular/core';
import { AddressService, Address, AddressWithCustomerInfo } from './service/address.service';
import { CustomerService, Customer, CustomerInfo } from '../companies/service/customer.service';
import { CustomerTypeService } from '../companies/service/customer-type.service';
import { forkJoin, Subscription } from 'rxjs';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.scss']
})
export class MembersComponent implements OnInit, OnDestroy {
  private subscription: Subscription;
  idType: number;
  customerIds: number[] = [];
  customerInfos: CustomerInfo[] = [];
  addresses: AddressWithCustomerInfo[] = [];
  companyName: string = '';
  selectedCustomerId: number | null = null;
  selectedCustomer: CustomerInfo | null = null;
  isLoading: boolean = false;
  searchKeyword: string = '';

  constructor(
    private addressService: AddressService,
    private customerService: CustomerService,
    private customerTypeService: CustomerTypeService
  ) {
    this.idType = this.customerTypeService.getCurrentType();
    this.subscription = this.customerTypeService.selectedType$.subscribe(newType => {
      this.idType = newType;
      this.loadCustomers(newType);
    });
  }

  ngOnInit(): void {
    // Cargar customers por defecto
    this.loadCustomers(this.idType);
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Si cambia el idType, recargar customers
    if (changes['idType'] && !changes['idType'].firstChange) {
      this.loadCustomers(this.idType);
    }
  }

  /**
   * Cargar datos para un customer específico
   * @param customerId ID del customer seleccionado
   */
  private loadDataForCustomer(customerId: number): void {
    // Evitar cargas duplicadas
    if (this.isLoading) {
      return;
    }

    // Mostrar indicador de carga
    this.isLoading = true;
    
    // Limpiar datos anteriores
    this.addresses = [];
    this.companyName = '';

    // Hacer ambas llamadas en paralelo
    forkJoin({
      companyName: this.addressService.getCompanyName(customerId),
      addresses: this.addressService.getAddressesByContactAddress(customerId)
    }).subscribe({
      next: (result) => {
        this.companyName = result.companyName;
        
        // Buscar el nombre del customer si está disponible
        const customerInfo = this.customerInfos.find(info => info.customerId === customerId);
        
        // Agregar información del customer a cada address
        const addressesWithCustomerInfo = result.addresses.map(address => ({
          ...address,
          customerName: customerInfo?.name1 || `Customer ${customerId}`,
          customerId: customerId
        }));
        
        this.addresses = addressesWithCustomerInfo;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching customer data:', error);
        this.isLoading = false;
      }
    });
  }

  /**
   * Método llamado cuando se selecciona un customer del dropdown
   * @param event Evento del select
   */
  onCustomerSelected(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const customerId = Number(target.value);
    
    if (customerId) {
      this.selectedCustomerId = customerId;
      this.loadDataForCustomer(customerId);
    } else {
      // Si se selecciona la opción vacía, limpiar datos
      this.selectedCustomerId = null;
      this.addresses = [];
      this.companyName = '';
    }
  }

  /**
   * Método llamado cuando se selecciona un customer haciendo clic en la lista
   * @param customerId ID del customer seleccionado
   */
  onCustomerSelectedByClick(customerId: number | null | undefined): void {
    if (customerId !== null && customerId !== undefined) {
      const selectedCustomer = this.customerInfos.find(info => info.customerId === customerId);
      if (selectedCustomer) {
        this.selectedCustomer = selectedCustomer;
        this.loadDataForCustomer(customerId);
      }
    } else {
      this.selectedCustomer = null;
      this.addresses = [];
      this.companyName = '';
    }
  }

  /**
   * Método para cambiar entre diferentes consultas
   * @param contactAddressId ID del contact address
   */
  loadAddressesByContactAddress(contactAddressId: number): void {
    this.addressService.getAddressesByContactAddress(contactAddressId).subscribe({
      next: (data) => {
        this.addresses = data;
      },
      error: (error) => {
        console.error('Error loading addresses:', error);
      }
    });
  }

  /**
   * Cargar customers desde el servicio
   * @param idType ID del tipo de customer
   */
  private loadCustomers(idType: number): void {
    this.customerService.getCustomersByTypeAndAddress(idType).subscribe({
      next: (customers) => {
        // Extraer customerIds y customerInfos
        this.customerIds = customers.map(customer => customer.customerId);
        this.customerInfos = customers.map(customer => ({
          customerId: customer.customerId,
          name1: customer.name1
        }));
        
        // Cargar automáticamente el primer customer si hay datos
        if (this.customerIds.length > 0) {
          const firstCustomerId = this.customerIds[0];
          this.selectedCustomerId = firstCustomerId;
          this.loadDataForCustomer(firstCustomerId);
        } else {
          // Si no hay customers, limpiar datos
          this.selectedCustomerId = null;
          this.addresses = [];
          this.companyName = '';
        }
      },
      error: (error) => {
        console.error('Error fetching customers:', error);
        this.customerIds = [];
        this.customerInfos = [];
        this.addresses = [];
        this.companyName = '';
      }
    });
  }

  getFilteredCustomerInfos(): CustomerInfo[] {
    if (!this.searchKeyword) {
      return this.customerInfos;
    }
    const keyword = this.searchKeyword.toLowerCase();
    return this.customerInfos.filter(customerInfo => customerInfo.name1.toLowerCase().includes(keyword));
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}