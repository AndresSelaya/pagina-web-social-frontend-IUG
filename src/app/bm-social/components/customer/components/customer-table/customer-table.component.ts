import { Component, computed, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CustomerUtils } from '../../utils/customer.utils';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-customer-table',
  templateUrl: './customer-table.component.html',
  styleUrls: ['./customer-table.component.scss']
})
export class CustomerTableComponent implements OnInit, OnDestroy {
  visibleConfirmModal: boolean = false;
  selectedCustomer: any = null;
  confirmMessage: string = '';
  private readonly customerUtils = inject(CustomerUtils);
  private readonly translate = inject(TranslateService);
  columnsHeaderFieldCustomers: any[] = [];
  tableKey: string = 'Customers';
  dataKeys = ['foto', 'name1', 'cytyname', 'zip', 'city', 'areacode'];
  customers: any[] = [];
  private langSubscription!: Subscription;

  ngOnInit(): void {
    this.loadColumnsCustomers();
    this.langSubscription = this.translate.onLangChange.subscribe(() => {
      this.loadColumnsCustomers();
    });
    this.customerUtils.getAddressDetailsAll().subscribe({
      next: (result) => {
        this.customers = (result || []).map((item: any) => ({
          ...item,
          visibleWeb: Number(item.visibleweb) === 1 ? 'Yes' : 'No'
        }));
      },
      error: () => {
        this.customers = [];
      }
    });
  }

  onViewCustomer(customer: any) {
    this.selectedCustomer = customer;
    if (customer.visibleweb === 1) {
      this.confirmMessage = `Do you want to make this customer <b>not visible</b>: <b>${customer.name1}</b>?`;
    } else {
      this.confirmMessage = `Do you want to make this customer <b>visible</b>: <b>${customer.name1}</b>?`;
    }
    this.visibleConfirmModal = true;
  }

  loadColumnsCustomers(): void {
    this.columnsHeaderFieldCustomers = [
      {
        field: 'name1',
        header: 'Organization',
        styles: { width: '200px' },
      },
      {
        field: 'cityName',
        header: 'City',
        styles: { width: '120px' },
      },
      {
        field: 'zip',
        header: 'ZIP',
        styles: { width: '100px' },
      },
      {
        field: 'areaCode',
        header: 'Country Code',
        styles: { width: '100px' },
      },
      {
        field: "visibleWeb",
        header: 'is visible?',
        styles: { width: '100px' },
      }
    ];
  }

  ngOnDestroy(): void {
    if (this.langSubscription) {
      this.langSubscription.unsubscribe();
    }
  }

  onConfirmVisible() {
    if (this.selectedCustomer && this.selectedCustomer.addressId) {
      this.customerUtils.toggleVisibleWeb(this.selectedCustomer.addressId).subscribe({
        next: () => {
          // recargar datos o mostrar mensaje de éxito
          this.customerUtils.getAddressDetails().subscribe({
            next: (result) => {
              const data = Array.isArray(result?.content) ? result.content : [];
              this.customers = data.map((item: any) => ({
                ...item,
                visibleWeb: Number(item.visibleweb) === 1 ? 'Yes' : 'Not'
              }));
            },
            error: () => {
              this.customers = [];
            }
          });
        },
        error: () => {
          // mostrar mensaje de error
          
        }
      });
    }
    this.visibleConfirmModal = false;
    this.selectedCustomer = null;
  }

  onCancelVisible() {
    this.visibleConfirmModal = false;
    this.selectedCustomer = null;
  }
}
