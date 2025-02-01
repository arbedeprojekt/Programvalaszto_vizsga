import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-all-events',
  templateUrl: './all-events.component.html',
  styleUrl: './all-events.component.css'
})
export class AllEventsComponent  {
  clickedEventDetails:any={};
  url = "./jsonFiles/allEvents.json";
  
  


  constructor(privatehttpClient:HttpClient) {
    
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
