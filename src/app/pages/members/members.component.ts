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
  private customerIdsSubscription: Subscription;
  idTypes: number[] = [];
  customerIds: number[] = [];
  customerInfos: CustomerInfo[] = [];
  addresses: AddressWithCustomerInfo[] = [];
  companyName: string = '';
  selectedCustomerId: number | null = null;
  selectedCustomer: CustomerInfo | null = null;
  isLoading: boolean = false;
  searchKeyword: string = '';
  filterPlaceholder: string = 'Buscar customer...';

  constructor(
    private addressService: AddressService,
    private customerService: CustomerService,
    private customerTypeService: CustomerTypeService
  ) {
    this.idTypes = this.customerTypeService.getSelectedTypeIds();
    this.subscription = this.customerTypeService.selectedTypeIds$.subscribe(newTypes => {
      this.idTypes = newTypes;
      this.loadCustomers(this.idTypes);
    });
    // Suscribirse a los customerIds compartidos
    this.customerIdsSubscription = this.customerTypeService.customerIds$.subscribe(ids => {
      this.customerIds = ids;
      if (ids && ids.length > 0) {
        this.loadAllMembersForCustomerIds(ids);
      } else {
        this.addresses = [];
      }
    });
  }

  /**
   * Cargar todos los members (addresses) de todos los customerIds recibidos
   */
  private loadAllMembersForCustomerIds(customerIds: number[]): void {
    this.isLoading = true;
    // Para cada customerId, obtener addresses y companyName en paralelo
    const requests = customerIds.map(id =>
      forkJoin({
        companyName: this.addressService.getCompanyName(id),
        addresses: this.addressService.getAddressesByContactAddress(id)
      }).pipe()
    );
    forkJoin(requests).subscribe({
      next: (results) => {
        // results es un array de objetos { companyName, addresses }
        const allAddresses: AddressWithCustomerInfo[] = [];
        results.forEach((result, idx) => {
          const customerId = customerIds[idx];
          const companyName = result.companyName;
          result.addresses.forEach(address => {
            allAddresses.push({ ...address, customerId, companyName });
          });
        });
        this.addresses = allAddresses;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading all members:', error);
        this.addresses = [];
        this.isLoading = false;
      }
    });
  }

  ngOnInit(): void {
    // Ya no cargar customers por defecto aquí, solo por customerIds recibidos
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Si cambia el idType, recargar customers
    if (changes['idTypes'] && !changes['idTypes'].firstChange) {
      // Si necesitas recargar customers por tipo, hazlo aquí usando this.idTypes
      // this.loadCustomers(this.idTypes); // Si implementas soporte para múltiples tipos
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
          customerId: customerId,
          companyName: result.companyName
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
  onCustomerSelectedByClick(customerId: number | undefined): void {
    if (customerId) {
      this.selectedCustomerId = customerId;
      const selectedCustomer = this.customerInfos.find(c => c.customerId === customerId);
      if (selectedCustomer) {
        this.filterPlaceholder = `${selectedCustomer.name1}`;
        this.loadDataForCustomer(customerId);
      }
    } else {
      this.filterPlaceholder = 'Buscar customer...';
      this.selectedCustomerId = null;
      this.addresses = [];
    }
  }

  /**
   * Método para cambiar entre diferentes consultas
   * @param contactAddressId ID del contact address
   */
  loadAddressesByContactAddress(contactAddressId: number): void {
    forkJoin({
      companyName: this.addressService.getCompanyName(contactAddressId),
      addresses: this.addressService.getAddressesByContactAddress(contactAddressId)
    }).subscribe({
      next: (result) => {
        const addressesWithCompany = result.addresses.map(address => ({
          ...address,
          companyName: result.companyName,
          customerId: contactAddressId
        }));
        this.addresses = addressesWithCompany;
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
  private loadCustomers(idTypes: number[]): void {
    if (!idTypes || idTypes.length === 0) {
      this.customerIds = [];
      this.customerInfos = [];
      this.addresses = [];
      this.companyName = '';
      return;
    }
    const requests = idTypes.map(idType => this.customerService.getCustomersByTypeAndAddress(idType));
    forkJoin(requests).subscribe({
      next: (results) => {
        // results es un array de arrays de customers
        const allCustomers = results.flat();
        this.customerIds = allCustomers.map(customer => customer.customerId);
        this.customerInfos = allCustomers.map(customer => ({
          customerId: customer.customerId,
          name1: customer.name1
        }));
        // Cargar automáticamente el primer customer si hay datos
        if (this.customerIds.length > 0) {
          const firstCustomerId = this.customerIds[0];
          this.selectedCustomerId = firstCustomerId;
          this.loadDataForCustomer(firstCustomerId);
        } else {
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
    if (this.customerIdsSubscription) {
      this.customerIdsSubscription.unsubscribe();
    }
  }
}