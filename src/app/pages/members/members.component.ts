import { Component, OnInit } from '@angular/core';
import { AddressService, Address } from './service/address.service';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.scss']
})
export class MembersComponent implements OnInit {
  addresses: Address[] = [];
  companyName: string = '';

  constructor(private addressService: AddressService) {}

  ngOnInit(): void {
    // Obtener el nombre de la compañía
    this.addressService.getCompanyName(4212).subscribe({
      next: (companyName) => {
        console.log('Company name:', companyName);
        this.companyName = companyName;
      },
      error: (error) => {
        console.error('Error fetching company name:', error);
      }
    });

    // Obtener las direcciones por contact address
    this.addressService.getAddressesByContactAddress(4212).subscribe({
      next: (addresses) => {
        console.log('Addresses:', addresses);
        this.addresses = addresses;
      },
      error: (error) => {
        console.error('Error fetching addresses:', error);
      }
    });
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
}