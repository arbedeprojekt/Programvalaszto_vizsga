import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { RegistrationComponent } from './registration/registration.component';
import { FormsModule } from '@angular/forms';
import { provideHttpClient } from '@angular/common/http';
import { AllEventsComponent } from './all-events/all-events.component';
import { DetailedEventComponent } from './detailed-event/detailed-event.component';
import { EventsAdminListComponent } from './events-admin-list/events-admin-list.component';
import { TagsListComponent } from './tags-list/tags-list.component';
import { TagsLinkComponent } from './tags-link/tags-link.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    LoginComponent,
    LogoutComponent,
    RegistrationComponent,
    AllEventsComponent,
    DetailedEventComponent,
    EventsAdminListComponent,
    TagsListComponent,
    TagsLinkComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule
  ],
  providers: [
    provideHttpClient()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
