import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { BaseService } from '../base.service';
import { BehaviorSubject, combineLatest, debounceTime, distinctUntilChanged, forkJoin, map, Observable, switchMap } from 'rxjs';
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






  events: any[] = []


  //oldal lapozóhoz kapcsolódik
  currentPage = 1;
  itemsPerPage = 12;

  //mit írjon a kártyára, ha nincs dátum érték
  eventStartDateNull = "Állandó"
  eventEndDateNull = ""




  //Az ábc sorrend megvalósításához
  selectedOption = "ascByABC"


  //tegeknek
  tags: any


  //Dezső: A felhasználó által kiválasztott tegek
  selectedTags: any[] = []

  // searchTagResults: any[] = []
  tagSearch = false;



  //azokat a címkéket tárolja, amelyek kapcsolódnak eseményekhez
  tagsOfEvents: any[] = []
  attachedDatas: any[] = []

  //A szabadszavas kereséshez
  searchControl = new FormControl()
  // backendUrl = "http://127.0.0.1:8000/api/"
  isSearch = false;

  //dezső: a két fajta keresés értékeinek összekapcsolása
  commonSearchResults: any[] = []

  // Feliratkozások megtekintése
  userEvents: any

  //Az adatbázisban lévő komment
  userExperience: any

  constructor(private http: HttpClient, private auth: AuthService, private base: BaseService, public localStorage: LocalStorageService) {


    this.base.downloadAllTags()
    this.base.getEventsWithTags()
    this.base.getAllMyEvents()
    this.base.getMyExperience()

  }

  ngOnInit() {
    this.getDataFromApi() // Az összes esemény betöltése
    this.getEventsTags()
    this.getUserEvents() // MyEvents betöltése
    this.getUserExperience()
    this.toSort()

    this.searchControl.valueChanges.subscribe(value => {
      if (value === '') {
        this.resetSearch()
      }
    })
  }

  //#region Összes esemény lekérése
  getDataFromApi() {
    this.base.eventsAllSub.subscribe(
      (res: any) => {
        if (res) {
          //console.log("res a getDataFromApi-ból: ", res)
          this.events = res.data

        }
      }
    )
  }

  //#endregion Összes esemény lekérése VÉGE

  //#region Események oldalakra bontása
  // Oldalszám beállítása
  changePage(page: number) {
    this.currentPage = page
  }


  get paginatedEvents(): any[] {
    if (!this.events || !Array.isArray(this.events)) {
      // console.log("az events üres vót, tartalma: ", this.events);
      return []
    }
    const start = (this.currentPage - 1) * this.itemsPerPage
    const end = start + this.itemsPerPage

    return this.events.slice(start, end)
  }



  get paginatedSearchedEvents(): any[] {
    if (!this.commonSearchResults || !Array.isArray(this.commonSearchResults)) {
      // console.log("az events üres vót, tartalma: ", this.searchResults);
      return []
    }
    const start = (this.currentPage - 1) * this.itemsPerPage
    const end = start + this.itemsPerPage

    //console.log("szűrt lista: ", this.commonSearchResults)
    return this.commonSearchResults.slice(start, end)
  }

  //#endregion Események oldalakra bontása VÉGE

  //#region Események szűrése(szabadszavas keresés, címkék alapján, ABC sorrend)

  toSort() {

    if (!this.commonSearchResults || this.commonSearchResults.length == 0 || this.selectedTags.length == 0 && this.searchControl.value == '') {
      this.base.toSort(this.selectedOption, this.events)
    }
    else {
      this.base.toSort(this.selectedOption, this.commonSearchResults)
    }
  }

  //Működési terve:
  //-figyeli, hogy a searchConsole vagy a teg van kitöltve
  //-reagál arra, hogy ki van e töltve mindkettő
  searchOnPress() {

    // Ha szabadszavas keresés van
    if ((this.searchControl.value) || (this.selectedTags.length != 0 && this.searchControl.value)) {
      //console.log("searchControl", this.searchControl.value)
      this.tagSearch = false
      this.isSearch = true
      this.base.search(this.searchControl.value).subscribe(
        (data: any) => {
          this.commonSearchResults = data // Adatok beállítása

          //console.log("commonSearchResults a szabadszavas keresésben: ", this.commonSearchResults)

          this.commonSearchResults = this.removeDuplicateEvents(this.commonSearchResults)

          //console.log("szabadszavas, majd tag szűrés eredménye: ", this.commonSearchResults)

          this.toSort()

          // Offcanvas bezárása
          this.closeOffcanvas()
        }
      )
    }

    // Ha tag szűrés van
    else if ((this.selectedTags.length != 0) || (this.selectedTags.length != 0 && this.searchControl.value)) {
      //console.log("Teg alapú keresés")
      this.isSearch = true
      this.tagSearch = true
      this.base.filterByTag(this.selectedTags).subscribe(
        (res: any) => {
          //console.log("res a tegszűrőből", res)

          this.commonSearchResults = res.flatMap((item: any) => item.data || [])

          this.commonSearchResults = this.removeDuplicateEvents(this.commonSearchResults)


          this.toSort()

          //console.log("commonSearchResults a teges keresésben: ", this.commonSearchResults)

          // Offcanvas bezárása
          this.closeOffcanvas()
        }
      )
    }



    else if (this.selectedTags.length == 0 && !this.searchControl.value) {
      this.tagSearch = false
      this.isSearch = false
      this.commonSearchResults = []
    }

    //console.log("isSearch = ", this.isSearch)
    //console.log("tagSearch = ", this.tagSearch)
    //console.log("commonSearchResults: ", this.commonSearchResults)
  }


  resetSearch() {
    this.commonSearchResults = []
    this.isSearch = false
    this.tagSearch = this.selectedTags.length > 0
    // Ha kell, itt újra lekérheted a tag alapú találatokat is
    if (this.tagSearch) {
      this.searchOnPress()
    }
  }
  //#endregion  VÉGE

  //#region Címkék összekötése eseményekkel
  getEventsTags() {
    //ez azt csinálja, hogy csak akkor végzi el a new Set-et, ha mind a két kapcsolódó halmaz betöltésre került.
    combineLatest([
      this.base.tagsSub,
      this.base.eventsWithTags]).subscribe(([tagsRes, eventsRes]) => {

        if (tagsRes?.data?.length != null && !eventsRes?.length != null) {
          this.tags = tagsRes.data
          this.attachedDatas = eventsRes
          //console.log("címkék: ", tagsRes.data)
          //console.log("kapcsolt címkék: ", eventsRes)

          const usedTagIds = new Set(this.attachedDatas.map((item: any) => item.tagId))
          this.tagsOfEvents = this.tags.filter((tag: any) => usedTagIds.has(tag.id))

          //console.log("Szűrt címkék:", this.tagsOfEvents)
        }
      })
  }
  //#endregion Címkék összekötése eseményekkel VÉGE






  //#region  Események duplikálásának eltávolítása id-name páros alapján
  removeDuplicateEvents(events: any[]) {
    const seen = new Set() // Egy új Set a már látott eseményekhez
    const uniqueEvents: any[] = [] // Új tömb az egyedi eseményekhez

    events.forEach((event: any) => {
      // Az id és name kombinációjával hozunk létre egy egyedi kulcsot
      const key = `${event.id}-${event.name}`

      // Ha az esemény még nem szerepel a Set-ben, hozzáadjuk a listához
      if (!seen.has(key)) {
        seen.add(key) // hozzáadjuk a kulcsot a Set-hez
        uniqueEvents.push(event) // hozzáadjuk az egyedi eseményt a listához
      }
    })

    return uniqueEvents // Visszaadjuk az egyedi események tömbjét
  }
  //#endregion Események duplikálásának eltávolítása VÉGE

  //#region Teg alapú szűréshez a tegek kiválasztásának logikája
  onTagSelect(tag: any, event: Event): void {
    //console.log("tag: ", tag)
    const isChecked = (event.target as HTMLInputElement).checked
    if (isChecked) {
      this.selectedTags.push(tag) // Ha be van pipálva, hozzáadjuk a tömbhöz
      //console.log("kiválasztott címke Id-k: ", this.selectedTags)
      if (!this.selectedTags.includes(tag)) {
        this.selectedTags.push(tag)
      }
    } else {
      // Ha nincs kipipálva, eltávolítjuk a tömbből
      if (!isChecked) {
        let indexOftag = this.selectedTags.indexOf(tag)
        if (indexOftag !== -1) {
          this.selectedTags.splice(indexOftag, 1)
        }
      }
    }
  }

  //gombnyomásra eltűnteti a felhaszáló a kijelölt tegeket
  clearTagSelections() {
    if (this.selectedTags.length == 0) {
      //console.log("nincs kejlölt teg")
      this.tagSearch = false
      return this.searchOnPress()
    }
    else {
      this.selectedTags = [] // Kijelölt címkék listáját töröljük
      const checkboxes = document.querySelectorAll('.form-check-input');
      checkboxes.forEach((checkbox: any) => {
        checkbox.checked = false// A DOM-ban is frissítjük
      })
      this.searchOnPress() // Frissítjük a keresést
    }
    this.closeOffcanvas()

  }
  //#endregion Teg alapú szűréshez a tegek kiválasztásának logikája VÉGE

  //#region Offcanvas bezárásához
  closeOffcanvas() {
    const offcanvasElement = document.getElementById('offcanvasWithBothOptions')
    if (offcanvasElement) {
      const offcanvasInstance = Offcanvas.getInstance(offcanvasElement)
      if (offcanvasInstance) {
        offcanvasInstance.hide()
      }
      const closeButton = document.getElementById('offcanvasCloseButton')
      if (closeButton) {
        closeButton.click() // Programozott kattintás
      }
    }
  }
  //#endregion Offcanvas bezárásához VÉGE

  //#region Felhasználó általi feliratkozás és leiratkozás kezelése
  //feliratkozás adott eseményre
  subscribeToEvent(event: any) {
    this.base.subscribeEvent(event).subscribe(
      {
        next: (res: any) => {
          // console.log("új esemény felvétele: ",res)
          if (res.success == false) {
            //console.log("hibaüzenetek: ", res.error)
            this.base.show(res.message || "Hiba történt!", "danger")
          }
          //ahoz hogy az oldal újrafrissüljön.
          else {
            this.base.getAllMyEvents()
            //console.log("Sikeres új esemény felvétel: ", res)
            this.base.show(res.message || "Sikeres feliratkozás!", "success")


            // Frissítsük a komponens változóját:
            this.base.myEvents.subscribe(events => {
              this.userEvents = events
            })
          }
        },
        error: (error: any) => {
          //console.log("Valami hiba történt az új esemény felvétele során: ", error)
          this.base.show("Hálózati hiba vagy szerverhiba történt!", "danger")
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

  isEventSubscribed(eventId: number): boolean {
    if (!Array.isArray(this.userEvents)) {
      return false // Ha myEvents undefined, akkor hamis
    }

    for (let i = 0; i < this.userEvents.length; i++) {
      if (this.userEvents[i].id === eventId) {
        return true // Ha találunk egyezést, rögtön visszatérünk
      }
    }
    return false // Ha végigmentünk és nem találtunk, akkor false
  }

  //#endregion Felhasználó általi feliratkozás és leiratkozás kezelése VÉGE

  //#region Az eseményhez tartozó kommentek kezelése, és a felhasználó által feliratkozott események lekérése.
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



  getUserExperience() {
    this.base.myExperiences.subscribe((res: any) => {
      if (res) {
        const filteredExperiences = res.filter((experience: any) => experience.comment !== null)

        if (filteredExperiences.length > 0) {
          this.userExperience = filteredExperiences
          //console.log("Ezek a bejegyzézei a felhasználónak: ", this.userExperience)
        } else {
          //console.log("Nincs bejegyzés a felhasználótól.")
        }
      }
    })

  }

  hasUserExperience(eventId: number): boolean {
    if (!Array.isArray(this.userExperience)) {
      return false  // Ha myExperiences undefined, akkor hamis
    }

    return this.userExperience.some(experience => experience.eventId === eventId)

  }

  //#endregion Az eseményhez tartozó kommentek kezelése, és a felhasználó által feliratkozott események lekérése. VÉGE
}
