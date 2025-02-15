import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
<<<<<<< HEAD
import { BaseService } from '../base.service';
import { BehaviorSubject } from 'rxjs';
=======
import { AuthService } from '../auth.service';
import { BaseService } from '../base.service';
>>>>>>> a444c9eef5620011f74ba6035bc18fa2b0f0a8e9

@Component({
  selector: 'app-all-events',
  templateUrl: './all-events.component.html',
  styleUrl: './all-events.component.css'
})
export class AllEventsComponent  {
  
  allEventUrl = "http://localhost:3000/esemenyek/";
  
  eventDetails=new BehaviorSubject<any>(null)
  
  clickedEventDetails:any={};
<<<<<<< HEAD
  events:any


  constructor(private http:HttpClient, public base:BaseService) {
    
    this.http.get(this.allEventUrl).subscribe((response:any)=>{
      let adattomb=[]
      for (const key in response) {
        adattomb.push({id:key, ...response[key]})

    }
      this.eventDetails.next(adattomb)
=======
  // url = "./jsonFiles/allEvents.json";

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
        this.dataFromApi = res
      }
    )
>>>>>>> a444c9eef5620011f74ba6035bc18fa2b0f0a8e9
  }
)

  //a fake-api-ból szerzett adatokat kiíratjuk
  this.getFromEventDetails()


  }

  ngOnInit(): void {

  }

  //eventDeatils-ből az adatok kinyerése
  getFromEventDetails(){
    this.eventDetails.subscribe((response:any)=>{
      this.events=response
    })


  }

  //a base service getAll metódusát meghívva átadjuk a cikkeket


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
