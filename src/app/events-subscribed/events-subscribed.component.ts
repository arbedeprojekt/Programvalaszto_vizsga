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
  selectedOption: any
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
    this.toSort("ascByABC");
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

  filterByABCAsc() {
    //console.log("növekvő sorrend!!")
  }

  filterByABCDesc() {
    //console.log("csökkenő sorrend!!")

  }

  toSort(terms: any) {
    if (terms === "ascByABC") {
      // console.log("ascByABC")
      console.log("eventsArray értéke:",this.eventsArray)

      this.sortedEventsArray = this.eventsArray
      this.sortedEventsArray = this.sortedEventsArray.sort(
        (a: any, b: any) => {

          // console.log("a értéke: ", a)
          // console.log("b értéke: ", b)
          return a.name.localeCompare(b.name)
        }
      )

      //a keresett tartalmak szűréséhez
      if (this.isSearch == true) {
        this.searchResults = this.searchResults.sort(
          (a: any, b: any) => {

            // console.log("a értéke: ", a)
            // console.log("b értéke: ", b)
            return a.name.localeCompare(b.name)
          }
        )
      }
    }

    else if (terms === "descByABC") {
      // console.log("descByABC")
      this.sortedEventsArray = this.eventsArray
      this.sortedEventsArray = this.sortedEventsArray.sort(
        (a: any, b: any) => {

          // console.log("a értéke: ", a)
          // console.log("b értéke: ", b)
          return b.name.localeCompare(a.name)
        }
      )

      //a keresett tartalmak szűréséhez

      if (this.isSearch == true) {
        this.searchResults = this.searchResults.sort(
          (a: any, b: any) => {

            // console.log("a értéke: ", a)
            // console.log("b értéke: ", b)
            return b.name.localeCompare(a.name)
          }
        )
      }
    }

    else if (terms === "ascByDate") {
      // console.log("ascByDate")
      this.sortedEventsArray = this.eventsArray
      this.sortedEventsArray = this.sortedEventsArray.sort(
        (a: any, b: any) => {

          // console.log("a értéke: ", a)
          // console.log("b értéke: ", b)
          return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
        }
      )

      //a keresett tartalmak szűréséhez

      if (this.isSearch == true) {
        this.searchResults = this.searchResults.sort(
          (a: any, b: any) => {

            // console.log("a értéke: ", a)
            // console.log("b értéke: ", b)
            return new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
          }
        )
      }
    }

    else if (terms === "descByDate") {
      // console.log("descByDate")
      this.sortedEventsArray = this.eventsArray
      this.sortedEventsArray = this.sortedEventsArray.sort(
        (a: any, b: any) => {

          return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
        }
      )

      //a keresett tartalmak szűréséhez

      if (this.isSearch == true) {
        this.searchResults = this.searchResults.sort(
          (a: any, b: any) => {

            // console.log("a értéke: ", a)
            // console.log("b értéke: ", b)
            return new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
          }
        )
      }

    }

    // console.log("szortírozás után : ", this.sortedEventsArray)
    if (this.searchControl.value === '') {
      this.searchResults = []
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

  search(query: string): Observable<string[]> {
    let token = localStorage.getItem("token")
    let headers = new HttpHeaders().set("Authorization", `Bearer ${token}`)
    if (!query.trim()) {
      return new Observable(observer => observer.next([])); // Ha üres a kereső, ne küldjön kérést
    }
    return this.http.get<string[]>(`${this.backendUrl}searchevents/?query=${query}`, { headers }).pipe(
      map((response: any) => response.data),

      // distinctUntilChanged()
    )
    // GET kérés küldése a backendnek
  }

  searchOnPress() {
    //console.log("keresés")
    if (this.searchControl.value === '') {
      this.isSearch = false
    }
    else {
      this.isSearch = true
      this.search(this.searchControl.value).subscribe(
        {
          next: (res: any) => {
            //console.log("az eredmény: ", res)
            this.searchResults = res
          }
        }

      )
    }

  }

}
