import { UsersComponent } from './users/users.component';
import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { AllEventsComponent } from './all-events/all-events.component';
import { EventsAdminListComponent } from './events-admin-list/events-admin-list.component';
import { TagsListComponent } from './tags-list/tags-list.component';

const routes: Routes = [
  {path:"home",component:HomeComponent},
  //{path:"",component:HomeComponent},        //azért kommenteltem ki ideiglenesen, mert a lapozó valamiért hibát dob és emiatt nem lehet megtalálni (Bea)
  {path:"login",component:LoginComponent},
  {path:"registration",component:RegistrationComponent},
  {path:"all-events",component:AllEventsComponent},
  {path:"admin",component:EventsAdminListComponent},
  {path:"users",component:UsersComponent},
  {path:"galeries",component:AllEventsComponent},
  {path:"tags",component:TagsListComponent}




];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
