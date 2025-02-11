import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-all-events',
  templateUrl: './all-events.component.html',
  styleUrl: './all-events.component.css'
})
export class AllEventsComponent  {
  clickedEventDetails:any={};
  url = "./jsonFiles/allEvents.json";

  //user tárolása
  user:any



  constructor(private httpClient:HttpClient, private auth:AuthService ) {
    // user lecsekkolása
    this.auth.getLoggedUser().subscribe(
      (u)=>this.user=u
    )
  }

  getClickedEventDetails() {
    console.log("gomb lenyomva");
  }

  getHtmlElements(){
    console.log("html elemek");
  }

  // ngOnInit(): void {
  //   this.httpClient.get(this.url).subscribe(
  //     (data:any) => {
  //       console.log(data);
  //   })
  // }





}
