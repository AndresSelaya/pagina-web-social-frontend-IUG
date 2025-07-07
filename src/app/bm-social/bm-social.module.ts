import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { TranslateDirective, TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { TooltipModule } from 'primeng/tooltip';
import { TitleComponent } from './components/title/title.component';
import { BmSocialRoutingModule } from './bm-social-routing.module';
import { SalutationComponent } from './components/salutation/salutation.component';
import { TitleFormComponent } from './components/title/components/title-form/title-form.component';
import { TitleTableComponent } from './components/title/components/title-table/title-table.component';
import { SalutationFormComponent } from './components/salutation/salutation-form/salutation-form.component';
import { SalutationTableComponent } from './components/salutation/salutation-table/salutation-table.component';
import { CardModule } from 'primeng/card';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { MessagesModule } from 'primeng/messages';
import { ToastModule } from 'primeng/toast';
import { TitleModalComponent } from './components/title/components/title-modal/title-modal.component';
import { SharedModule } from '../shared/shared.module';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';

@NgModule({
  declarations: [
    SidebarComponent,
    MainLayoutComponent,
    TitleComponent,
    SalutationComponent,
    TitleFormComponent,
    TitleTableComponent,
    SalutationFormComponent,
    SalutationTableComponent,
    TitleModalComponent,
  ],
  imports: [
    CommonModule,
    TieredMenuModule,
    TranslateDirective,
    TranslateModule,
    TranslatePipe,
    TooltipModule,
    BmSocialRoutingModule,
    CardModule,
    ReactiveFormsModule,
    ButtonModule,
    MessagesModule,
    ToastModule,
    SharedModule,
    DialogModule,
    InputTextModule
  ],
  exports: [
    SidebarComponent,
    MainLayoutComponent
  ]
})
export class BmSocialModule { }
