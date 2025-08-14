import { Component, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.scss']
})

export class EventFormComponent {
  @Output() eventCreated = new EventEmitter<void>();
  eventForm: FormGroup;
  submitting = false;
  successMsg = '';
  errorMsg = '';

  constructor(private fb: FormBuilder, private productService: ProductService) {
    this.eventForm = this.fb.group({
      productName: ['', Validators.required],
      productNumber: ['', Validators.required],
      currentVersion: ['', Validators.required],
      initDateTime: ['', Validators.required],
      endDateTime: ['', Validators.required],
      closingDateTime: ['', Validators.required],
      eventAddress: ['', Validators.required],
      maxParticipant: [null, [Validators.required, Validators.min(1)]],
      price: [null, [Validators.required, Validators.min(0)]],
      priceGross: [null, [Validators.required, Validators.min(0)]],
      websiteLink: [''],
      description: ['']
    });
  }

  onSubmit() {
    if (this.eventForm.valid) {
      this.submitting = true;
      this.successMsg = '';
      this.errorMsg = '';
      this.productService.createProduct(this.eventForm.value).subscribe({
        next: () => {
          this.successMsg = 'Event created successfully!';
          this.eventForm.reset();
          this.submitting = false;
          this.eventCreated.emit();
        },
        error: (err) => {
          this.errorMsg = 'Error creating event.';
          this.submitting = false;
        }
      });
    }
  }
}
