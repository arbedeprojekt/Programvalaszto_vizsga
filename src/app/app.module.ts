import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbDatepickerModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { FormsModule } from '@angular/forms';
import { provideHttpClient } from '@angular/common/http';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';

import { AllEventsComponent } from './all-events/all-events.component';
import { DetailedEventComponent } from './detailed-event/detailed-event.component';
import { EventsAdminListComponent } from './events-admin-list/events-admin-list.component';
import { TagsListComponent } from './tags-list/tags-list.component';
import { TagsLinkComponent } from './tags-link/tags-link.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { RegistrationComponent } from './registration/registration.component';
import { environment } from '../environments/environment.prod';
import { UsersComponent } from './users/users.component';
import { DatepickerRangePopupComponent } from './datepicker-range-popup/datepicker-range-popup.component';
import { CardPaginationComponent } from './card-pagination/card-pagination.component';
import { FooterComponent } from './footer/footer.component';
import { EventsSubscribedComponent } from './events-subscribed/events-subscribed.component';
import { ReactiveFormsModule } from '@angular/forms';
import { GalleryComponent } from './gallery/gallery.component';

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
    TagsLinkComponent,
    UsersComponent,
    DatepickerRangePopupComponent,
    CardPaginationComponent,
    FooterComponent,
    EventsSubscribedComponent,
    GalleryComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    ReactiveFormsModule
  ],
  providers: [
    provideHttpClient()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
