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
  // allEventUrl="http://localhost:3000/esemenyek/"

  //A fake Api adatainak tárolása
  eventDetails=new BehaviorSubject<any>(null)
  //Az eventDetails által megszerzett adatok tárolása, hogy a weboldalon megjelenhessen
  events:any
  //oszlopok neveinek megjelenítéséhez
  //cols =["name", "description", "locationName", "locationcountry", "address", "gpsLink", "weblink", "startDate", "endDate", "startTime", "endTime"]


  constructor(private http:HttpClient, private base:BaseService) {
    //Az fake-api-ból megszerezzük az adatokat
  //   this.http.get(this.allEventUrl).subscribe((response:any)=>{
  //         let adattomb=[]
  //         for (const key in response) {
  //           adattomb.push({id:key, ...response[key]})

  //       }
  //         this.eventDetails.next(adattomb)
  //         console.log("response: ",response)
  //         console.log(adattomb)
  //   }
  // )

      // this.base.getAll().subscribe()
  this.getDataFromApi()

  //a fake-api-ból szerzett adatokat kiíratjuk
  // this.getFromEventDetails()


  }

  ngOnInit(): void {

  }

  getDataFromApi(){
    this.base.adatSub.subscribe(
      (res:any) => {


        this.events = res.data
      }
    )
  }


  //eventDeatils-ből az adatok kinyerése
  getFromEventDetails(){
    this.eventDetails.subscribe((response:any)=>{
      this.events=response
    })
  }

  //most csak az összes eseményből vesz 8 db-ot, de itt meg kell írni, hogy a legnépszerűbb programokból adja vissza a top8-at
  get bestEvents() {
    if (this.events) { // Ellenőrizzük, hogy az events létezik-e
      return this.events.slice(0, 8); // Az első 8 elemet adjuk vissza
    } else {
      return []; // Ha nincs adat, akkor egy üres tömböt adunk vissza
    }
  }

  //most csak az összes eseményből vesz 4 db-ot, de itt meg kell írni, hogy a legújabb programokból adja vissza a legújabb 4-et
  get newEvents() {
    if (this.events) { // Ellenőrizzük, hogy az events létezik-e
      return this.events.slice(0, 4); // Az első 4 elemet adjuk vissza
    } else {
      return []; // Ha nincs adat, akkor egy üres tömböt adunk vissza
    }
  }


}
