
  import { Component, OnInit, ViewChild } from '@angular/core';
  import { EventService, Event } from '../../../../services/event.service';
  import { Subscription } from 'rxjs';
  import { EventModalComponent } from '../event-modal/event-modal.component';


@Component({
  selector: 'app-event-table',
  templateUrl: './event-table.component.html',
  styleUrls: ['./event-table.component.scss']
})
export class EventTableComponent implements OnInit {
  @ViewChild(EventModalComponent) eventModal!: EventModalComponent;
  events: Event[] = [];
  loading: boolean = false;
  private eventSub?: Subscription;

  tableKey: string = 'Events';
  columnsHeaderFieldEvents: any[] = [
    { field: 'title', header: 'Títle' },
    { field: 'location', header: 'Ubication' },
    { field: 'startDate', header: 'Start date' },
    { field: 'endDate', header: 'End date' },
    { field: 'maxCapacity', header: 'Capacity' },
    { field: 'status', header: 'State' }
  ];
  dataKeys: string[] = ['title', 'location', 'startDate', 'endDate', 'maxCapacity', 'status'];
  selectedEvent: Event | null = null;

  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    this.loading = true;
    this.eventSub = this.eventService.getEvents(0, 12).subscribe({
      next: (result: any) => {
        this.events = (result.content || []).map((e: Event) => ({
          ...e,
          startDate: e.startDate ? e.startDate.split('T')[0] : '',
          endDate: e.endDate ? e.endDate.split('T')[0] : ''
        }));
        this.loading = false;
      },
      error: () => {
        this.events = [];
        this.loading = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.eventSub?.unsubscribe();
  }

  onViewEvent(event: Event) {
    this.selectedEvent = event;
    // Aquí puedes abrir un modal o mostrar detalles
  }

  // Este método será llamado desde general-table
  onNewEventFromTable() {
    if (this.eventModal) {
      this.eventModal.visible = true;
      this.eventModal.eventForm.reset();
    }
  }
}
