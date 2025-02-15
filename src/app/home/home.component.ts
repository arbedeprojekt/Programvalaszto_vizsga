import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { BaseService } from '../base.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  //A fake api-n lévő adatok eléréséhez szükségs
  allEventUrl="http://localhost:3000/esemenyek/"

  //A fake Api adatainak tárolása
  eventDetails=new BehaviorSubject<any>(null)
  //Az eventDetails által megszerzett adatok tárolása, hogy a weboldalon megjelenhessen
  events:any
  //oszlopok neveinek megjelenítéséhez
  //cols =["name", "description", "locationName", "locationcountry", "address", "gpsLink", "weblink", "startDate", "endDate", "startTime", "endTime"]


  constructor(private http:HttpClient, private base:BaseService) {
    //Az fake-api-ból megszerezzük az adatokat
    this.http.get(this.allEventUrl).subscribe((response:any)=>{
          let adattomb=[]
          for (const key in response) {
            adattomb.push({id:key, ...response[key]})

        }
          this.eventDetails.next(adattomb)
          console.log("response: ",response)
          console.log(adattomb)
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


}
