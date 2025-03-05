import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { BaseService } from '../base.service';

@Component({
  selector: 'app-detailed-event',
  templateUrl: './detailed-event.component.html',
  styleUrl: './detailed-event.component.css'
})
export class DetailedEventComponent {

  //A fake api-n lévő adatok eléréséhez szükségs
  allEventUrl="http://localhost:3000/esemenyek/"
  //A fake Api adatainak tárolása
  eventDetails=new BehaviorSubject<any>(null)
  //Az eventDetails által megszerzett adatok tárolása, hogy a weboldalon megjelenhessen
  events:any

  constructor(private http:HttpClient, private base:BaseService) {

    //a resApi-ból szerzett adatokat kiíratjuk
    this.getDataFromApi()
  }

  //eventDeatils-ből az adatok kinyerése
  getDataFromApi(){
    this.base.adatSub.subscribe(
      (res:any) => {
        this.events = res.data
      }
    )
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



  scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
        console.warn('Elem nem található:', sectionId);
    }
  }
}

//be kell kérni annak az adott eseménynek a részletes adatait, amelyre kattintott a felhasználó
