import { Component, computed, inject, ViewChild } from '@angular/core';
import { CountryUtils } from '../../utils/country.utils';
import { CountryService } from '../../../../services/country.service';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { MessageService } from 'primeng/api';
import { CountryModalComponent } from '../country-modal/country-modal.component';
import { _, TranslateService } from '@ngx-translate/core';
import { CountryStateService } from '../../utils/country-state.service';
import { Country } from '../../../../interfaces/country';

@Component({
  selector: 'app-country-table',
  templateUrl: './country-table.component.html',
  styleUrl: './country-table.component.scss',
  providers: [MessageService]
})
export class CountryTableComponent {
  private readonly countryUtils = new CountryUtils();
  private readonly countryService = inject(CountryService);
  private readonly destroy$ = new Subject<void>();
  private readonly messageService = inject(MessageService);
  visibleModal: boolean = false;
  modalType: 'create' | 'delete' = 'create';
  selectedCountry: number | null = null;
  CountryName: string = '';
  @ViewChild('countryModal') countryModalComponent!: CountryModalComponent;

  handleTableEvents(event: { type: 'create' | 'delete', data?: any }): void {
    this.modalType = event.type;
    if (event.type === 'delete' && event.data) {
      this.selectedCountry = event.data;

      this.countryUtils.getCountryById(this.selectedCountry!).subscribe({
        next: (country) => {
          this.CountryName = country?.countryName ?? '';
        },
        error: (err) => {
          console.error('No se pudo obtener el título:', err);
          this.CountryName = '';
        }
      });
    }
    this.visibleModal = true;
  }
  columnsHeaderFieldCoutries: any[] = [];
  // userCountriesPreferences: UserPreference = {};
  tableKey: string = 'Countries'
  dataKeys = ['countryName', 'areaCode', 'prefix'];

  private langSubscription!: Subscription;

  constructor(
    private readonly translate: TranslateService,
    // private readonly userPreferenceService: UserPreferenceService,
    private readonly countryStateService: CountryStateService
  ) { }

  ngOnInit(): void {

    this.loadColumnsCountries();
    // this.userCountriesPreferences = this.userPreferenceService.getUserPreferences(this.tableKey, this.columnsHeaderFieldCoutries);
    this.langSubscription = this.translate.onLangChange.subscribe(() => {
      // this.loadColumnsCountries();
      // this.userCountriesPreferences = this.userPreferenceService.getUserPreferences(this.tableKey, this.columnsHeaderFieldCoutries);
    });
    this.countryService.loadInitialData().pipe(
      takeUntil(this.destroy$)
    ).subscribe();
  }

  readonly countries = computed(() => {
    return this.countryService.countries().map(country => ({
      countryId: country.countryId,
      countryName: country.countryName,
      areaCode: country.areaCode,
      prefix: country.prefix
    }));
  });

  onUserCountriesPreferencesChanges(userCountriesPreferences: any) {
    localStorage.setItem('userPreferences', JSON.stringify(userCountriesPreferences));
  }

  loadColumnsCountries(): void {
    this.columnsHeaderFieldCoutries = [
      {
        field: 'countryName',
        header: this.translate.instant(_('COUNTRIES.TABLE.NAME')),
        styles: { width: '200px' },
      },
      {
        field: 'areaCode',
        header: this.translate.instant(_('COUNTRIES.TABLE.AREA_CODE')),
        styles: { width: '120px' },
      },
      {
        field: 'prefix',
        header: this.translate.instant(_('COUNTRIES.TABLE.PREFIX')),
        styles: { width: '100px' },
      },
    ];
  }

  ngOnDestroy(): void {
    if (this.langSubscription) {
      this.langSubscription.unsubscribe();
    }
    this.destroy$.next();
    this.destroy$.complete();
  }
   onVisibleModal(visible: boolean){
    this.visibleModal = visible;
  }
  onModalVisibilityChange(visible: boolean): void {
    this.visibleModal = visible;
    if (!visible) {
      this.selectedCountry = null;
    }
  }
  editCountry(country: Country) {
    const countryToEdit: Country = {
      countryId: country.countryId,
      areaCode: country.areaCode,
      companyId: country.companyId,
      countryName: country.countryName,
      currencyId: country.currencyId,
      prefix: country.prefix,
      version: country.version
    };

    this.countryUtils.getCountryById(countryToEdit.countryId).subscribe({
      next: (fullCountry) => {
        if (fullCountry) {
          this.countryStateService.setCountryToEdit(fullCountry);
        }
      },
      error: (err) => {
        console.error('Error al cargar país:', err);
      }
    });
  }

  onDialogShow() {
    if (this.modalType === 'create' && this.countryModalComponent) {
      this.countryModalComponent.focusInputIfNeeded();
    }
  }

  onConfirmDelete(message: {severity: string, summary: string, detail: string}): void {
    this.messageService.add({
      severity: message.severity,
      summary: this.translate.instant(_(message.summary)),
      detail: this.translate.instant(_(message.detail)),
    });
  }
}
