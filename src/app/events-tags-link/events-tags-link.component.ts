import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { BaseService } from '../base.service';
import { LocalStorageService } from '../local-storage.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-events-tags-link',
  templateUrl: './events-tags-link.component.html',
  styleUrl: './events-tags-link.component.css'
})
export class EventsTagsLinkComponent {

  //A kereséshez
  searchIdControl = new FormControl()
  searchNameControl = new FormControl()
  searchEventResults: any
  searchResults: any
  isEventSearch = false
  isSearch = false
  noSearchResults = false
  noEventSearchResults = false

  searchTerm: string = ''
  searchWithoutTagList: string = ''

  //Az ábc sorrend megvalósításához
  selectedOption = "ascByABC"
  eventsArray = []
  sortedEventsArray: any

  //tagek
  tags: any
  groups: any
  selectedTags: number[] = []; // Az ID-kat fogjuk tárolni

  //események
  events: any
  detailedEventId: number | null = null

  //összekapcsolt esemény-tag adatok
  attachedDatas: any
  newAttachTagToEvent: any
  showWithTag = true
  eventsWithoutTags: any
  closeAfterSave = false

  constructor(private http: HttpClient, private auth: AuthService, private base: BaseService, public localStorage: LocalStorageService) {

    this.getTags()
    this.base.downloadAllTags()
    this.getDataFromApi()
    this.base.getAll()
    this.base.getEventsWithTags()
    this.getEventsTags()
  }


  //#region keresés
  toSort() {
    if (!this.searchResults) {
      this.base.toSort(this.selectedOption, this.eventsArray)
    }
    else {
      this.base.toSort(this.selectedOption, this.searchResults)
    }
  }

  //szabadszavas keresés, csak FE, nem kommunikál a BE-el!!
  searchWithTagsTable() {
    //console.log("keresés")
    if (!this.searchTerm) {
      return this.attachedDatas
    }

    return this.attachedDatas.filter((attachedData: any) =>
      attachedData.eventName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      attachedData.tagName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      attachedData.tagGroup.toLowerCase().includes(this.searchTerm.toLowerCase())
    )
  }

  searchWithoutTagsTable() {
    //console.log("keresés")
    if (!this.searchWithoutTagList) {
      return this.eventsWithoutTags
    }

    return this.eventsWithoutTags.filter((eventsWithoutTag: any) =>
      eventsWithoutTag.name.toLowerCase().includes(this.searchWithoutTagList.toLowerCase()) ||
      eventsWithoutTag.id.toString().toLowerCase().includes(this.searchWithoutTagList.toLowerCase())
    )
  }


  searchEvent() {
    const searchId = this.searchIdControl.value
    const searchName = this.searchNameControl.value

    if (!searchId && !searchName) {
      //console.log("Nincs keresési feltétel")
      this.isEventSearch = false
      return
    }

    this.isEventSearch = true

    this.base.search(this.searchIdControl.value || this.searchNameControl.value).subscribe((data: any) => {
      //this.searchResults = data
      let filteredResults = data
      //console.log("filterResult: ", data)

      if (searchId) {
        filteredResults = filteredResults.filter((event: any) =>
          event.id.toString() === searchId.toString()
        )
      }

      if (searchName) {
        filteredResults = filteredResults.filter((event: any) =>
          event.name.toLowerCase().includes(searchName.toLowerCase())
        )
      }

      // Ha nincs találat, állítsunk be egy hibaüzenetet
      if (filteredResults.length === 0) {
        this.noEventSearchResults = true
      } else {
        this.noEventSearchResults = false
      }

      this.searchEventResults = filteredResults
      this.base.toSort(this.selectedOption, this.searchEventResults)
      //console.log("searchResults: ", this.searchEventResults);
    })
  }

  //#region tag-ek és események összekapcsolása
  getTags() {
    this.base.tagsSub.subscribe(
      (tag: any) => {
        this.tags = tag.data
        //console.log("Jönnek a címkék: ", tag)
      }
    )
  }

  getDataFromApi() {
    this.base.getAll().subscribe(
      (res: any) => {
        this.events = res.data
        //console.log("Jönnek az események: ", res.data)
      }
    )
  }
  
  //Ez kezeli, hogy a checkboxok kiválasztott tartalma frissüljön
  updateSelectedTags(event: Event, tagId: number) {
    const isChecked = (event.target as HTMLInputElement).checked

    if (isChecked) {
      this.selectedTags.push(tagId)
      //console.log("Kiválasztott címkék checkbox: ", tagId)
    } else {
      this.selectedTags = this.selectedTags.filter(id => id !== tagId)
    }
  }

  newAttach(eventId: number, selectedTags: number[]) {
    if (!eventId || selectedTags.length === 0) {
      console.error("Hiba: Hiányzó adatok!", { eventId, selectedTags })
      //alert("Hiba: Az esemény vagy a címke nincs kiválasztva!")
      this.base.show("A címke nincs kiválasztva!", "warning")
      return
    }

    this.newAttachTagToEvent = {
      eventId: eventId,
      tagId: selectedTags
    }
    //console.log("Összekapcsolásra küldött adatok:", this.newAttachTagToEvent)

    this.base.attachTagToEvent(this.newAttachTagToEvent).subscribe({
      next: (res: any) => {
        if (res.success === false) {
          this.base.show(res.message || "Az összekapcsolás sikertelen!", "danger")
        } else {
          this.base.show(res.message || "Sikeres összekapcsolás!", "success")
          //this.closeAfterSave = true        //JAVÍTANI KELL
          this.selectedTags = []
          this.base.getEventsWithTags()
          
        }
      },
      error: (error: any) => {
        this.base.show("Hálózati hiba vagy szerverhiba történt!", "danger")
      }
    });

    this.newAttachTagToEvent = {}
    //this.closeAfterSave = false       //JAVÍTANI KELL
    //console.log("Új összekapcsolás: ", this.newAttachTagToEvent)
  }


  getEventsTags() {
    this.base.eventsWithTags.subscribe(
      (res: any) => {
        this.attachedDatas = res
        //console.log("Összekapcsolt adatok jönnek: ", res)

        if(this.attachedDatas) 
          {
            this.showWithTag = true
          } 
          else {
            this.showWithTag = false
          }
        
        this.getEventsWithoutTag()
      }
    )
  }

  deleteTagFromEvent(data: any) {
    this.base.detachTagFromEvent(data).subscribe(
      {
        next: (res: any) => {
          //console.log("Sikeres törlés: ", res)
          this.base.show(res.message || "Sikeres törlés!", "success")
          this.base.getEventsWithTags()
        },
        error: (error: any) => {
          // console.log("Valami hiba történt a törlés során: ", error)
          this.base.show("Hálózati hiba vagy szerverhiba történt!", "danger")
        }
      }
    )
  }

  //címke nélküli események listája:
  getEventsWithoutTag() {
    this.eventsWithoutTags = this.events.filter((event:any) => 
      !this.attachedDatas.some((taggedEvent:any) => taggedEvent.eventId === event.id)
    )
    //console.log("Események címke nélkül: ", this.eventsWithoutTags)
  }




}
