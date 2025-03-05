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
export class AllEventsComponent  {

  // allEventUrl = "http://localhost:3000/esemenyek/";

  eventDetails=new BehaviorSubject<any>(null)

  clickedEventDetails:any={};
  events:any[]=[];
  galleries:any

  //oldal lapozóhoz kapcsolódik
  currentPage = 1;
  itemsPerPage = 12;

  //user tárolása
  user:any
  dataFromApi:any

  constructor(private httpClient:HttpClient, private auth:AuthService, private base:BaseService ) {
    // user lecsekkolása
  //   this.auth.getLoggedUser().subscribe(
  //     (u)=>this.user=u
  //   )

    this.getDataFromApi()
  }

  getDataFromApi(){
    this.base.adatSub.subscribe(
      (res:any) => {
        this.events = res.data
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

  filterByABCAsc(){
    console.log("növekvő sorrend!!")
  }

  filterByABCDesc(){
    console.log("csökkenő sorrend!!")

  }

}
