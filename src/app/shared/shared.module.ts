import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeneralTableComponent } from './components/general-table/general-table.component';
import { TableModule } from 'primeng/table';
import { MultiSelectModule } from 'primeng/multiselect';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { DropdownModule } from 'primeng/dropdown';
import { MessagesModule } from 'primeng/messages';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    GeneralTableComponent
  ],
  imports: [
    CommonModule,
    TableModule,
    MultiSelectModule,
    FormsModule,
    TranslatePipe,
    DropdownModule,
    MessagesModule,
    ToolbarModule,
    ButtonModule,
    FileUploadModule,
    RouterModule
  ],
  exports: [
    GeneralTableComponent
  ],
})
export class SharedModule { }
