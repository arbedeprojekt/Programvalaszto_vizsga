import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { BaseService } from '../base.service';
import { BehaviorSubject, debounceTime, distinctUntilChanged, map, Observable, switchMap } from 'rxjs';
import { FormControl } from '@angular/forms';
import { LocalStorageService } from '../local-storage.service';
import { Offcanvas } from 'bootstrap';

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
  selectedOption = "ascByABC"
  eventsArray = []
  sortedEventsArray: any

  //tegeknek
  tags: any
  groups: any

  //A szabadszavas kereséshez
  searchControl = new FormControl();
  searchResults: any;
  backendUrl = "http://127.0.0.1:8000/api/"
  isSearch = false;

  // Feliratkozások megtekintése
  userEvents: any



  constructor(private http: HttpClient, private auth: AuthService, private base: BaseService, public localStorage: LocalStorageService) {
    // user lecsekkolása
    //   this.auth.getLoggedUser().subscribe(
    //     (u)=>this.user=u
    //   )


    this.getTags()
    this.base.downloadAllTags()
    // this.toSort("ascByABC");
    this.base.getAllMyEvents()


    //szabadszavas szűrés
    // this.searchControl.valueChanges
    //   .pipe(
    //     debounceTime(300), // Vár 300ms-t, hogy ne indítson keresést minden billentyűleütésnél
    //     distinctUntilChanged(), // Csak akkor indít új keresést, ha változott az input érték
    //     switchMap(value => this.search(value) ) // Keresési szolgáltatás meghívása
    //   )
    //   .subscribe(results => this.searchResults = results);
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300), // Vár 300ms-t, hogy ne indítson keresést minden billentyűleütésnél
        distinctUntilChanged(), // Csak akkor indít új keresést, ha változott az input érték
        switchMap(value => {
          if (value === null || value.trim() === '') {
            this.isSearch = false;
            this.searchResults = null;
            const offcanvasElement = document.getElementById('offcanvasWithBothOptions');
            if (offcanvasElement) {
              const offcanvasInstance = Offcanvas.getInstance(offcanvasElement);
              if (offcanvasInstance) {
                offcanvasInstance.hide();

              }
              const closeButton = document.getElementById('offcanvasCloseButton');
              if (closeButton) {
                closeButton.click(); // Programozott kattintás
              }
            }
            return []; // üres tömböt adunk vissza
          }

          return []
        }
        )
      )
      .subscribe(results => {
        this.searchResults = results;
        this.base.toSort(this.selectedOption, this.searchResults)
      })

  }

  ngOnInit() {
    this.getUserEvents(); // MyEvents betöltése
    this.getDataFromApi() // Az összes esemény betöltése
    this.toSort()
  }

  getDataFromApi() {
    this.base.eventsAllSub.subscribe(
      (res: any) => {
        console.log("res a getDataFromApi-ból: ", res)
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


  get paginatedEvents(): any[] {
    if (!this.events || !Array.isArray(this.events)) {
      // console.log("az events üres vót, tartalma: ", this.events);
      return [];
    }
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;

    return this.events.slice(start, end);
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
    if(!this.searchResults){
      this.base.toSort(this.selectedOption,this.eventsArray)
    }
    else {
      this.base.toSort(this.selectedOption, this.searchResults)
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
      console.log("searchOn")
      this.isSearch = false
      this.searchResults = null
    }
    else {
      this.isSearch = true
      this.base.search(this.searchControl.value).subscribe(
        (data: any) => {
          this.searchResults = data; // Adatok beállítása

          this.base.toSort(this.selectedOption, this.searchResults)
          console.log("searchResults: ", this.searchResults);



          const offcanvasElement = document.getElementById('offcanvasWithBothOptions');
          if (offcanvasElement) {
            const offcanvasInstance = Offcanvas.getInstance(offcanvasElement);
            if (offcanvasInstance) {
              offcanvasInstance.hide();

            }
            const closeButton = document.getElementById('offcanvasCloseButton');
            if (closeButton) {
              closeButton.click(); // Programozott kattintás
            }
          }
        }


      )

    }

  }


  //feliratkozás adott eseményre
  subscribeToEvent(event: any) {
    this.base.subscribeEvent(event).subscribe(
      {
        next: (res: any) => {
          // console.log("új esemény felvétele: ",res)
          if (res.success == false) {
            console.log("hibaüzenetek: ", res.error)
            this.base.show(res.message || "Hiba történt!", "danger")
          }
          //ahoz hogy az oldal újrafrissüljön.
          else {
            this.base.getAllMyEvents()
            //console.log("Sikeres új esemény felvétel: ", res)
            this.base.show(res.message || "Sikeres feliratkozás!", "success")


            // Frissítsük a komponens változóját:
            this.base.myEvents.subscribe(events => {
              this.userEvents = events;
            })
          }
        },
        error: (error: any) => {
          //console.log("Valami hiba történt az új esemény felvétele során: ",error)
        }
      }
    )
  }

  //leiratkozás adott eseményről
  unsubscribeFromEvent(data: any) {
    this.base.unsubscribeEvent(data).subscribe(
      {
        next: (res: any) => {
          //console.log("sikeres leiratkozás: ", res)
          //window.location.reload();             //törlendő
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
