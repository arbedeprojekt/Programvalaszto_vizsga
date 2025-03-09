import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { BaseService } from '../base.service';
import { AuthService } from '../auth.service';
import { LocalStorageService } from '../local-storage.service';
import { Router } from '@angular/router';


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

  user: any

  //mit adjon vissza a rendszer, ha nincs adat a dátum mezőkben
  eventStartDateNull = "Állandó"
  eventEndDateNull = ""

  // Feliratkozások megtekintése
  userEvents: any

  constructor(private http:HttpClient, private base:BaseService, public auth:AuthService, private localStorage: LocalStorageService, private router: Router) {
    this.base.getAllMyEvents()
    this.auth.getLoggedUser().subscribe(
      (user) => {
        this.user = user})

  }

  ngOnInit(): void {
    this.getDataFromApi()
    this.getUserEvents(); // MyEvents betöltése
  }

  getDataFromApi(){
    this.base.getAll().subscribe(
      (res:any) => {
        this.events = res.data
      }
    )
  }

  //ez kezeli le, hogy mi történjen, ha valaki kilépve vagy belépve kattint rá a kártyára (kártyán a képre)
  navigateToEvent(eventId: number) {
    if (this.user) {
      this.router.navigate(['/detailed-event', eventId]); // Ha be van jelentkezve
    } else {
      this.router.navigate(['/login']); // Ha nincs bejelentkezve
      alert("A funkcióhoz bejelentkezés szükséges")
    }
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

  //feliratkozás adott eseményre
  subscribeToEvent(event:any){
    this.base.subscribeEvent(event).subscribe(
      {
        next: (res: any) => {
          // console.log("új esemény felvétele: ",res)
          if (res.success == false) {
            console.log("hibaüzenetek: ", res.error)
          }
          //ahoz hogy az oldal újrafrissüljön.
          else {
            this.base.getAllMyEvents()
            console.log("Sikeres új esemény felvétel: ", res)
            alert("Sikeres feliratkozás!")


            // Frissítsük a komponens változóját:
            this.base.myEvents.subscribe(events => {
              this.userEvents = events;
            })
          }
        },
        error: (error: any) => {
          console.log("Valami hiba történt az új esemény felvétele során: ",error)
        }
      }
    )
  }

  //leiratkozás adott eseményről
  unsubscribeFromEvent(data:any){
    this.base.unsubscribeEvent(data).subscribe(
      {
        next: (res: any) => {
          console.log("sikeres leiratkozás: ", res)
          //window.location.reload();             //törlendő
          alert("Sikeresen leiratkoztál!")
          // Események újratöltése az API-ból, hogy az UI frissüljön!
          this.base.getAllMyEvents();
          // 🔄 Frissítsük a `userEvents` változót az új adatokkal
          this.base.myEvents.subscribe(events => {
            this.userEvents = events;
          })
        },
        error: (error: any) => {
          console.log("Valami hiba: ", error)
        }
      })
  }


  //Ez és a következő azért kell, hogy a feliratkozás gomb akkor jelenjen meg, ha az adott felhasználó még nincs feliratkozva
  //A leiratkozás gomb pedig akkor, ha már fel van.
  //le kell kérni az adott bejelentkezett user feliratkozott eseményeit
  getUserEvents() {
    this.base.myEvents.subscribe(
      (res: any) => {
        console.log("userEvents", res)       
        this.userEvents = res
    })
  }

  isEventSubscribed(eventId: number): boolean {
    if (!Array.isArray(this.userEvents)) {
      return false; // Ha myEvents undefined, akkor hamis
    }

    for (let i = 0; i < this.userEvents.length; i++) {
      if (this.userEvents[i].id === eventId) {
        return true; // Ha találunk egyezést, rögtön visszatérünk
      }
    }
    return false; // Ha végigmentünk és nem találtunk, akkor false
  }


}
