import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { EventFormComponent } from './event-form/event-form.component';
import { EventDetailComponent } from './event-detail/event-detail.component';

@NgModule({
  declarations: [
    EventFormComponent,
    EventDetailComponent
  ],
  imports: [CommonModule, ReactiveFormsModule],
  exports: [
    EventFormComponent,
    EventDetailComponent
  ]
})
export class ProductModule {}
