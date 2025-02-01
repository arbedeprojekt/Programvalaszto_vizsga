import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  
  allEventUrl="http://localhost:3000/esemenyek"
  eventDetails=new Subject()
  events:any 
  cols =["picture","name", "startDate", "startTime", "endTime", "locationcity", "locationcountry", "locationstreet", "locationzip"]


  constructor(private http:HttpClient) {
    this.http.get(this.allEventUrl).subscribe((response:any)=>{
          let adattomb=[]
          for (const key in response) {
            adattomb.push({id:key, ...response[key]})
            
        }
          this.eventDetails.next(adattomb)
      //     console.log(adattomb)
    }
    
  )

  this.getFromEventDetails()
  // console.log(this.events[0])
    
  }

  ngOnInit(): void {
    
  }

  getFromEventDetails(){
    this.eventDetails.subscribe((response:any)=>{
      this.events=response
    })

    
  }


}
