import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { EventFormComponent } from './event-form/event-form.component';

@NgModule({
  declarations: [EventFormComponent],
  imports: [CommonModule, ReactiveFormsModule],
  exports: [EventFormComponent]
})
export class ProductModule {}
