import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Input, input } from '@angular/core';
import { LocalStorageService } from '../local-storage.service';
import { BehaviorSubject, combineLatest, debounceTime, distinctUntilChanged, forkJoin, map, Observable, switchMap } from 'rxjs';
import { FormControl } from '@angular/forms';
import { BaseService } from '../base.service';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { Offcanvas } from 'bootstrap';

@Component({
  selector: 'app-events-subscribed',
  templateUrl: './events-subscribed.component.html',
  styleUrl: './events-subscribed.component.css'
})
export class EventsSubscribedComponent {



  //oldal lapozóhoz kapcsolódik
  currentPage = 1;
  itemsPerPage = 12;

  //mit írjon a kártyára, ha nincs dátum érték
  eventStartDateNull = "Állandó"
  eventEndDateNull = ""

  //user tárolása
  user: any


  //Az ábc sorrend megvalósításához
  selectedOption = "ascByABC"


  //tegeknek
  tags: any

  //dezső: a két fajta keresés értékeinek összekapcsolása
  commonSearchResults: any[] = []

  //A szabadszavas kereséshez
  searchControl = new FormControl()
  isSearch = false;

  //Dezső: A felhasználó által kiválasztott tegek
  selectedTags: any[] = []

  tagSearch = false

  //azokat a címkéket tárolja, amelyek kapcsolódnak eseményekhez
  tagsOfEvents: any[] = []
  attachedDatas: any[] = []
  userEventsWithTags: any[] = []

  // Feliratkozások megtekintése
  userEvents: any


  //Az adatbázisban lévő komment
  userExperience: any

  constructor(private http: HttpClient, private localStorage: LocalStorageService, private base: BaseService, private auth: AuthService, private router: Router) {
    this.auth.getLoggedUser().subscribe(
      (user) => {
        this.user = user
      })

    this.base.getEventsWithTags()
    this.base.downloadAllTags()
    this.getEventsTags()
    this.base.getAllMyEvents()
    this.base.getMyExperience()

  }

  ngOnInit() {
    if (this.localStorage.getItem("token") != null) {
      this.getUserEvents() // MyEvents betöltése
      this.getUserExperience()
    }

    this.searchControl.valueChanges.subscribe(value => {
      if (value === '') {
        this.resetSearch()
      }
    })
  }


