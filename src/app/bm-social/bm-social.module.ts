import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { MainLayoutComponent } from './main-layout/main-layout.component';



@NgModule({
  declarations: [
    SidebarComponent,
    MainLayoutComponent,
  ],
  imports: [
    CommonModule
  ]
})
export class BmSocialModule { }
