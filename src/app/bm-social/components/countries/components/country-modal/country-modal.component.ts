import { Component, ElementRef, EventEmitter, inject, Input, Output, ViewChild } from '@angular/core';
import { CountryUtils } from '../../utils/country.utils';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { catchError, finalize, of, switchMap } from 'rxjs';
import { Country } from '../../../../interfaces/country';

@Component({
  selector: 'app-country-modal',
  templateUrl: './country-modal.component.html',
  styleUrl: './country-modal.component.scss'
})
export class CountryModalComponent {
  private readonly countryUtils = inject(CountryUtils);

  @Input() modalType: 'create' | 'delete' = 'create';
  @Input() countryToDelete: Country | null = null;
  @Input() countryName: string | null = null;
  @Output() isVisibleModal = new EventEmitter<boolean>();
  @Output() countryCreated = new EventEmitter<void>();
  @Output() confirmDelete = new EventEmitter<{severity: string, summary: string, detail: string}>();
  @ViewChild('countryNameInput') countryNameInput!: ElementRef<HTMLInputElement>;
  
  isLoading = false;
  errorMessage: string | null = null;

  readonly createCountryForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]),
    areaCode: new FormControl('', [Validators.required, Validators.maxLength(10)]),
    prefix: new FormControl(null, [Validators.required, Validators.min(1), Validators.max(9999)])
  });

  ngOnInit(): void {
    this.resetForm();
  }

  get isCreateMode(): boolean {
    return this.modalType === 'create';
  }

  onSubmit(): void {
    if (this.shouldPreventSubmission()) return;

    this.prepareForSubmission();
    const { name, areaCode, prefix } = this.getCountryFormValues();

    this.countryUtils.countryExists(name).pipe(
      switchMap(exists => this.handleCountryExistence(exists, name, areaCode, prefix)),
      catchError(err => this.handleError('COUNTRIES.ERROR.CREATION_FAILED', err)),
      finalize(() => this.isLoading = false)
    ).subscribe(result => {
      if (result !== null) {
        this.countryCreated.emit();
        this.handleClose();
      }
    });
  }
  onDeleteConfirm(): void {
    this.isLoading = true;
    if (this.countryToDelete && this.countryToDelete.countryId) {
      this.countryUtils.deleteCountry(this.countryToDelete.countryId).subscribe({
        next: () => {
          this.isLoading = false;
          this.confirmDelete.emit({
            severity: 'success',
            summary: 'TABLE.MESSAGE.DELETE_SUCCESS',
            detail: 'TABLE.MESSAGE.DELETE_SUCCESS'
          });
          this.closeModal();
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.message ?? 'Failed to delete country';
          console.error('Delete error:', error);
          this.confirmDelete.emit({
            severity: 'error',
            summary: 'TABLE.MESSAGE.DELETE_FAILED',
            detail: this.errorMessage?.includes('it is in use by other entities') ? 'MESSAGE.DELETE_ERROR_IN_USE' : 'MESSAGE.DELETE_FAILED'
          });
          this.closeModal();
        }
      });
    } else {
      console.error('No country selected for deletion');
      this.isLoading = false;
    }
  }
  private handleCountryExistence(
    exists: boolean,
    name: string,
    areaCode: string,
    prefix: number
  ) {
    if (exists) {
      this.errorMessage = 'COUNTRIES.ERROR.ALREADY_EXISTS';
      return of(null);
    }
    
    return this.countryUtils.createNewCountry(name, areaCode, prefix).pipe(
      catchError(err => this.handleError('COUNTRIES.ERROR.CREATION_FAILED', err))
    );
  }
  private shouldPreventSubmission(): boolean {
    return this.createCountryForm.invalid || this.isLoading;
  }

  private prepareForSubmission(): void {
    this.isLoading = true;
    this.errorMessage = null;
  }

  private handleError(messageKey: string, error: any) {
    this.errorMessage = messageKey;
    console.error('Error:', error);
    return of(null);
  }

  private resetForm(): void {
    this.createCountryForm.reset();
  }

  handleClose(): void {
    this.isLoading = false;
    this.isVisibleModal.emit(false);
    this.resetForm();
  }

  closeModal(): void {
    this.isVisibleModal.emit(false);
    this.createCountryForm.reset();
  }

  onCancel(): void {
    this.handleClose();
  }
  
  private getCountryFormValues() {
    return {
      name: this.createCountryForm.value.name?.trim() ?? '',
      areaCode: this.createCountryForm.value.areaCode?.trim() ?? '',
      prefix: this.createCountryForm.value.prefix ?? 0
    };
  }

  public focusInputIfNeeded() {
    if (this.isCreateMode && this.countryNameInput) {
      setTimeout(() => {
        this.countryNameInput?.nativeElement?.focus();
      }, 150);
    }
  }
}
