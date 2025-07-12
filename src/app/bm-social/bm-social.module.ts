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
import { SalutationFormComponent } from './components/salutation/components/salutation-form/salutation-form.component';
import { SalutationTableComponent } from './components/salutation/components/salutation-table/salutation-table.component';
import { SalutationModalComponent } from './components/salutation/components/salutation-modal/salutation-modal.component';
import { CardModule } from 'primeng/card';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { MessagesModule } from 'primeng/messages';
import { ToastModule } from 'primeng/toast';
import { TitleModalComponent } from './components/title/components/title-modal/title-modal.component';
import { SharedModule } from '../shared/shared.module';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { CountriesComponent } from './components/countries/countries.component';
import { PersonTypesComponent } from './components/person-types/person-types.component';
import { CountryTableComponent } from './components/countries/components/country-table/country-table.component';
import { CountryFormComponent } from './components/countries/components/country-form/country-form.component';
import { CountryModalComponent } from './components/countries/components/country-modal/country-modal.component';
import { PersonFormComponent } from './components/person-types/components/person-form/person-form.component';
import { PersonModalComponent } from './components/person-types/components/person-modal/person-modal.component';
import { PersonTableComponent } from './components/person-types/components/person-table/person-table.component';

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
    SalutationModalComponent,
    CountriesComponent,
    PersonTypesComponent,
    CountryTableComponent,
    CountryFormComponent,
    CountryModalComponent,
    PersonFormComponent,
    PersonModalComponent,
    PersonTableComponent,
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
