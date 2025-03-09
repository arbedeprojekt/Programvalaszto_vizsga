import { UsersComponent } from './users/users.component';
import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { AllEventsComponent } from './all-events/all-events.component';
import { EventsAdminListComponent } from './events-admin-list/events-admin-list.component';
import { TagsListComponent } from './tags-list/tags-list.component';
import { DetailedEventComponent } from './detailed-event/detailed-event.component';
import { EventsSubscribedComponent } from './events-subscribed/events-subscribed.component';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  {path:"home",component:HomeComponent},
  {path:"",component:HomeComponent},        //azért kommenteltem ki ideiglenesen, mert a lapozó valamiért hibát dob és emiatt nem lehet megtalálni (Bea)
  {path:"login",component:LoginComponent},
  {path:"registration",component:RegistrationComponent},
  {path:"all-events",component:AllEventsComponent, canActivate: [AuthGuard] },
  {path:"admin",component:EventsAdminListComponent, canActivate: [AuthGuard] },
  {path:"users",component:UsersComponent, canActivate: [AuthGuard] },
  {path:"galeries",component:AllEventsComponent, canActivate: [AuthGuard] },
  {path:"tags",component:TagsListComponent, canActivate: [AuthGuard] },
  {path:"detailed-event/:id",component:DetailedEventComponent, canActivate: [AuthGuard] },
  {path:"detailed-event",component:DetailedEventComponent, canActivate: [AuthGuard] },   //ezt majd törölni kell a végén..
  {path:"events-subscribed",component:EventsSubscribedComponent, canActivate: [AuthGuard] }



];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
