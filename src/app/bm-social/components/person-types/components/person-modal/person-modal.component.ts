import { Component, ElementRef, EventEmitter, inject, Input, Output, ViewChild } from '@angular/core';
import { PersonTypeUtils } from '../../utils/person-type.utils';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { catchError, finalize, of, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-person-modal',
  templateUrl: './person-modal.component.html',
  styleUrl: './person-modal.component.scss'
})
export class PersonModalComponent {
  private readonly personUtils = inject(PersonTypeUtils);
  @ViewChild('personInput') personInput!: ElementRef<HTMLInputElement>;
  @Input() modalType: 'create' | 'delete' = 'create';
  @Input() personToDelete: number | null = null;
  @Input() personName: string | null = null;
  @Output() isVisibleModal = new EventEmitter<boolean>();
  @Output() personCreated = new EventEmitter<void>();
  @Output() confirmDelete = new EventEmitter<number>();

  isLoading = false;
  errorMessage: string | null = null;

  readonly createPersonForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(50)])
  });

  ngOnInit(): void {
    this.resetForm();
  }

  get isCreateMode(): boolean {
    return this.modalType === 'create';
  }

  onDeleteConfirm(): void {
    this.isLoading = true;
    this.errorMessage = null;
    
    if(this.personToDelete){
      this.personUtils.deletePerson(this.personToDelete).subscribe({
        next: () => {
          this.isLoading = false;
          this.confirmDelete.emit(); 
          this.closeModal();
          // Refrescar la tabla después de eliminar
          this.personUtils.refreshPersons().subscribe();
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.message ?? 'Failed to delete person';
          console.error('Delete error:', error);
        }
      });
    }
  }  

  onSubmit(): void {
    if (this.shouldPreventSubmission()) return;

    this.prepareForSubmission();
    const personName = this.getSanitizedPersonName();

    this.personUtils.personExists(personName).pipe(
      switchMap(exists => this.handlePersonExistence(exists, personName)),
      catchError(err => this.handleError('PERSON.ERROR.CHECKING_DUPLICATE', err)),
      finalize(() => {
        this.isLoading = false;
        // Solo cerrar el modal si la creación fue exitosa
        if (!this.errorMessage) {
          this.handleClose();
        }
      })
    ).subscribe({
      next: (result) => {
        if (result) {
          // Creación exitosa
          this.handleClose();
        }
      },
      error: (err) => {
        console.error('Error in creation process:', err);
      }
    });
  }

  private shouldPreventSubmission(): boolean {
    return this.createPersonForm.invalid || this.isLoading;
  }

  private prepareForSubmission(): void {
    this.isLoading = true;
    this.errorMessage = null;
  }

  private getSanitizedPersonName(): string {
    return this.createPersonForm.value.name?.trim() ?? '';
  }

  private handlePersonExistence(exists: boolean, personName: string) {
    if (exists) {
      this.errorMessage = 'PERSON.ERROR.ALREADY_EXISTS';
      return of(null);
    }

    return this.personUtils.createNewPerson(personName).pipe(
      tap((createdPerson) => {
        if (createdPerson) {
          // Refrescar la tabla después de crear
          this.personUtils.refreshPersons().subscribe();
        }
      }),
      catchError(err => this.handleError('PERSON.ERROR.CREATION_FAILED', err))
    );
  }

  private handleError(messageKey: string, error: any) {
    this.errorMessage = messageKey;
    console.error('Error:', error);
    return of(null);
  }

  private resetForm(): void {
    this.createPersonForm.reset();
  }

  handleClose(): void {
    this.isLoading = false;
    this.isVisibleModal.emit(false);
    this.resetForm();
  }

  closeModal(): void {
    this.isVisibleModal.emit(false);
    this.createPersonForm.reset();
  }

  onCancel(): void {
    this.handleClose();
  }

  public focusInputIfNeeded() {
    if (this.isCreateMode && this.personInput) {
      setTimeout(() => {
        if (this.personInput?.nativeElement) {
          this.personInput.nativeElement.focus(); 
        }
      }, 150); 
    }
  }
}
