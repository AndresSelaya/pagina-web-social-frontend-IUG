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


@NgModule({
  declarations: [
    SidebarComponent,
    MainLayoutComponent,
    TitleComponent,
    SalutationComponent,
  ],
  imports: [
    CommonModule,
    TieredMenuModule,
    TranslateDirective,
    TranslateModule,
    TranslatePipe,
    TooltipModule,
    BmSocialRoutingModule
  ],
  exports: [
    SidebarComponent,
    MainLayoutComponent
  ]
})
export class BmSocialModule { }
