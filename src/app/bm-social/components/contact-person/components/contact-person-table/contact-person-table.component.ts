
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ContactPersonUtils } from '../../utils/contact-person.utils';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-contact-person-table',
  templateUrl: './contact-person-table.component.html',
  styleUrls: ['./contact-person-table.component.scss']
})
export class ContactPersonTableComponent implements OnInit, OnDestroy {
  visibleConfirmModal: boolean = false;
  selectedContactPerson: any = null;
  confirmMessage: string = '';
  private readonly contactPersonUtils = inject(ContactPersonUtils);
  columnsHeaderFieldContactPersons: any[] = [];
  tableKey: string = 'ContactPersons';
  dataKeys = ['name1', 'name2', 'customerName1', 'cityName', 'zip', 'areaCode'];
  contactPersons: any[] = [];
  private subscription!: Subscription;

  ngOnInit(): void {
    this.loadColumnsContactPersons();
    this.subscription = this.contactPersonUtils.getAllContactPersons().subscribe({
      next: (result) => {
        this.contactPersons = Array.isArray(result?.content) ? result.content : [];
      },
      error: () => {
        this.contactPersons = [];
      }
    });
  }

  loadColumnsContactPersons(): void {
    this.columnsHeaderFieldContactPersons = [
      {
        field: 'name1',
        header: 'First Name',
        styles: { width: '150px' },
      },
      {
        field: 'name2',
        header: 'Last Name',
        styles: { width: '150px' },
      },
      {
        field: 'customerName1',
        header: 'Customer',
        styles: { width: '150px' },
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
        header: 'Area Code',
        styles: { width: '100px' },
      },
      {
        field: 'visibleWeb',
        header: 'Visible Web',
        styles: { width: '100px' },
      }
    ];
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  onViewContactPerson(contactPerson: any) {
    if (contactPerson && contactPerson.customerAddressId && contactPerson.contactPersonId) {
      this.selectedContactPerson = {
        addressId: contactPerson.customerAddressId,
        contactPersonId: contactPerson.contactPersonId,
        name1: contactPerson.name1,
        name2: contactPerson.name2
      };
        if (contactPerson.visibleWeb === 1) {
          this.confirmMessage = `Do you want to make this contact person <b>not visible</b>: <b>${contactPerson.name1} ${contactPerson.name2}</b>?`;
        } else {
          this.confirmMessage = `Do you want to make this contact person <b>visible</b>: <b>${contactPerson.name1} ${contactPerson.name2}</b>?`;
        }
      this.visibleConfirmModal = true;
    }
  }

  onConfirmVisible() {
    if (this.selectedContactPerson && this.selectedContactPerson.addressId && this.selectedContactPerson.contactPersonId) {
      this.contactPersonUtils.toggleVisibleWeb(this.selectedContactPerson.addressId, this.selectedContactPerson.contactPersonId).subscribe({
        next: () => {
          // recargar datos o mostrar mensaje de éxito
          this.contactPersonUtils.getAllContactPersons().subscribe({
            next: (result) => {
              this.contactPersons = Array.isArray(result?.content) ? result.content : [];
            },
            error: () => {
              this.contactPersons = [];
            }
          });
        },
        error: () => {
          // mostrar mensaje de error
        }
      });
    }
    this.visibleConfirmModal = false;
    this.selectedContactPerson = null;
  }

  onCancelVisible() {
    this.visibleConfirmModal = false;
    this.selectedContactPerson = null;
  }
}