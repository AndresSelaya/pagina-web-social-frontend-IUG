import { Component } from '@angular/core';
import { Country } from '../../../../interfaces/country';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CountryUtils } from '../../utils/country.utils';
import { CountryStateService } from '../../utils/country-state.service';
import { MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-country-form',
  templateUrl: './country-form.component.html',
  styleUrl: './country-form.component.scss',
  providers: [MessageService]
})
export class CountryFormComponent {
  currentCountry: Country | null = null;
  countryForm!: FormGroup;
  isSaving = false;
  private readonly subscriptions = new Subscription();
  public showOCCErrorModalCountry = false;
  
  constructor(
    private readonly countryUtils: CountryUtils,
    private readonly countryStateService: CountryStateService,
    private readonly messageService: MessageService,
    private readonly translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.setupCountrySubscription();
    // Check if we need to load a country after page refresh
    const savedCountryId = localStorage.getItem('selectedCountryId');
    if (savedCountryId) {
      this.loadCountryAfterRefresh(savedCountryId);
      localStorage.removeItem('selectedCountryId');
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private initForm(): void {
    this.countryForm = new FormGroup({
      countryName: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]),
      areaCode: new FormControl('', [Validators.required, Validators.maxLength(10)]),
      prefix: new FormControl('', [Validators.required, Validators.min(1), Validators.max(999)])
    });
  }

  private setupCountrySubscription(): void {
    this.subscriptions.add(
      this.countryStateService.currentCountry$.subscribe(country => {
        this.currentCountry = country;
        country ? this.loadCountryData(country) : this.clearForm();
      })
    );
  }

  private loadCountryData(country: Country): void {
    this.countryForm.patchValue({
      countryName: country.countryName,
      areaCode: country.areaCode,
      prefix: country.prefix
    });
  }

  clearForm(): void {
    this.countryForm.reset();
    this.currentCountry = null;
    this.isSaving = false;
  }

  onSubmit(): void {
    if (this.countryForm.invalid || !this.currentCountry || this.isSaving) {
      this.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    const updatedCountry: Country = {
      ...this.currentCountry,
      countryName: this.countryForm.value.countryName,
      areaCode: this.countryForm.value.areaCode,
      prefix: this.countryForm.value.prefix
    };

    this.subscriptions.add(
      this.countryUtils.updateCountry(updatedCountry).subscribe({
        next: () => this.handleSaveSuccess(),
        error: (err) => this.handleSaveError(err)
      })
    );
  }

  private handleSaveSuccess(): void {
    this.messageService.add({
      severity: 'success',
      summary: this.translate.instant('COUNTRIES.MESSAGE.SUCCESS'),
      detail: this.translate.instant('COUNTRIES.MESSAGE.UPDATE_SUCCESS')
    });
    this.countryStateService.setCountryToEdit(null);
    this.clearForm();
  }

  private handleSaveError(error: any): void {
    console.error('Error saving country:', error);
    if (error instanceof Error && error.message?.includes('version mismatch')) {
      this.showOCCErrorModalCountry = true;
      this.isSaving = false;
      return;
    }
    this.messageService.add({
      severity: 'error',
      summary: this.translate.instant('COUNTRIES.MESSAGE.ERROR'),
      detail: this.translate.instant('COUNTRIES.MESSAGE.UPDATE_FAILED')
    });
    this.isSaving = false;
  }

  private loadCountryAfterRefresh(countryId: string): void {
    this.isSaving = true;
    this.subscriptions.add(
      this.countryUtils.getCountryById(Number(countryId)).subscribe({
        next: (country) => {
          if (country) {
            this.countryStateService.setCountryToEdit(country);
          }
          this.isSaving = false;
        },
        error: () => {
          this.isSaving = false;
        }
      })
    );
  }

  onRefresh(): void {
    if (this.currentCountry?.countryId) {
      localStorage.setItem('selectedCountryId', this.currentCountry.countryId.toString());
      window.location.reload();
    }
  }

  private markAllAsTouched(): void {
    Object.values(this.countryForm.controls).forEach(control => {
      control.markAsTouched();
      control.markAsDirty();
    });
  }
}
