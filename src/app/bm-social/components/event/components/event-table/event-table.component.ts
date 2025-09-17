
  import { Component, OnInit, ViewChild } from '@angular/core';
  import { EventService, Event } from '../../../../services/event.service';
  import { Subscription } from 'rxjs';
  import { EventModalComponent } from '../event-modal/event-modal.component';
  import { MessageService } from 'primeng/api';


@Component({
  selector: 'app-event-table',
  templateUrl: './event-table.component.html',
  styleUrls: ['./event-table.component.scss'],
  providers: [MessageService]
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

  // Modal control
  modalType: 'create' | 'edit' | 'delete' = 'create';
  isModalVisible: boolean = false;
  selectedEvent: Event | null = null;
  eventName: string = '';

  constructor(private eventService: EventService, private messageService: MessageService) {}
  onEventDeleted(message: {severity: string, summary: string, detail: string}): void {
    this.messageService.add({
      severity: message.severity,
      summary: message.summary,
      detail: message.detail,
    });
  }

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
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

  // Maneja eventos de la tabla (delete/create)
  handleTableEvents(event: { type: 'create' | 'edit' | 'delete', data?: any }): void {
    this.modalType = event.type;
    if ((event.type === 'delete' || event.type === 'edit') && event.data) {
      if (event.data.uuid) {
        this.selectedEvent = event.data;
        this.eventName = event.data.title ?? '';
      } else {
        const uuid = event.data;
        this.eventService.getEvent(uuid).subscribe({
          next: (ev) => {
            if (ev) {
              this.selectedEvent = ev;
              this.eventName = ev.title ?? '';
            }
          },
          error: (err) => {
            console.error('No se pudo obtener el evento:', err);
            this.eventName = '';
            this.selectedEvent = null;
          }
        });
      }
    } else if (event.type === 'create') {
      this.selectedEvent = null;
      this.eventName = '';
    }
    this.isModalVisible = true;
  }
  onEditEventFromTable(event: Event | string) {
    this.handleTableEvents({ type: 'edit', data: event });
  }

  onModalVisibilityChange(visible: boolean) {
    this.isModalVisible = visible;
    if (!visible) {
      this.selectedEvent = null;
      this.eventName = '';
    }
  }

  refreshEvents() {
    this.loadEvents();
  }

  // Para compatibilidad con el general-table
  onViewEvent(event: Event) {
    this.handleTableEvents({ type: 'delete', data: event });
  }

  onNewEventFromTable() {
    this.handleTableEvents({ type: 'create' });
  }
}
