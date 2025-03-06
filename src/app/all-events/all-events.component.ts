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

// interface groupBy{
//   id : number,
//   name:string
// }
export class AllEventsComponent {

  // allEventUrl = "http://localhost:3000/esemenyek/";

  eventDetails = new BehaviorSubject<any>(null)

  clickedEventDetails: any = {};
  events: any[] = [];
  galleries: any

  //oldal lapozóhoz kapcsolódik
  currentPage = 1;
  itemsPerPage = 12;

  //user tárolása
  user: any
  dataFromApi: any

  //Az ábc sorrend megvalósításához
  selectedOption: any
  eventsArray = [

    // {name:"dinnye"},
    // {name:"körte"},
    // {name:"barack"},
    // {name:"cinege"}



    // "dinnye",
    // "körte",
    // "barack",
    // "cinege"
    // 5,
    // 33,
    // 4,
    // 2,
    // 15,
    // 30,
  ]
  sortedEventsArray: any



  constructor(private httpClient: HttpClient, private auth: AuthService, private base: BaseService) {
    // user lecsekkolása
    //   this.auth.getLoggedUser().subscribe(
    //     (u)=>this.user=u
    //   )

    this.getDataFromApi()
  }

  getDataFromApi() {
    this.base.adatSub.subscribe(
      (res: any) => {
        this.events = res.data
        this.eventsArray = res.data
        this.sortedEventsArray = this.eventsArray

      }
    )
  }

  // Oldalszám beállítása
  changePage(page: number) {
    this.currentPage = page;
  }

  // Csak az aktuális oldalhoz tartozó elemeket adjuk vissza
  // get paginatedEvents(): any[] {
  //   const start = (this.currentPage - 1) * this.itemsPerPage;
  //   const end = start + this.itemsPerPage;

  //   return this.events.slice(start, end);       //valamiért hibát dob erre..
  // }

  get paginatedEvents(): any[] {
    if (!this.events || !Array.isArray(this.events)) {
      console.log("az events üres vót, tartalma: ", this.events);
      return [];
    }
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;

    return this.events.slice(start, end);       //valamiért hibát dob erre..
  }


  //itt szerettem volna bekötni a galériát, hogy annak az image_1 képét adja vissza a kártyákon a rendszer, de még nem sikerült. Meg lehet csinálni, ha valakinek megy!!
  // getImages(){
  //   this.base.galleriesData.subscribe(
  //     (res:any)=>{
  //       this.galleries = res
  //     }
  //   )
  // }

  // getEventImage(eventId: any): string {
  //   console.log('Keresett eventId:', eventId);
  //   console.log('Galeries adatok:', this.galleries);

  //   if (!this.galleries || this.galleries.length === 0) {
  //     console.warn('Nincsenek galériaadatok!');
  //     return 'assets/Pictures/no-image.jpg';
  //   }

  //   const galleryItem = this.galleries.find?((g: any) => String(g.eventId) === String(eventId));

  //   console.log('Talált galéria elem:', galleryItem);

  //   return galleryItem && galleryItem.image_1 ? galleryItem.image_1 : 'assets/Pictures/no-image.jpg';
  // }

  filterByABCAsc() {
    console.log("növekvő sorrend!!")
  }

  filterByABCDesc() {
    console.log("csökkenő sorrend!!")

  }

  toSort(terms: any) {
    if (terms === "ascByABC") {
      console.log("ascByABC")
      this.sortedEventsArray = this.eventsArray
      this.sortedEventsArray = this.sortedEventsArray.sort(
        (a: any, b: any) => {

          console.log("a értéke: ", a)
          console.log("b értéke: ", b)
          return a.name.localeCompare(b.name)

        }

      )
    }

    else if (terms === "descByABC") {
      console.log("descByABC")
      this.sortedEventsArray = this.eventsArray
      this.sortedEventsArray = this.sortedEventsArray.sort(
        (a: any, b: any) => {

          console.log("a értéke: ", a)
          console.log("b értéke: ", b)
          return b.name.localeCompare(a.name)

        }

      )
    }

    else if (terms === "ascByDate") {
      console.log("ascByDate")
      this.sortedEventsArray = this.eventsArray
      this.sortedEventsArray = this.sortedEventsArray.sort(
        (a: any, b: any) => {

          // console.log("a értéke: ", a)
          // console.log("b értéke: ", b)
          return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();

        }

      )
    }

    else if (terms === "descByDate") {
      console.log("descByDate")
      this.sortedEventsArray = this.eventsArray
      this.sortedEventsArray = this.sortedEventsArray.sort(
        (a: any, b: any) => {




          return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();

        }

      )
    }

    console.log("szortírozás után : ", this.sortedEventsArray)
  }

}
