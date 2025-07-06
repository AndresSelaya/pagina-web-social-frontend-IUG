import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { MainLayoutComponent } from "./main-layout/main-layout.component";
import { TitleComponent } from "./components/title/title.component";
import { SalutationComponent } from "./components/salutation/salutation.component";

const routes: Routes = [
    {
        path: '',
        component: MainLayoutComponent,
        children: [
            { path: '', redirectTo: 'title', pathMatch: 'full'},
            { path: 'title', component: TitleComponent },
            { path: 'salutation', component: SalutationComponent }
        ]
    }   
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BmSocialRoutingModule { }
