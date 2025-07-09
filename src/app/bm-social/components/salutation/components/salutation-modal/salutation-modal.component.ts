import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { SalutationUtils } from '../../utils/salutation.utils';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-salutation-modal',
  templateUrl: './salutation-modal.component.html',
  styleUrl: './salutation-modal.component.scss',
  providers: [MessageService]
})
export class SalutationModalComponent implements OnInit {
  @Input() modalType: 'create' | 'delete' = 'create';
  @Input() salutationName: string = '';
  @Input() salutationToDelete: number | null = null;
  @Output() isVisibleModal = new EventEmitter<boolean>();
  @ViewChild('salutationInput') salutationInput!: ElementRef;

  modalSalutationForm!: FormGroup;
  isSaving = false;
  private subscriptions = new Subscription();

  constructor(
    private readonly salutationUtils: SalutationUtils,
    private readonly messageService: MessageService,
    private readonly translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  focusInputIfNeeded(): void {
    if (this.modalType === 'create' && this.salutationInput) {
      setTimeout(() => {
        this.salutationInput.nativeElement.focus();
      }, 100);
    }
  }

  private initForm(): void {
    this.modalSalutationForm = new FormGroup({
      salutation: new FormControl('', [Validators.required])
    });
  }

  onSubmit(): void {
    if (this.modalType === 'create') {
      this.createSalutation();
    } else if (this.modalType === 'delete') {
      this.deleteSalutation();
    }
  }

  private createSalutation(): void {
    if (this.modalSalutationForm.invalid || this.isSaving) {
      this.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    const salutationText = this.modalSalutationForm.value.salutation;

    this.subscriptions.add(
      this.salutationUtils.createNewSalutation(salutationText).subscribe({
        next: (newSalutation) => {
          this.messageService.add({
            severity: 'success',
            summary: this.translate.instant('SALUTATION.MESSAGE.SUCCESS'),
            detail: this.translate.instant('SALUTATION.MESSAGE.CREATE_SUCCESS')
          });
          this.closeModal();
          this.isSaving = false;
        },
        error: (err) => {
          console.error('Error creating salutation:', err);
          this.messageService.add({
            severity: 'error',
            summary: this.translate.instant('SALUTATION.MESSAGE.ERROR'),
            detail: this.translate.instant('SALUTATION.MESSAGE.CREATE_FAILED')
          });
          this.isSaving = false;
        }
      })
    );
  }

  private deleteSalutation(): void {
    if (!this.salutationToDelete || this.isSaving) {
      return;
    }

    this.isSaving = true;
    this.subscriptions.add(
      this.salutationUtils.deleteSalutation(this.salutationToDelete).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: this.translate.instant('SALUTATION.MESSAGE.SUCCESS'),
            detail: this.translate.instant('SALUTATION.MESSAGE.DELETE_SUCCESS')
          });
          this.closeModal();
          this.isSaving = false;
        },
        error: (err) => {
          console.error('Error deleting salutation:', err);
          this.messageService.add({
            severity: 'error',
            summary: this.translate.instant('SALUTATION.MESSAGE.ERROR'),
            detail: this.translate.instant('SALUTATION.MESSAGE.DELETE_FAILED')
          });
          this.isSaving = false;
        }
      })
    );
  }

  closeModal(): void {
    this.modalSalutationForm.reset();
    this.isSaving = false;
    this.isVisibleModal.emit(false);
  }

  private markAllAsTouched(): void {
    Object.values(this.modalSalutationForm.controls).forEach(control => {
      control.markAsTouched();
      control.markAsDirty();
    });
  }
}