  //leiratkozás adott eseményről
  unsubscribeFromEvent(data: any) {
    this.base.unsubscribeEvent(data).subscribe(
      {
        next: (res: any) => {
          //console.log("sikeres leiratkozás: ", res)
          this.base.show(res.message || "Sikeres leiratkozás!", "success")

          // Események újratöltése az API-ból, hogy az UI frissüljön!
          this.base.getAllMyEvents()
          // Frissítsük a `userEvents` változót az új adatokkal
          this.base.myEvents.subscribe(events => {
            this.userEvents = events
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
  getEventsTags() {
    this.base.eventsWithTags.subscribe(
      (res: any) => {
        this.attachedDatas = res
        //console.log("Összekapcsolt adatok jönnek: ", res)
      }
    )
  }

  //ez a függvény az összes eseményt lekéri, amire a felhasználó feliratkozott
  getUserEvents() {
    this.base.myEvents.subscribe(
      (res: any) => {
        //console.log("userEvents", res)
        this.userEvents = res

        //console.log("userEvents: ", res)

        const commonEvents = this.attachedDatas.filter((event: any) =>
          this.userEvents.some((userEvent: any) => userEvent.id === event.eventId)

        )
        this.userEventsWithTags = commonEvents
        // console.log("ezek a user címkével kapcsolt eseményei: ", commonEvents)
        this.getUserEventsTags()
      })

  }

  getUserEventsTags() {
    //ez azt csinálja, hogy csak akkor végzi el a new Set-et, ha mind a két kapcsolódó halmaz betöltésre került, íígy nem dob hibát a console, hogy az üres adattal nem tud mit kezdeni
    combineLatest([
      this.base.tagsSub,
      this.base.eventsWithTags]).subscribe(([tagsRes, eventsRes]) => {
        this.tags = tagsRes.data
        const usedTagIds = new Set(this.userEventsWithTags.map((item: any) => item.tagId))
        this.tagsOfEvents = this.tags.filter((tag: any) => usedTagIds.has(tag.id))

        //console.log("Szűrt címkék:", this.tagsOfEvents)
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

  getUserExperience() {
    this.base.myExperiences.subscribe((res: any) => {
      const filteredExperiences = res.filter((experience: any) => experience.comment !== null)

      if (filteredExperiences.length > 0) {
        this.userExperience = filteredExperiences
        //console.log("Ezek a bejegyzézei a felhasználónak: ", this.userExperience)
      } else {
        //console.log("Nincs bejegyzés a felhasználótól.")
      }
    })

  }

  hasUserExperience(eventId: number): boolean {
    if (!Array.isArray(this.userExperience)) {
      return false  // Ha myExperiences undefined, akkor hamis
    }
    return this.userExperience.some(experience => experience.eventId === eventId)
  }

  //#region Oldal lapozás megvalósítása
  // Oldalszám beállítása
  changePage(page: number) {
    this.currentPage = page
  }

  get paginatedEvents(): any[] {
    if (!this.userEvents || !Array.isArray(this.userEvents)) {
      // console.log("az events üres vót, tartalma: ", this.events);
      return []
    }
    const start = (this.currentPage - 1) * this.itemsPerPage
    const end = start + this.itemsPerPage

    return this.userEvents.slice(start, end)
  }

  get paginatedSearchedEvents(): any[] {
    if (!this.commonSearchResults || !Array.isArray(this.commonSearchResults)) {


      // console.log("az events üres vót, tartalma: ", this.searchResults);
      return []
    }
    const start = (this.currentPage - 1) * this.itemsPerPage
    const end = start + this.itemsPerPage

    return this.commonSearchResults.slice(start, end)
  }

  //#endregion oldal lapozás megvalósítása VÉGE

  //#region Szabad szavas keresés és címke szűrés

  toSort() {
    if (!this.commonSearchResults || this.commonSearchResults.length == 0 || this.selectedTags.length == 0 && this.searchControl.value == "") {

      this.base.toSort(this.selectedOption, this.userEvents)
    }
    else {
      this.base.toSort(this.selectedOption, this.commonSearchResults)
    }
  }

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

          //dezső: Hogy csak a feliratkozott események jelenjenek meg
          this.commonSearchResults = this.showSubscribedEventsAfterSearch(this.commonSearchResults)

          //console.log("szabadszavas, majd tag szűrés eredménye: ", this.commonSearchResults)
          this.base.toSort(this.selectedOption, this.commonSearchResults)

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

          //dezső: Hogy csak a feliratkozott események jelenjenek meg
          this.commonSearchResults = this.showSubscribedEventsAfterSearch(this.commonSearchResults)

          this.base.toSort(this.selectedOption, this.commonSearchResults)

          // Offcanvas bezárása
          this.closeOffcanvas()
        }
      )
    }

    // Ha nincs keresés és nincs tag szűrés
    else if (this.selectedTags.length == 0 && !this.searchControl.value) {
      this.tagSearch = false
      this.isSearch = false
      this.commonSearchResults = []
    }
  }
  resetSearch() {
    this.commonSearchResults = []
    this.isSearch = false
    this.tagSearch = this.selectedTags.length > 0
    // Ha kell, itt újra lekérheted a tag alapú találatokat is
    if (this.tagSearch) {
      this.searchOnPress() // csak ha azt akarod, hogy tag szűrés újra fusson
    }
    this.closeOffcanvas()
  }
  //Csak azoknak az eseményeknek a megjelenítése, amelyekre a felhasználó feliratkozott
  showSubscribedEventsAfterSearch(searchedEvents: any) {
    let income = new Set(searchedEvents.map((event: any) => event.id))
    let res = this.userEvents.filter((event: any) => income.has(event.id))
    //console.log("showSubscribedEventsAfterSearch", res)
    return res
  }

  //#endregion Szabad szavas keresés és címke szűrés VÉGE

  //#region Tegek kiválasztásának és megszűntetésének megvalósítása

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
          this.selectedTags.splice(indexOftag, 1);
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
  //#endregion Tegek kiválasztásának és megszűntetésének megvalósítása VÉGE

  //Ha az oldal látogatója bejelentkezés nélkül próbálkozik az események részleteivel, akkor átirányítja a bejelentkezési oldalra
  navigateToEvent(eventId: number) {
    if (this.user) {
      this.router.navigate(['/detailed-event', eventId]); // Ha be van jelentkezve
    } else {
      this.router.navigate(['/login']); // Ha nincs bejelentkezve
      alert("A funkcióhoz bejelentkezés szükséges")
    }
  }




  // Események duplikálásának eltávolítása id-name páros alapján
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



  // Offcanvas bezárásához
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

}
