import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { MainLayoutComponent } from "./main-layout/main-layout.component";
import { TitleComponent } from "./components/title/title.component";
import { SalutationComponent } from "./components/salutation/salutation.component";
import { CountriesComponent } from "./components/countries/countries.component";
import { PersonTypesComponent } from "./components/person-types/person-types.component";
import { CustomerComponent } from './components/customer/customer.component';
import { EventComponent } from './components/event/event.component';
import { ContactPersonComponent } from './components/contact-person/contact-person.component';

const routes: Routes = [
    {
        path: '',
        component: MainLayoutComponent,
        children: [
            { path: '', redirectTo: 'title', pathMatch: 'full'},
            { path: 'title', component: TitleComponent },
            { path: 'salutation', component: SalutationComponent },
            { path: 'countries', component: CountriesComponent },
            { path: 'person-types', component: PersonTypesComponent },
            { path: 'customer', component: CustomerComponent },
            { path: 'event', component: EventComponent },
            { path: 'contact-person', component: ContactPersonComponent }
        ]
    }   
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BmSocialRoutingModule { }
