import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventService } from '../../../../services/event.service';

// Define a minimal Event type for selectedEvent
type EventEntity = {
  uuid?: string;
  title?: string;
  [key: string]: any;
};

@Component({
  selector: 'app-event-modal',
  templateUrl: './event-modal.component.html',
  styleUrls: ['./event-modal.component.scss']
})
export class EventModalComponent implements OnInit, OnChanges {
  @Input() modalType: 'create' | 'edit' | 'delete' = 'create';
  @Input() selectedEvent: EventEntity | null = null;
  @Input() visible: boolean = false;
  @Input() eventName: string = '';
  @Output() isVisibleModal = new EventEmitter<boolean>();
  @Output() eventCreated = new EventEmitter<void>();
  @Output() eventDeleted = new EventEmitter<{severity: string, summary: string, detail: string}>();
  eventForm: FormGroup;
  organizerName: string = 'Julio Aspiazu'; // Puedes obtenerlo dinámicamente
  showEndDate: boolean = false;
  coverPreview: string | null = null;
  isLoading = false;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder, private eventService: EventService) {
    this.eventForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      startDate: ['', Validators.required],
      startTime: ['', Validators.required],
      timezone: ['UTC-04', Validators.required],
      endDate: [''],
      endTime: [''],
      isPublic: [true, Validators.required],
      virtual: ['in-person', Validators.required],
      location: ['', Validators.required],
      maxCapacity: [100, Validators.required],
      description: [''],
      coverImagePath: ['']
    });
  }

  ngOnInit(): void {
    this.resetForm();
    if (this.modalType === 'delete' && this.selectedEvent) {
      // Optionally patch form or set up for delete
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['visible'] && !changes['visible'].firstChange) {
      if (this.visible) {
        if (this.modalType === 'create') {
          this.resetForm();
        } else if (this.modalType === 'edit' && this.selectedEvent) {
          this.eventForm.patchValue({
            ...this.selectedEvent,
            startDate: this.selectedEvent['startDate'] ? this.selectedEvent['startDate'].split('T')[0] : '',
            startTime: this.selectedEvent['startDate'] ? this.selectedEvent['startDate'].split('T')[1]?.substring(0,5) : '',
            endDate: this.selectedEvent['endDate'] ? this.selectedEvent['endDate'].split('T')[0] : '',
            endTime: this.selectedEvent['endDate'] ? this.selectedEvent['endDate'].split('T')[1]?.substring(0,5) : ''
          });
        }
      }
    }
    if (changes['modalType'] && !changes['modalType'].firstChange) {
      if (this.modalType === 'create') {
        this.resetForm();
      } else if (this.modalType === 'edit' && this.selectedEvent) {
        this.eventForm.patchValue({
          ...this.selectedEvent,
          startDate: this.selectedEvent['startDate'] ? this.selectedEvent['startDate'].split('T')[0] : '',
          startTime: this.selectedEvent['startDate'] ? this.selectedEvent['startDate'].split('T')[1]?.substring(0,5) : '',
          endDate: this.selectedEvent['endDate'] ? this.selectedEvent['endDate'].split('T')[0] : '',
          endTime: this.selectedEvent['endDate'] ? this.selectedEvent['endDate'].split('T')[1]?.substring(0,5) : ''
        });
      }
    }
  }

  get isCreateMode(): boolean {
    return this.modalType === 'create';
  }
  get isEditMode(): boolean {
    return this.modalType === 'edit';
  }
  get isDeleteMode(): boolean {
    return this.modalType === 'delete';
  }

  onCoverChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.coverPreview = e.target.result;
        this.eventForm.patchValue({ coverImagePath: file.name });
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    // Forzar validación visual
    this.eventForm.markAllAsTouched();
    if (this.shouldPreventSubmission()) {
      this.errorMessage = 'Please fill all required fields.';
      return;
    }
    this.prepareForSubmission();
    const formValue = this.eventForm.value;
    const eventBody = {
      title: formValue.title,
      location: formValue.location,
      description: formValue.description,
      startDate: formValue.startDate + 'T' + formValue.startTime,
      endDate: formValue.endDate ? (formValue.endDate + 'T' + formValue.endTime) : '',
      maxCapacity: formValue.maxCapacity,
      isPublic: formValue.isPublic,
      requiresRegistration: true,
      status: 'DRAFT',
      coverImagePath: formValue.coverImagePath
    };
    if (this.isCreateMode) {
      this.eventService.createEvent(eventBody).subscribe({
        next: () => {
          this.isLoading = false;
          this.eventCreated.emit();
          this.handleClose();
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.message ?? 'Failed to create event';
        }
      });
    } else if (this.isEditMode && this.selectedEvent && this.selectedEvent.uuid) {
      this.eventService.updateEvent(this.selectedEvent.uuid, eventBody).subscribe({
        next: () => {
          this.isLoading = false;
          this.eventCreated.emit();
          this.handleClose();
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.message ?? 'Failed to update event';
        }
      });
    } else {
      this.isLoading = false;
      this.errorMessage = 'No event selected for editing.';
    }
  }

  onDeleteConfirm(): void {
    if (!this.selectedEvent || !this.selectedEvent.uuid) return;
    this.isLoading = true;
    this.eventService.deleteEvent(this.selectedEvent.uuid).subscribe({
      next: () => {
        this.isLoading = false;
        this.eventDeleted.emit({
          severity: 'success',
          summary: 'Successfully deleted',
          detail: 'Event successfully deleted'
        });
        this.handleClose();
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.message ?? 'Failed to delete event';
        this.eventDeleted.emit({
          severity: 'error',
          summary: 'EVENT.DELETE_FAILED',
          detail: this.errorMessage || 'Failed to delete event'
        });
        this.handleClose();
      }
    });
  }

  shouldPreventSubmission(): boolean {
    return this.eventForm.invalid || this.isLoading;
  }

  prepareForSubmission(): void {
    this.isLoading = true;
    this.errorMessage = null;
  }

  handleClose(): void {
    this.isLoading = false;
    this.isVisibleModal.emit(false);
    this.resetForm();
  }

  onCancel(): void {
    this.handleClose();
  }

  resetForm(): void {
    this.eventForm.reset({
      title: '',
      startDate: '',
      startTime: '',
      timezone: 'UTC-04',
      endDate: '',
      endTime: '',
      isPublic: true,
      virtual: 'in-person',
      location: '',
      maxCapacity: 100,
      description: '',
      coverImagePath: ''
    });
    this.coverPreview = null;
    this.errorMessage = null;
  }
}
