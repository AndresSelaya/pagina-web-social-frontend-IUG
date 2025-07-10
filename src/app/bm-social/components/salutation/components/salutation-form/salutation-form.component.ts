import { Component } from '@angular/core';
import { Salutation } from '../../../../interfaces/salutation';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { SalutationUtils } from '../../utils/salutation.utils';
import { SalutationStateService } from '../../utils/salutation-state.service';

@Component({
  selector: 'app-salutation-form',
  templateUrl: './salutation-form.component.html',
  styleUrl: './salutation-form.component.scss',
  providers: [MessageService]
})
export class SalutationFormComponent {
  public showOCCErrorModaSalutation = false;
  currentSalutation: Salutation | null = null;
  editSalutationForm!: FormGroup;
  isSaving = false;
  private readonly subscriptions = new Subscription();
  private readonly editSalutationSource = new BehaviorSubject<Salutation | null>(null);

  constructor(
    private readonly salutationUtils: SalutationUtils,
    private readonly salutationStateService: SalutationStateService,
    private readonly messageService: MessageService,
    private readonly translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.setupSalutationSubscription();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  setSalutationToEdit(salutation: Salutation | null) {
    this.editSalutationSource.next(salutation);
  }

  private initForm(): void {
    this.editSalutationForm = new FormGroup({
      salutation: new FormControl('', [Validators.required])
    });
  }

  private setupSalutationSubscription(): void {
    this.subscriptions.add(
      this.salutationStateService.currentSalutation$.subscribe(salutation => {
        this.currentSalutation = salutation;
        salutation ? this.loadSalutationData(salutation) : this.clearForm();
      })
    );
  }

  private loadSalutationData(salutation: Salutation): void {
    this.editSalutationForm.patchValue({ salutation: salutation.salutationLabel });
  }

  clearForm(): void {
    this.editSalutationForm.reset();
    this.currentSalutation = null;
    this.isSaving = false;
  }

  onSubmit(): void {
    if (this.editSalutationForm.invalid || !this.currentSalutation || this.isSaving) {
      this.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    const updatedSalutation: Salutation = {
      ...this.currentSalutation,
      salutationLabel: this.editSalutationForm.value.salutation
    };

    this.subscriptions.add(
      this.salutationUtils.updateSalutation(updatedSalutation).subscribe({
        next: (savedSalutation) => this.handleSaveSuccess(savedSalutation),
        error: (err) => this.handleError(err)
      })
    );
  }

  private handleError(err: any): void {
    if (err.message === 'Version conflict: Salutation has been updated by another user') {
      this.showOCCErrorModaSalutation = true;
    } else {
      this.handleSaveError(err);
    }
    this.isSaving = false;
  }

  private handleSaveSuccess(savedSalutation: Salutation): void {
    this.messageService.add({
      severity: 'success',
      summary: this.translate.instant('SALUTATION.MESSAGE.SUCCESS'),
      detail: this.translate.instant('SALUTATION.MESSAGE.UPDATE_SUCCESS')
    });
    this.salutationStateService.setSalutationToEdit(null);
    this.clearForm();
  }

  private handleSaveError(error: any): void {
    console.error('Error saving salutation:', error);
    this.messageService.add({
      severity: 'error',
      summary: this.translate.instant('SALUTATION.MESSAGE.ERROR'),
      detail: this.translate.instant('SALUTATION.MESSAGE.UPDATE_FAILED')
    });
    this.isSaving = false;
  }

  private markAllAsTouched(): void {
    Object.values(this.editSalutationForm.controls).forEach(control => {
      control.markAsTouched();
      control.markAsDirty();
    });
  }
}
