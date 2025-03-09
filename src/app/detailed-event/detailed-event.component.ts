import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { BaseService } from '../base.service';
import { ActivatedRoute, Router } from '@angular/router';
import Lightbox from 'bs5-lightbox';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-detailed-event',
  templateUrl: './detailed-event.component.html',
  styleUrl: './detailed-event.component.css'
})
export class DetailedEventComponent {

  backendUrl = "http://127.0.0.1:8000/api/"

  events:any
  tags: any

  detailedEventId: number | null = null;
  eventDetails: any;
  
  //Mit adjunk vissza, ha nincs érték a dátum mezőkben
  eventStartDateNull = "Állandó"
  eventEndDateNull = ""

  //Ez az információs blokkhoz kell, mert nem akarom az összes adatot visszaadni az events-ből
  otherDatas = ["weblink", "gpx"]

  // Feliratkozások megtekintése
  userEvents: any

  //belépés ellenőrzése
  user: any

  constructor(private http:HttpClient, private base:BaseService, private route: ActivatedRoute, public auth:AuthService, private router:Router) {

    //a restApi-ból szerzett adatokat kiíratjuk
    this.getDataFromApi()
    this.getTags()
    this.base.downloadAllTags()
    this.auth.getLoggedUser().subscribe(
      (user) => {
        this.user = user})
  }

  //eventDeatils-ből az adatok kinyerése
  getDataFromApi(){
    this.base.getAll().subscribe(
      (res:any) => {
        this.events = res.data
      }
    )
  }

  ngOnInit(): void {
    this.getUserEvents(); // MyEvents betöltése

    this.route.params.subscribe(params => {
      this.detailedEventId = +params['id']; // Az ID lekérése a route-ból
      console.log('Detailed Event ID:', this.detailedEventId);
    });
    console.log('Events:', this.events);
  }

  detailedEvent(id: number | null) {
    if (id) {
      this.base.getEventById(id).subscribe(data => {
        this.eventDetails = data; // Az esemény részleteit beállítjuk
      });
    }
  }


  //most csak az összes eseményből vesz 4 db-ot, de itt meg kell írni, hogy a hasonló programokból adja vissza a top4-et
  // Olyan kártyákat kell hozni, amik legalább 3 címkében egyeznek azokkal, amik az adott eseményre vonatkoznak
  get sameEvents() {
    if (this.events) { // Ellenőrizzük, hogy az events létezik-e
      return this.events.slice(0, 4); // Az első 4 elemet adjuk vissza
    } else {
      return []; // Ha nincs adat, akkor egy üres tömböt adunk vissza
    }
  }


  activeSection: string = 'eventDescription'; // Kezdő érték

  setActiveSection(section: string) {
    this.activeSection = section;
  }

  //Vélemények
  // document.addEventListener('DOMContentLoaded', function() {
  //   const stars = document.querySelectorAll('.rating-star');
  //   const ratingInput = document.getElementById('rating');
  
  //   stars.forEach(star => {
  //     star.addEventListener('click', function() {
  //       const rating = this.getAttribute('data-rating');
  //       ratingInput.value = rating;
  //       resetStars();
  //       for (let i = 0; i < rating; i++) {
  //         stars[i].classList.remove('bi-star');
  //         stars[i].classList.add('bi-star-fill');
  //       }
  //     });
  //   });
  
  //   function resetStars() {
  //     stars.forEach(star => {
  //       star.classList.remove('bi-star-fill');
  //       star.classList.add('bi-star');
  //     });
  //   }
  // });



  //tag-ek betöltése
  getTags() {
    this.base.tagsSub.subscribe(
      (tag: any) => {
        this.tags = tag.data
        console.log("res a tag componensből: ", tag)
      }
    )
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

//be kell kérni annak az adott eseménynek a részletes adatait, amelyre kattintott a felhasználó
