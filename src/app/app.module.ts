import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { BmSocialModule } from './bm-social/bm-social.module';
import { SharedModule } from './shared/shared.module';

import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { AuthInterceptor } from './authentication/http-interceptors/auth-interceptor';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { HomeComponent } from './components/home/home.component';
import { AuthenticationModule } from './authentication/authentication.module';
import { PostsModule } from './posts/posts.module';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NavbarComponent } from './components/navbar/navbar.component';

import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { PagesComponent } from './pages/pages.component';
import { NavbarPagesComponent } from './pages/navbar-pages/navbar-pages.component';
import { AboutUsComponent } from './pages/about-us/about-us.component';
import { AgreementsComponent } from './pages/agreements/agreements.component';
import { ProjectsComponent } from './pages/projects/projects.component';
import { ScholarshipsMobilityComponent } from './pages/scholarships-mobility/scholarships-mobility.component';
import { MembershipsComponent } from './pages/memberships/memberships.component';
import { ReportsComponent } from './pages/reports/reports.component';
import { CommentsModule } from "./comments/comments.module";
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ButtonModule } from 'primeng/button';
import { TranslateModule, TranslateLoader, TranslateDirective, TranslatePipe } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { MembersComponent } from './pages/members/members.component';
import { CompaniesComponent } from './pages/companies/companies.component';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    NavbarComponent,
    PagesComponent,
    NavbarPagesComponent,
    AboutUsComponent,
    AgreementsComponent,
    ProjectsComponent,
    ScholarshipsMobilityComponent,
    MembershipsComponent,
    ReportsComponent,
    MembersComponent,
    CompaniesComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AuthenticationModule,
    CommonModule,
    PostsModule,
    HttpClientModule,
    FontAwesomeModule,
    NgbModule,
    PdfViewerModule,
    CommentsModule,
    BrowserAnimationsModule,
    OverlayPanelModule,
    ButtonModule,
    TranslatePipe,
    TranslateDirective,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
      defaultLanguage: 'de',
    }),
    BmSocialModule,
    SharedModule
],
  providers: [
    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: AuthInterceptor,
    //   multi: true
    // }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(faUser); // Agrega el icono faUser a la librería
  }
}
