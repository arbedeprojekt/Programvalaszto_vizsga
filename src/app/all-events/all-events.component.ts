import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { BaseService } from '../base.service';
import { BehaviorSubject, debounceTime, distinctUntilChanged, map, Observable, switchMap } from 'rxjs';
import { FormControl } from '@angular/forms';
import { LocalStorageService } from '../local-storage.service';

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
  backendUrl = "http://127.0.0.1:8000/api/"
  isSearch = false;

  // Feliratkozások megtekintése
  userEvents: any



  constructor(private http: HttpClient, private auth: AuthService, private base: BaseService, public localStorage:LocalStorageService) {
    // user lecsekkolása
    //   this.auth.getLoggedUser().subscribe(
    //     (u)=>this.user=u
    //   )

    
    this.getTags()
    this.base.downloadAllTags()
    this.toSort("ascByABC");
    this.base.getAllMyEvents()


    //szabadszavas szűrés
    // this.searchControl.valueChanges
    //   .pipe(
    //     debounceTime(300), // Vár 300ms-t, hogy ne indítson keresést minden billentyűleütésnél
    //     distinctUntilChanged(), // Csak akkor indít új keresést, ha változott az input érték
    //     switchMap(value => this.search(value) ) // Keresési szolgáltatás meghívása
    //   )
    //   .subscribe(results => this.searchResults = results);

  }

  ngOnInit() {
    this.getUserEvents(); // MyEvents betöltése
    this.getDataFromApi() // Az összes esemény betöltése
  }

  getDataFromApi() {
    this.base.eventsAllSub.subscribe(
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
      // console.log("az events üres vót, tartalma: ", this.events);
      return [];
    }
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;

    return this.events.slice(start, end);       //valamiért hibát dob erre..
  }
  get paginatedSearchedEvents(): any[] {
    if (!this.searchResults || !Array.isArray(this.searchResults)) {
      // console.log("az events üres vót, tartalma: ", this.searchResults);
      return [];
    }
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;

    return this.searchResults.slice(start, end);       //valamiért hibát dob erre..
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
