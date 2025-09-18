import { Component, Input, Output, EventEmitter } from '@angular/core';
import { EventRegistration } from '../../../bm-social/services/event.service';
import { Event } from '../../../bm-social/services/event.service';

@Component({
  selector: 'app-participants-modal',
  templateUrl: './participants-modal.component.html',
  styleUrls: ['./participants-modal.component.scss']
})
export class ParticipantsModalComponent {
  @Input() show = false;
  @Input() event: Event | null = null;
  @Input() participants: EventRegistration[] = [];
  @Input() loading = false;
  @Input() error: string | null = null;
  @Output() close = new EventEmitter<void>();

  onClose() {
    this.close.emit();
  }
}
