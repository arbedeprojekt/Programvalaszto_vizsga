import { LocalStorageService } from './../local-storage.service';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { BaseService } from '../base.service';

@Component({
  selector: 'app-events-admin-list',
  templateUrl: './events-admin-list.component.html',
  styleUrl: './events-admin-list.component.css'
})
export class EventsAdminListComponent {
  // albums:any=[]
  // szortirozottAdatok = new Subject()
  // addAddColumn:any
  // addEditColumn:any
  // addDeleteColumn:any
  // errMessage:any

  name = ""
  startDate = ""
  endDate = ""
  startTime = ""
  endTime = ""

  newEventSuccess = false
  eventModifySuccess = false
  erName: any
  erStartDate: any
  erEndDate: any
  erStartTime: any
  erEndTime: any
  erWeblink: any

  erModName: any
  erModStartDate: any
  erModEndDate: any
  erModStartTime: any
  erModEndTime: any
  erModWeblink: any

  //A táblázat megjelenítéséhez
  newEvent = { image: '', name: '', description: '', startDate: '', endDate: '', startTime: '', endTime: '', locationName: '', locationcountry: '', address: '', gpx: '', weblink: '' }
  events: any

  // adatok módosításához
  editModeId: number | null = null

  //módosításkor fellépő hibaüzenetek elmentése
  errModfyMsg: any
  //új esemény felvételekor fellépő hibaüzenetek tárolása
  errNewEventMsg: any

  constructor(public base: BaseService,
    // private config:ConfigService,
    private http: HttpClient,
    public localStorage: LocalStorageService) {

    this.base.getAll()
    this.getDataFromApi()
    this.base.downloadAll()
  }

  getDataFromApi() {
    this.base.getAll().subscribe(
      (res: any) => {
        this.events = res.data
      }
    )
  }


  editRow(event: any) {
    this.editModeId = event.id // A sor szerkesztésének megkezdése
  }

  cancelEdit() {
    this.editModeId = null
    this.base.downloadAll()
  }

  updateData(data: any) {
    this.base.updateDataWeb(data).subscribe(
      {
        next: (res: any) => {
          if (res.success == false) {
            //console.log("hibaüzenetek: ", res.error)
            this.errModfyMsg = res.error
            this.erModName = ""
            this.erModName = res.error["name"]
            this.erModStartDate = res.error["startDate"]
            this.erModEndDate = res.error["endDate"]
            this.erModStartTime = res.error["startTime"]
            this.erModEndTime = res.error["endTime"]
            this.erModWeblink = res.error["weblink"]
            this.base.show(res.message || "Hiba történt!", "danger")
          }
          else {
            //console.log("Sikeres módosítás", res)
            this.eventModifySuccess = true
            this.base.show(res.message || "Sikeres módosítás!", "success")
            this.editModeId = null
            this.base.downloadAll()
          }
        },
        error: (error: any) => {
          //console.log("Valami hiba: ", error)
          this.base.show("Hálózati hiba vagy szerverhiba történt!", "danger")
        }
      }
    )
    //console.log("data" + data);
  }

  deleteData(data: any) {
    const confirmDelete = window.confirm('Biztosan törlöd ezt az eseményt?')

    if (confirmDelete) {
      this.base.deleteDataWeb(data).subscribe(
        {
          next: (res: any) => {
            //console.log("sikeres törlés: ",res)
            this.base.downloadAll()
            this.base.show(res.message || "Sikeres törlés!", "success")
          },
          error: (error: any) => {
            //console.log("Valami hiba: ",error)
            this.base.show("Hálózati hiba vagy szerverhiba történt!", "danger")
          }
        }
      )
    }


  }

  newData() {
    this.base.newDataWeb(this.newEvent).subscribe(
      {
        next: (res: any) => {
          //console.log("új esemény felvétele: ",res)
          if (res.success == false) {
            //console.log("hibaüzenetek: ", res.error)
            this.errNewEventMsg = res.error
            this.erName = ""
            this.erName = res.error["name"]
            this.erStartDate = res.error["startDate"]
            this.erEndDate = res.error["endDate"]
            this.erStartTime = res.error["startTime"]
            this.erEndTime = res.error["endTime"]
            this.erWeblink = res.error["weblink"]
            this.base.show("Hiba történt!", "danger")
          }
          //ahoz hogy az oldal újrafrissüljön.
          else {
            //console.log("Sikeres új esemény felvétel: ",res)
            this.base.show(res.message || "Sikeres rögzítés!", "success")
            this.newEventSuccess = true
            this.base.downloadAll()
          }

        },
        error: (error: any) => {
          // console.log("Valami hiba történt az új esemény felvétele során: ",error)
          this.base.show("Hálózati hiba vagy szerverhiba történt!", "danger")
        }
      }
    )
    this.newEvent = { image: '', name: '', description: '', startDate: '', endDate: '', startTime: '', endTime: '', locationName: '', locationcountry: '', address: '', gpx: '', weblink: '' }
  }

}
