import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { BaseService } from '../base.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-all-events',
  templateUrl: './all-events.component.html',
  styleUrl: './all-events.component.css'
})
export class AllEventsComponent  {
  
  allEventUrl = "http://localhost:3000/esemenyek/";
  
  eventDetails=new BehaviorSubject<any>(null)
  
  clickedEventDetails:any={};
  events:any

  //user tárolása
  user:any
  dataFromApi:any

  constructor(private httpClient:HttpClient, private auth:AuthService, private base:BaseService ) {
    // user lecsekkolása
    this.auth.getLoggedUser().subscribe(
      (u)=>this.user=u
    )

    this.getDataFromApi()
  }

  getDataFromApi(){
    this.base.adatSub.subscribe(
      (res:any) => {
        this.events = res
      }
    )
  }
}
