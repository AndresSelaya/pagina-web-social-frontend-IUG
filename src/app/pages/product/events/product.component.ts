// ...existing code...
  import { Component, OnInit } from '@angular/core';
import { EventService, Event, EventRegistration } from '../../../bm-social/services/event.service';
import { AuthService } from '../../../authentication/services/auth.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  registeringEventUuid: string | null = null;
  registrationError: string | null = null;
  registeredEvents = new Set<string>();
  registrationSuccessEventUuid: string | null = null;

  registerToEvent(event: Event) {
    this.registeringEventUuid = event.uuid;
    this.registrationError = null;
    this.eventService.registerForEvent(event.uuid).subscribe({
      next: (registration) => {
        this.registeredEvents.add(event.uuid);
        this.registrationSuccessEventUuid = event.uuid;
        this.registeringEventUuid = null;
        setTimeout(() => {
          this.registrationSuccessEventUuid = null;
        }, 2500);
      },
      error: (err) => {
        this.registrationError = 'No se pudo registrar en el evento.';
        this.registeringEventUuid = null;
      }
    });
  }

  isRegistered(event: Event): boolean {
    return this.registeredEvents.has(event.uuid);
  }
  events: Event[] = [];
  loading = true;
  error: string | null = null;

  showParticipantsModal = false;
  selectedEvent: Event | null = null;
  participants: EventRegistration[] = [];
  participantsLoading = false;
  participantsError: string | null = null;

  showEventForm = false;

  private userUuid: string | null = null;

  constructor(private eventService: EventService, private authService: AuthService) {
    this.userUuid = this.authService.getUserId();
  }

  ngOnInit(): void {
    this.eventService.getEvents(0, 12).subscribe({
      next: (data) => {
        this.events = data.content;
        this.loading = false;
        // Opcional: cargar registros del usuario para todos los eventos
        this.loadUserRegistrations();
      },
      error: (err) => {
        this.error = 'Error al cargar los eventos';
        this.loading = false;
      }
    });
  }

  loadUserRegistrations() {
    if (!this.userUuid) return;
    this.events.forEach(ev => {
      this.eventService.getEventRegistrations(ev.uuid).subscribe({
        next: (regs) => {
          if (regs && regs.some(r => r.userUuid === this.userUuid)) {
            this.registeredEvents.add(ev.uuid);
          }
        }
      });
    });
  }

  openParticipantsModal(event: Event) {
    this.selectedEvent = event;
    this.showParticipantsModal = true;
    this.participants = [];
    this.participantsLoading = true;
    this.participantsError = null;
    this.eventService.getEventRegistrations(event.uuid).subscribe({
      next: (data) => {
        this.participants = data;
        this.participantsLoading = false;
      },
      error: (err) => {
        this.participantsError = 'Error al cargar los participantes';
        this.participantsLoading = false;
      }
    });
  }

  closeParticipantsModal() {
    this.showParticipantsModal = false;
    this.selectedEvent = null;
    this.participants = [];
    this.participantsError = null;
    this.participantsLoading = false;
  }

  openEventForm() {
    this.showEventForm = true;
  }

  closeEventForm() {
    this.showEventForm = false;
  }

  onEventCreated() {
    this.closeEventForm();
    this.refreshEvents();
  }

  refreshEvents() {
    this.loading = true;
    this.error = null;
    this.eventService.getEvents(0, 12).subscribe({
      next: (data) => {
        this.events = data.content;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar los eventos';
        this.loading = false;
      }
    });
  }
}
