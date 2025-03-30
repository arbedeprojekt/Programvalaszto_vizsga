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
  }

  get paginatedSearchedEvents2(): any[] {
    if (!this.searchTagResults || !Array.isArray(this.searchTagResults)) {
      // console.log("az events üres vót, tartalma: ", this.searchResults);
      return [];
    }
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;

    return this.searchTagResults.slice(start, end);
  }



  toSort() {

    // if (!this.searchResults && !this.tagSearch) {
    //   this.base.toSort(this.selectedOption, this.eventsArray)
    // }
    // else if (this.tagSearch) {
    //   this.base.toSort(this.selectedOption, this.commonSearchResults)
    // }


    // else if (this.searchResults) {
    //   this.base.toSort(this.selectedOption, this.commonSearchResults)
    // }
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


  searchOnPress() {
    //console.log("keresés")
    if (!this.selectedTags || this.selectedTags.length == 0) {
      this.tagSearch = false
    }
    else {
      this.base.filterByTag(this.selectedTags).subscribe(
        (res: any) => {

          console.log("res a tegszűrőből", res)

          this.searchTagResults = res.flatMap((item: any) => item.data || []);
          this.commonSearchResults = res.flatMap((item: any) => item.data || []);

          console.log("searchTagResults: ", this.searchTagResults)

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
    if (this.searchControl.value === '') {
      console.log("searchOn")
      this.isSearch = false
      this.searchResults = []
      this.commonSearchResults = []

    }
    else {
      this.isSearch = true
      //vizsgálom, hogy korábban volt-e már teg alapú keresés, ha igen, akkor a teg alapú keresést szűröm.
      if (this.tagSearch == true) {
        //ellenőrizzük, hogy van e tartalma a searchResults tömbnek, ha nincs, akkor küldjük el a backendnek a kiválasztott tageket
        if (this.tagSearch == true && this.searchResults.length == 0) {
          this.base.search(this.searchControl.value).subscribe(
            (data: any) => {

              this.searchResults = data; // Adatok beállítása
              this.commonSearchResults = data; // Adatok beállítása
              this.filterCommonSearchResultsOnOnPress()


              this.base.toSort(this.selectedOption, this.commonSearchResults)
              console.log("commonSearchResults: ", this.commonSearchResults);



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



        this.commonSearchResults = this.searchTagResults.filter((item1: any) => {
          const match = this.searchResults.some((item2: any) => {
            const isMatch = item1.id == item2.id; // `==` biztosítja a típuskonverziót
            // console.log(`Comparing: item1.id=${item1.id}, item2.id=${item2.id}, match=${isMatch}`);
            return isMatch;
          });

          // console.log(`Result for item1.id=${item1.id}: ${match}`);
          return match;
        });

        console.log("Final commonSearchResults:", this.commonSearchResults);
      }

      else {
        console.log("nincs teg alapú keresés")
        this.commonSearchResults = []

        this.base.search(this.searchControl.value).subscribe(
          (data: any) => {

            this.searchResults = data; // Adatok beállítása
            this.commonSearchResults = data; // Adatok beállítása


            this.base.toSort(this.selectedOption, this.commonSearchResults)
            console.log("commonSearchResults: ", this.commonSearchResults);

            // if (this.searchControl.value.length < 1) {
            //   const offcanvasElement = document.getElementById('offcanvasWithBothOptions');
            //   if (offcanvasElement) {
            //     const offcanvasInstance = Offcanvas.getInstance(offcanvasElement);
            //     if (offcanvasInstance) {
            //       offcanvasInstance.hide();

            //     }
            //     const closeButton = document.getElementById('offcanvasCloseButton');
            //     if (closeButton) {
            //       closeButton.click(); // Programozott kattintás
            //     }
            //   }

            // }

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
    console.log("tagSearch: ", this.tagSearch)
    console.log("isSearch: ", this.isSearch)


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
      }
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

  //dezső: Szűrés tegek alapján
  SearchByTags(tags: any[]) {

    //dezső: Ellenőrizzük, hogy van-e kiválasztott tag, hogy ha nincs, akkor ne küldjön üres tömböt a backendnek
    if (this.selectedTags.length > 0) {

      this.tagSearch = true


      //vizsgálom, hogy korábban volt-e már szabadszavas keresés, ha igen, akkor a szabadszavas keresést szűröm.
      if (this.isSearch == true) {
        //ellenőrizzük, hogy van e tartalma a searchTagResults tömbnek, ha nincs, akkor küldjük el a backendnek a kiválasztott tageket
        if (this.isSearch == true && this.searchTagResults.length == 0) {
          this.base.filterByTag(this.selectedTags).subscribe(
            (res: any) => {

              console.log("res a tegszűrőből", res)

              this.searchTagResults = res.flatMap((item: any) => item.data || []);
              this.commonSearchResults = res.flatMap((item: any) => item.data || []);

              console.log("searchTagResults: ", this.searchTagResults)

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
        console.log("van szabadszavas keresés")


        this.base.filterByTag(this.selectedTags).subscribe(
          (res: any) => {

            console.log("res a tegszűrőből", res)
            // this.searchTagResults = res
            this.searchTagResults = res.flatMap((item: any) => item.data || []);
            this.commonSearchResults = res.flatMap((item: any) => item.data || []);

            this.filterCommonSearchResultsOnTagFilter();

          }
        )


        this.commonSearchResults = this.searchResults.filter((item1: any) => {
          const match = this.searchTagResults.some((item2: any) => {
            const isMatch = item1.id == item2.id; // `==` biztosítja a típuskonverziót
            // console.log(`Comparing: item1.id=${item1.id}, item2.id=${item2.id}, match=${isMatch}`);
            return isMatch;
          });

          // console.log(`Result for item1.id=${item1.id}: ${match}`);
          return match;
        });

        console.log("Final commonSearchResults:", this.commonSearchResults);
      }

      else {
        console.log("nincs szabadszavas keresés")
        this.commonSearchResults = []
        this.base.filterByTag(this.selectedTags).subscribe(
          (res: any) => {

            console.log("res a tegszűrőből", res)
            // this.searchTagResults = res
            this.searchTagResults = res.flatMap((item: any) => item.data || []);
            this.commonSearchResults = res.flatMap((item: any) => item.data || []);

            console.log("searchTagResults: ", this.searchTagResults)

          }
        )

      }




    }
    else if (this.selectedTags.length == 0) {

      this.tagSearch = false
      this.searchTagResults = []
      this.commonSearchResults = []

      this.searchControl.setValue('') // Visszaállítjuk az input mezőt üresre
    }




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

  filterCommonSearchResultsOnOnPress() {
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
