import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { BaseService } from '../base.service';
import { BehaviorSubject, debounceTime, distinctUntilChanged, forkJoin, map, Observable, switchMap } from 'rxjs';
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

  //Dezső: A felhasználó által kiválasztott tegek
  selectedTags: any[] = [];

  searchTagResults: any[] = [];
  tagSearch = false;
  //Dezső: tárolja a tegek és események közötti kapcsolatot
  eventsAndTagConnection: any

  //A szabadszavas kereséshez
  searchControl = new FormControl();
  searchResults: any[] = [];
  backendUrl = "http://127.0.0.1:8000/api/"
  isSearch = false;

  //dezső: a két fajta keresés értékeinek összekapcsolása
  commonSearchResults: any[] = []

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
    this.getEventsAndTagsConnection()


    this.searchControl.valueChanges
      .pipe(
        debounceTime(300), // Vár 300ms-t, hogy ne indítson keresést minden billentyűleütésnél
        distinctUntilChanged(), // Csak akkor indít új keresést, ha változott az input érték
        switchMap(value => {
          if (value === null || value.trim() === '') {
            this.isSearch = false;
            this.searchResults = [];

            if (this.searchControl.value.length < 1) {
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
    if (!this.commonSearchResults || !Array.isArray(this.commonSearchResults)) {
      // console.log("az events üres vót, tartalma: ", this.searchResults);
      return [];
    }
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;

    return this.commonSearchResults.slice(start, end);

    // const dataSource = this.isSearch ? this.commonSearchResults : this.events;

    // if (!dataSource || !Array.isArray(dataSource) || dataSource.length === 0) {
    //   console.warn("HIBA: Az adatok tömbje üres vagy nem létezik!", dataSource);
    //   return [];
    // }

    // const start = (this.currentPage - 1) * this.itemsPerPage;
    // const end = start + this.itemsPerPage;
    // return dataSource.slice(start, end);
  }




  toSort() {

    if (!this.commonSearchResults || this.commonSearchResults.length == 0) {

      this.base.toSort(this.selectedOption, this.eventsArray)
    }
    else {
      this.base.toSort(this.selectedOption, this.commonSearchResults)
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


  //Működési terve:
  //-figyeli, hogy a searchConsole vagy a teg van kitöltve
  //-reagál arra, hogy ki van e töltve mindkettő
  searchOnPress() {

    //ha van keresőmezőben érték, és teg is ki van választva
    if (!!this.searchControl.value && this.selectedTags.length > 0) {
      this.tagSearch = true
      this.isSearch = true


      //
      forkJoin({
        searchResults: this.base.search(this.searchControl.value),
        tagResults: this.base.filterByTag(this.selectedTags)
      }).subscribe(({ searchResults, tagResults }) => {
        this.searchResults = searchResults || [];
        this.searchTagResults = tagResults.flatMap((item: any) => item.data || []);
        // this.commonSearchResults = [...this.searchTagResults]; // Kezdőérték
        console.log("searchResults a szabadszavas keresésben: ", this.searchResults);
        console.log("searchTagResults a teges keresésben: ", this.searchTagResults);

        // Összefésülés elméletileg csak akkor fut le, ha az adatok már rendelkezésre állnak
        this.filterCommonSearchResultsOnTagFilter();


        // Offcanvas bezárása
        const offcanvasElement = document.getElementById('offcanvasWithBothOptions');
        if (offcanvasElement) {
          const offcanvasInstance = Offcanvas.getInstance(offcanvasElement);
          if (offcanvasInstance) {
            offcanvasInstance.hide();
          }
          const closeButton = document.getElementById('offcanvasCloseButton');
          if (closeButton) {
            closeButton.click();
          }
        }
      })

      return

    }


    //ha ki van tölteve a searchcontrole

    //!! segítségével igaz-hamis értékké alakítjuk a value-t.
    //null, '', undefined → false lesz.
    //Ha van érték (pl. "szöveg"), akkor true.
    if (!!this.searchControl.value) {
      console.log("searchControl", this.searchControl.value)
      this.tagSearch = false
      this.isSearch = true
      this.base.search(this.searchControl.value).subscribe(
        (data: any) => {
          this.searchResults = data; // Adatok beállítása
          this.commonSearchResults = data; // Adatok beállítása


          this.base.toSort(this.selectedOption, this.commonSearchResults)
          console.log("commonSearchResults a szabadszavas keresésben: ", this.commonSearchResults);

          //Ez azért kell, hogyha a szűrés ablak meg van jelenve, akkor bezárja magát.
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

    //ha csak a tegek vannak kijelőlve, akkor ez fut le
    else if (this.selectedTags.length != 0) {
      console.log("Teg alapú keresés")
      this.isSearch = true
      this.tagSearch = true
      this.base.filterByTag(this.selectedTags).subscribe(
        (res: any) => {

          console.log("res a tegszűrőből", res)
          // this.searchTagResults = res
          this.searchTagResults = res.flatMap((item: any) => item.data || []);
          this.commonSearchResults = res.flatMap((item: any) => item.data || []);

          console.log("commonSearchResults a teges keresésben: ", this.commonSearchResults)

          //Ez azért kell, hogyha a szűrés ablak meg van jelenve, akkor bezárja magát.
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

    //ha a keresőbe a felhasználó nem ír semmit és nincs semmi teg kiválasztva
    else if (this.selectedTags.length == 0) {

      this.tagSearch = false
      this.isSearch = false
      this.commonSearchResults = []

    }





    console.log("isSearch = ", this.isSearch)
    console.log("tagSearch = ", this.tagSearch)
    console.log("commonSearchResults: ", this.commonSearchResults)




  }//vége a searchOnPress metódusnak


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

  onTagSelect(tag: any, event: Event): void {



    // this.tagSearch = true
    console.log("tag: ", tag)
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked) {
      this.selectedTags.push(tag); // Ha be van pipálva, hozzáadjuk a tömbhöz
    } else {
      // Ha nincs kipipálva, eltávolítjuk a tömbből
      if (!isChecked) {
        let indexOftag = this.selectedTags.indexOf(tag);
        if (indexOftag !== -1) {
          this.selectedTags.splice(indexOftag, 1);
        }
        if (this.selectedTags.length == 0) {
          this.isSearch = false
          this.tagSearch = false
        }
      }
    }


  }

  //gombnyomásra eltűnteti a felhaszáló a kijelölt tegeket
  clearTagSelections() {
    if (this.selectedTags.length == 0) {
      console.log("nincs kejlölt teg")
      return
    }
    else {
      this.selectedTags = []; // Kijelölt címkék listáját töröljük
      const checkboxes = document.querySelectorAll('.form-check-input');
      checkboxes.forEach((checkbox: any) => {
        checkbox.checked = false// A DOM-ban is frissítjük
      })
      this.searchOnPress(); // Frissítjük a keresést
    }

  }

  //dezső: Tegek és events kapcsolat betöltése
  getEventsAndTagsConnection() {
    this.base.getTagEvents().subscribe(
      (res: any) => {
        console.log("events and tags connection: ", res)
        this.eventsAndTagConnection = res
        console.log("eventsAndTagConnection: ", this.eventsAndTagConnection)
        console.log("res: ", res.data)
      }
    )
  }


  filterCommonSearchResultsOnTagFilter() {
    console.log("Checking commonSearchResults...");

    this.commonSearchResults = this.searchResults.filter((item1: any) => {
      const match = this.searchTagResults.some((item2: any) => {
        const isMatch = item1.id == item2.id; // `==` biztosítja a típuskonverziót
        return isMatch;
      });

      return match;
    });

    console.log("Final commonSearchResults:", this.commonSearchResults);
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

}
