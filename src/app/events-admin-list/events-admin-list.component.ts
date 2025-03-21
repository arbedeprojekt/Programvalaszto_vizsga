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

  items:any=[]
  columns:any=[]
  // oszlopok=["name","category","description","price"]
  adattomb:any=[]
  HozzaAdasSzoveg="Hozzáadás"
  ModositasSzoveg="Módosítás"
  TorlesSzoveg="Tőrlés"

// A táblázat megjelenítéséhez
  oszlopok =["image","name", "description", "startDate", "endDate", "startTime", "endTime", "locationName", "locationcountry", "address", "state", "gpx", "weblink"]
  newEvents =["name", "description", "locationName", "locationcountry", "address", "gpx", "weblink", "startDate", "endDate", "startTime", "endTime"]

// A kétnyelvűséghez
  links:any
  dropClose=true
  lang="Magyar"

  gombAtallit = true

  cikkek:any
  newCikk:any={}

  //módosításkor fellépő hibaüzenetek elmentése
  errModfyMsg : any
  //új esemény felvételekor fellépő hibaüzenetek tárolása
  errNewEventMsg:any

  constructor(public base:BaseService,
      // private config:ConfigService,
      private http:HttpClient,
      public localStorage:LocalStorageService) {


    //a base service getAll metódusát meghívva átadjuk a cikkeket
    // this.base.getAll().subscribe(
    //   (res)=>this.cikkek=res
    // )

    this.base.getAll().subscribe(
      (res)=>this.cikkek=res
    )


    // this.config.getLinks().subscribe(
    //   (res:any)=>this.addAddColumn=res["HozzaAdasGmb"],


    // )
    // this.config.getLinks().subscribe(
    //   (res:any)=>this.addEditColumn=res["ModositasGmb"],

    // )

    // this.config.getLinks().subscribe(
    //   (res:any)=>this.addDeleteColumn=res["TorlesGmb"],

    // )

    // this.config.getLinks().subscribe(
    //   (res:any)=>this.columns=res["columns"],

    // )

    // this.config.getLinks().subscribe(
    //   (res:any)=>this.errMessage=res["hibauzenet"],

    // )
    // console.log(this.links)

  }

  getDataFromApi(){
    this.base.getAll().subscribe(
      (res:any) => {
        this.cikkek = res.data
      }
    )
  }

  updateData(data:any){
    this.base.updateDataWeb(data).subscribe(
      {
        next:(res:any)=>{
          if(res.success == false){
            //console.log("hibaüzenetek: ",res.error)
            this.errModfyMsg = res.error
          }
          //console.log(res)
          // this.base.downloadAll()
        },
        error:(error:any)=>{
          //console.log("Valami hiba: ",error)
        }
      }
    )
    //console.log("data" + data);
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
    this.base.newDataWeb(this.newCikk).subscribe(
      {
        next:(res:any)=>{
          // console.log("új esemény felvétele: ",res)
          if(res.success == false){
            //console.log("hibaüzenetek: ",res.error)
            this.errNewEventMsg = res.error
          }
          //ahoz hogy az oldal újrafrissüljön.
          else{
            //console.log("Sikeres új esemény felvétel: ",res)
            alert("Sikeres eseményfelvétel!")
            this.base.downloadAll()
          }

        },
        error:(error:any)=>{
          // console.log("Valami hiba történt az új esemény felvétele során: ",error)
        }
      }
    )
    this.newCikk={}
  }

  showDatas (){
    this.base.getAll().subscribe(
      (res)=>this.cikkek=res
    )
  }

}
