import { Component } from '@angular/core';
import { PersonType } from '../../../../interfaces/person-type';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Subscription } from 'rxjs';
import { PersonTypeUtils } from '../../utils/person-type.utils';
import { PersonTypeStateService } from '../../utils/person-type-state.service';
import { MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-person-form',
  templateUrl: './person-form.component.html',
  styleUrl: './person-form.component.scss',
  providers: [MessageService]
})
export class PersonFormComponent {
  public showOCCErrorModaPerson = false;
  currentPerson: PersonType | null = null;
  editPersonForm!: FormGroup;
  isSaving = false;
  private readonly subscriptions = new Subscription();
  private readonly editPersonSource = new BehaviorSubject<PersonType | null>(null);

  constructor(
    private readonly personUtils: PersonTypeUtils,
    private readonly personStateService: PersonTypeStateService,
    private readonly messageService: MessageService,
    private readonly translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.setupPersonSubscription();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  setPersonToEdit(person: PersonType | null) {
    this.editPersonSource.next(person);
  }

  private initForm(): void {
    this.editPersonForm = new FormGroup({
      name: new FormControl('', [Validators.required])
    });
  }

  private setupPersonSubscription(): void {
    this.subscriptions.add(
      this.personStateService.currentPerson$.subscribe(person => {
        this.currentPerson = person;
        person ? this.loadPersonData(person) : this.clearForm();
      })
    );
  }

  private loadPersonData(person: PersonType): void {
    this.editPersonForm.patchValue({ person: person.personTypeName });
  }

  clearForm(): void {
    this.editPersonForm.reset();
    this.currentPerson = null;
    this.isSaving = false;
  }

  onSubmit(): void {
    if (this.editPersonForm.invalid || !this.currentPerson || this.isSaving) {
      this.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    const updatedPerson: PersonType = {
      ...this.currentPerson,
      personTypeName: this.editPersonForm.value.name
    };

    this.subscriptions.add(
      this.personUtils.updatePerson(updatedPerson).subscribe({
        next: (savedPerson) => this.handleSaveSuccess(savedPerson),
        error: (err) => this.handleError(err)
      })
    );
  }

  private handleError(err: any): void {
    if (err.message === 'Version conflict: Person has been updated by another user') {
      this.showOCCErrorModaPerson = true;
    } else {
      this.handleSaveError(err);
    }
    this.isSaving = false;
  }

  private handleSaveSuccess(savedPerson: PersonType): void {
    this.messageService.add({
      severity: 'success',
      summary: this.translate.instant('PERSON.MESSAGE.SUCCESS'),
      detail: this.translate.instant('PERSON.MESSAGE.UPDATE_SUCCESS')
    });
    this.personStateService.setPersonTypeToEdit(null);
    this.clearForm();
  }

  private handleSaveError(error: any): void {
    console.error('Error saving person:', error);
    this.messageService.add({
      severity: 'error',
      summary: this.translate.instant('PERSON.MESSAGE.ERROR'),
      detail: this.translate.instant('PERSON.MESSAGE.UPDATE_FAILED')
    });
    this.isSaving = false;
  }

  private markAllAsTouched(): void {
    Object.values(this.editPersonForm.controls).forEach(control => {
      control.markAsTouched();
      control.markAsDirty();
    });
  }
}
