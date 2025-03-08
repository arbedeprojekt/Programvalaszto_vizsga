import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Input, input } from '@angular/core';
import { LocalStorageService } from '../local-storage.service';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { BaseService } from '../base.service';

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

  //felíratkozott id-k tárolása:
  subscribedID:any=[]

  constructor(private http: HttpClient, localStorage: LocalStorageService, private base: BaseService) {
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
    this.getDataFromApi()
    this.getTags()
    this.base.downloadAllTags()
    // this.toSort("ascByABC");
    // this.getSubscribeEvents()
  }

  //ezt ki kell egészíteni a többi adattal is, ami meg tud jelenni a kártyákon, mert jelenleg nem jó így...
  subscribeEvent(data: any) {
    let token = localStorage.getItem("token")
    let headers = new HttpHeaders().set("Authorization", `Bearer ${token}`)
    let body = {
      events_id: data.id,
      comment: ""
    }
    this.http.post(this.backendUrl, body, { headers }).subscribe(
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
            // alert("Sikeres felíratkozás!")

          }
        },
        error: (error: any) => {
          // console.log("Valami hiba történt az új esemény felvétele során: ",error)
        }
      })
    data = {}
  }

  //leiratkozás az eseményről
  unsubscribe(data: any) {
    let token = localStorage.getItem("token")
    let headers = new HttpHeaders().set("Authorization", `Bearer ${token}`)

    this.http.delete(this.backendUrl + `unsubscribe/${data.events_id}`, { headers }).subscribe(
      {
        next: (res: any) => {
          console.log("sikeres leiratkozás: ", res)
          window.location.reload();
          alert("Sikeresen leiratkoztál!")
        },
        error: (error: any) => {
          console.log("Valami hiba: ", error)
          alert("Nem vagy még felíratkozva az adott eseményre!")
        }
      })
  }

  // getSubscribeEvents() {
  //   let token = localStorage.getItem("token")
  //   let headers = new HttpHeaders().set("Authorization", `Bearer ${token}`)
  //   this.http.get(this.backendUrl + "getsubscriptions", { headers }).subscribe(
  //     {
  //       next: (res: any) => {

  //         console.log(res.data)
  //         this.subscribedEvents = res
  //          console.log("siker", res)
  //       },
  //       error: (error: any) => {
  //         console.log("hiba", error)
  //       }
  //     }
  //   )
  // }

  getDataFromApi() {
    this.base.myEvents.subscribe(
      (res: any) => {
        console.log("MyEvents", res)       
        this.events = res
      

      }
    )
  }

  // Oldalszám beállítása
  changePage(page: number) {
    this.currentPage = page;
  }

  get paginatedEvents(): any[] {
    if (!this.events || !Array.isArray(this.events)) {
      // console.log("az events üres vót, tartalma: ", this.events);
      return [];
    }
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;

    return this.events.slice(start, end);      
  }
  // get paginatedSearchedEvents(): any[] {
  //   if (!this.searchResults || !Array.isArray(this.searchResults)) {
  //     // console.log("az events üres vót, tartalma: ", this.searchResults);
  //     return [];
  //   }
  //   const start = (this.currentPage - 1) * this.itemsPerPage;
  //   const end = start + this.itemsPerPage;

  //   return this.searchResults.slice(start, end);
  // }

  // get paginatedSubscribedEvents(): any[] {
  //   if (!this.subscribedEvents || !Array.isArray(this.subscribedEvents)) {
  //     console.log("az events üres vót, tartalma: ", this.events);
  //     return [];
  //   }
  //   const start = (this.currentPage - 1) * this.itemsPerPage;
  //   const end = start + this.itemsPerPage;

  //   return this.subscribedEvents.slice(start, end);
  // }

  get paginatedSubscribedEvents(): any[] {
    if (!this.subscribedEvents || !Array.isArray(this.subscribedEvents)) {
      console.log("az events üres vót, tartalma: ", this.events);
      return [];
    }
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;

    return this.subscribedEvents.slice(start, end);
  }

  

  filterByABCAsc() {
    console.log("növekvő sorrend!!")
  }

  filterByABCDesc() {
    console.log("csökkenő sorrend!!")

  }

  toSort(terms: any) {
    if (terms === "ascByABC") {
      // console.log("ascByABC")

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

  getTags() {
    this.base.tagsSub.subscribe(
      (tag: any) => {
        this.tags = tag.data
        console.log("res a tag componensből: ", tag)
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
    console.log("keresés")
    if (this.searchControl.value === '') {
      this.isSearch = false
    }
    else {
      this.isSearch = true
      this.search(this.searchControl.value).subscribe(
        {
          next: (res: any) => {
            console.log("az eredmény: ", res)
            this.searchResults = res
          }
        }

      )
    }

  }

}
