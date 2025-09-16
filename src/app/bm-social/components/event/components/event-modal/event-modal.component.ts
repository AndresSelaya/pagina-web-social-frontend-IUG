import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventService } from '../../../../services/event.service';

@Component({
  selector: 'app-event-modal',
  templateUrl: './event-modal.component.html',
  styleUrls: ['./event-modal.component.scss']
})
export class EventModalComponent {
  visible: boolean = false;
  eventForm: FormGroup;
  organizerName: string = 'Julio Aspiazu'; // Puedes obtenerlo dinámicamente
  showEndDate: boolean = false;
  coverPreview: string | null = null;
  onCoverChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.coverPreview = e.target.result;
        this.eventForm.patchValue({ coverImagePath: file.name }); // O subir y guardar la ruta real
      };
      reader.readAsDataURL(file);
    }
  }

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

  onAddOrganizer() {
    // lógica para agregar organizador
  }

  onSubmit() {
      console.log('Submit called', this.eventForm.valid, this.eventForm.value);
    if (this.eventForm.invalid) return;
    const formValue = this.eventForm.value;
    // Construir el body para el endpoint
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
    this.eventService.createEvent(eventBody).subscribe({
      next: () => {
        // cerrar modal y mostrar éxito
        this.visible = false;
      },
      error: () => {
        // mostrar error
      }
    });
  }
}
