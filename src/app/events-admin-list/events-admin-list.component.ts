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
  addAddColumn:any
  addEditColumn:any
  addDeleteColumn:any
  errMessage:any

  //A táblázat megjelenítéséhez
  newEvent ={image: '', name: '', description: '', startDate: '', endDate: '', startTime: '', endTime: '', locationName: '', locationcountry: '', address: '', gpx: '', weblink: ''}
  events:any

  // adatok módosításához
  editModeId: number | null = null

  //módosításkor fellépő hibaüzenetek elmentése
  errModfyMsg : any
  //új esemény felvételekor fellépő hibaüzenetek tárolása
  errNewEventMsg:any

  constructor(public base:BaseService,
      // private config:ConfigService,
      private http:HttpClient,
      public localStorage:LocalStorageService) {

    this.base.getAll()
    this.getDataFromApi()
    this.base.downloadAll()
  }

  getDataFromApi(){
    this.base.getAll().subscribe(
      (res:any) => {
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

  updateData(data:any){
    this.base.updateDataWeb(data).subscribe(
      {
        next:(res:any)=>{
          if(res.success == false){
            console.log("hibaüzenetek: ",res.error)
            this.errModfyMsg = res.error
          }
          console.log("Sikeres módosítás", res)
          alert("Sikeres módosítás!")
          this.editModeId = null
          this.base.downloadAll()
        },
        error:(error:any)=>{
          console.log("Valami hiba: ",error)
        }
      }
    )
    console.log("data" + data);
  }

  deleteData(data:any){
    this.base.deleteDataWeb(data).subscribe(
      {
        next:(res:any)=>{
          //console.log("sikeres törlés: ",res)
          this.base.downloadAll()
        },
        error:(error:any)=>{
          //console.log("Valami hiba: ",error)
        }
      }
    )
    //console.log("data" + data);

  }

  newData(){
    this.base.newDataWeb(this.newEvent).subscribe(
      {
        next:(res:any)=>{
          console.log("új esemény felvétele: ",res)
          if(res.success == false){
            console.log("hibaüzenetek: ",res.error)
            this.errNewEventMsg = res.error
          }
          //ahoz hogy az oldal újrafrissüljön.
          else{
            console.log("Sikeres új esemény felvétel: ",res)
            alert("Sikeres eseményfelvétel!")
            this.base.downloadAll()
          }

        },
        error:(error:any)=>{
          // console.log("Valami hiba történt az új esemény felvétele során: ",error)
        }
      }
    )
    this.newEvent = {image: '', name: '', description: '', startDate: '', endDate: '', startTime: '', endTime: '', locationName: '', locationcountry: '', address: '', gpx: '', weblink: ''}
  }


}
