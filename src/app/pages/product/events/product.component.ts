import { Component, OnInit } from '@angular/core';
import { EventService, Event, EventRegistration } from '../../../bm-social/services/event.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  events: Event[] = [];
  loading = true;
  error: string | null = null;

  showParticipantsModal = false;
  selectedEvent: Event | null = null;
  participants: EventRegistration[] = [];
  participantsLoading = false;
  participantsError: string | null = null;

  showEventForm = false;

  constructor(private eventService: EventService) {}

  ngOnInit(): void {
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
