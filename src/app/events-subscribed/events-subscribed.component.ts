import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Input, input } from '@angular/core';
import { LocalStorageService } from '../local-storage.service';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { BaseService } from '../base.service';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-events-subscribed',
  templateUrl: './events-subscribed.component.html',
  styleUrl: './events-subscribed.component.css'
})
export class EventsSubscribedComponent {

  @Input() data: any

  //backend elérése
  backendUrl = "http://127.0.0.1:8000/api/"

  // A táblázat megjelenítéséhez
  // oszlopok = ["events_id", "comment"]
  oszlopok =["image","name", "description", "startDate", "endDate", "startTime", "endTime", "locationName", "locationcountry", "address", "state", "gpx", "weblink"]
  //A fejléc magyar megjelenítéséhez
  columnName = ["Esemény azonosítója", "Kommentek"]


  subscribedEvents: any
  // cikkekObs: Observable<any | null> = this.cikkek.asObservable()

  eventDetails = new BehaviorSubject<any>(null)

  clickedEventDetails: any = {};
  events: any
  galleries: any

  //oldal lapozóhoz kapcsolódik
  currentPage = 1;
  itemsPerPage = 12;

  //mit írjon a kártyára, ha nincs dátum érték
  eventStartDateNull = "Állandó"
  eventEndDateNull = ""

  //user tárolása
  user: any
  dataFromApi: any

  //Az ábc sorrend megvalósításához
  selectedOption ="ascByABC"
  eventsArray = []
  sortedEventsArray: any

  //tegeknek
  tags: any
  groups: any

  //A szabadszavas kereséshez
  searchControl = new FormControl();
  searchResults: any[] = [];
  isSearch = false;

  // Feliratkozások megtekintése
  userEvents: any

  constructor(private http: HttpClient, localStorage: LocalStorageService, private base: BaseService, private auth:AuthService, private router:Router) {
    // let token = localStorage.getItem("token")
    // let headers = new HttpHeaders().set("Authorization", `Bearer ${token}`)
    // this.http.get(this.backendUrl + "getsubscriptions", { headers }).subscribe(
    //   {
    //     next: (res: any) => {
    //       this.cikkek = res
    //       console.log("siker", res)
    //     },
    //     error: (error: any) => {
    //       console.log("hiba", error)
    //     }
    //   }
    // )
    this.base.getAllMyEvents()
    this.getTags()
    this.base.downloadAllTags()

    // this.getSubscribeEvents()
  }

  ngOnInit() {
    this.getUserEvents(); // MyEvents betöltése
  }


  //leiratkozás adott eseményről
  unsubscribeFromEvent(data:any){
    this.base.unsubscribeEvent(data).subscribe(
      {
        next: (res: any) => {
          //console.log("sikeres leiratkozás: ", res)
          this.base.show(res.message || "Sikeres leiratkozás!", "success")

          // Események újratöltése az API-ból, hogy az UI frissüljön!
          this.base.getAllMyEvents();
          // Frissítsük a `userEvents` változót az új adatokkal
          this.base.myEvents.subscribe(events => {
            this.userEvents = events;
          })
        },
        error: (error: any) => {
          //console.log("Valami hiba: ", error)
          this.base.show("Hálózati hiba vagy szerverhiba történt!", "danger")
        }
      })
  }


  //Ez és a következő azért kell, hogy a feliratkozás gomb akkor jelenjen meg, ha az adott felhasználó még nincs feliratkozva
  //A leiratkozás gomb pedig akkor, ha már fel van.
  //le kell kérni az adott bejelentkezett user feliratkozott eseményeit
  getUserEvents() {
    this.base.myEvents.subscribe(
      (res: any) => {
        //console.log("userEvents", res)
        this.userEvents = res
        this.eventsArray = res
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

  // Oldalszám beállítása
  changePage(page: number) {
    this.currentPage = page;
  }

  get paginatedEvents(): any[] {
    if (!this.userEvents || !Array.isArray(this.userEvents)) {
      // console.log("az events üres vót, tartalma: ", this.events);
      return [];
    }
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;

    return this.userEvents.slice(start, end);
  }

  get paginatedSearchedEvents(): any[] {
    if (!this.searchResults || !Array.isArray(this.searchResults)) {


      // console.log("az events üres vót, tartalma: ", this.searchResults);
      return [];
    }
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;

    return this.searchResults.slice(start, end);
  }





  toSort(){
    console.log("userEvents: ", this.userEvents)
    //dezső: Megnézem, hogy akarja e használni a felhasználó a szabadszavas keresést
    if(this.isSearch == false){
      this.base.toSort(this.selectedOption,this.userEvents)
      console.log("")
    }
    else{
      console.log("else ág")
      this.base.toSort(this.selectedOption,this.searchResults)
    }

  }

  navigateToEvent(eventId: number) {
    if (this.user) {
      this.router.navigate(['/detailed-event', eventId]); // Ha be van jelentkezve
    } else {
      this.router.navigate(['/login']); // Ha nincs bejelentkezve
      alert("A funkcióhoz bejelentkezés szükséges")
    }
  }

  getTags() {
    this.base.tagsSub.subscribe(
      (tag: any) => {
        this.tags = tag.data
        //console.log("res a tag componensből: ", tag)
      }
    )
  }



  searchOnPress() {
    //console.log("keresés")
    if (this.searchControl.value === '') {
      // console.log("searchOn")
      this.isSearch = false
    }
    else {
      this.isSearch = true

      this.base.search(this.searchControl.value).subscribe(
        (data:any) => {
          this.searchResults = data; // Adatok beállítása
          console.log("userEvents tartalma: ", this.userEvents)
          const commonElements = this.searchResults.filter((item1:any) =>
            this.userEvents.some((item2:any) => item1.id == item2.id) // Az id alapján hasonlítunk

          )
          this.searchResults = commonElements
          console.log("commonElements: ",commonElements)
          this.base.toSort(this.selectedOption,this.searchResults)
          console.log("searchResults: ", this.searchResults);
        }
      )



    }

  }
}
