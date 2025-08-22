import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Participant } from './participants.service';
import { Product } from './product.service';

@Component({
  selector: 'app-participants-modal',
  templateUrl: './participants-modal.component.html',
  styleUrls: ['./participants-modal.component.scss']
})
export class ParticipantsModalComponent {
  @Input() show = false;
  @Input() product: Product | null = null;
  @Input() participants: Participant[] = [];
  @Input() loading = false;
  @Input() error: string | null = null;
  @Output() close = new EventEmitter<void>();

  onClose() {
    this.close.emit();
  }
}
