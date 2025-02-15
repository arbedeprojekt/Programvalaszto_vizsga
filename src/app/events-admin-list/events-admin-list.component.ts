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
  oszlopok =["picture","name", "description", "startDate", "endDate", "startTime", "endTime", "locationName", "locationcountry", "address", "state", "gpsLink", "weblink"]
  newEvents =["name", "description", "locationName", "locationcountry", "address", "gpsLink", "weblink", "startDate", "endDate", "startTime", "endTime"]

// A kétnyelvűséghez
  links:any
  dropClose=true
  lang="Magyar"

  gombAtallit = true

  cikkek:any
  newCikk:any={}

  constructor(
      public base:BaseService,
      // private config:ConfigService,
      private http:HttpClient)
      {


    //a base service getAll metódusát meghívva átadjuk a cikkeket
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
    console.log(this.links)

  }

  updateData(data:any){
    this.base.updateDataWeb(data)
  }

  deleteData(data:any){
    this.base.deleteDataWeb(data)
  }

  newData(){
    this.base.newDataWeb(this.newCikk)
    this.newCikk={}
  }

  showDatas (){
    this.base.getAll().subscribe(
      (res)=>this.cikkek=res
    )
  }


  // gombBeallitasa(lang:string){
  //   this.lang=lang=="hu"?"Magyar":"English"
  //   this.config.setLang(lang)
  //   this.dropClose=true

  //   if(lang == "hu"){
  //     this.gombAtallit = true;
  //   }
  //   else{
  //     this.gombAtallit = false;
  //   }

  // }
}
