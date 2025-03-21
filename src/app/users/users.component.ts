import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { BaseService } from '../base.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LocalStorageService } from '../local-storage.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent {
  // albums:any=[]
  // szortirozottAdatok = new Subject()
  addAddColumn: any
  addEditColumn: any
  addDeleteColumn: any
  errMessage: any

  backendUrl = "http://127.0.0.1:8000/api/"

  items: any = []
  columns: any = []
  // oszlopok=["name","category","description","price"]
  adattomb: any = []
  HozzaAdasSzoveg = "Hozzáadás"
  ModositasSzoveg = "Módosítás"
  TorlesSzoveg = "Tőrlés"

  // A táblázat megjelenítéséhez
  oszlopok = ["name", "email", "admin"]
  //a fejlécek magyar nyelvű megjelenítéséhez
  columnNameDisplay = ["felhasználónév", "email", "jogosultság: (0-user,1-admin,2-superadmin)"]
  newEvents = ["name", "description", "locationName", "locationcountry", "address", "gpx", "weblink", "startDate", "endDate", "startTime", "endTime"]

  // A kétnyelvűséghez
  links: any
  dropClose = true
  lang = "Magyar"

  gombAtallit = true

  cikkek: any
  newCikk: any = {}

  //módosításkor fellépő hibaüzenetek elmentése
  errModfyMsg: any
  //új esemény felvételekor fellépő hibaüzenetek tárolása
  errNewEventMsg: any

  constructor(public base: BaseService,
    // private config:ConfigService,
    private http: HttpClient,
    public localStorage: LocalStorageService) {


    //a base service getAll metódusát meghívva átadjuk a cikkeket
    // this.base.getAll().subscribe(
    //   (res)=>this.cikkek=res
    // )

    // this.base.getAllUsers().subscribe(
    //   (res) => this.cikkek = res
    // )
    this.base.dataUsersObs.subscribe(
      (res:any) => this.cikkek = res
    )
    this.base.downloadAllUsers()


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

  getDataFromApi() {
    this.base.dataUsersSub.subscribe(
      (res: any) => {
        //console.log("res a users-ben:", res)
        this.cikkek = res.data
      }
    )
  }


  updateData(data: any) {
    let admin = localStorage.getItem("admin")
    this.base.updateUser(data)
    this.base.dataUsersSub.subscribe()

  }



  deleteData(data: any) {
    this.base.deleteUser(data).subscribe(
      {
        next: (res: any) => {
          //console.log("sikeres tőrlés: ", res)
          this.base.downloadAllUsers()
        },
        error: (error: any) => {
          //console.log("Valami hiba: ", error)
          alert("Szuperadmint nem lehet törölni/módosítani!")
        }
      }
    )
    //console.log("data" + data);

  }

  newData() {
    this.base.newDataWeb(this.newCikk).subscribe(
      {
        next: (res: any) => {
          // console.log("új esemény felvétele: ",res)
          if (res.success == false) {
            //console.log("hibaüzenetek: ", res.error)
            this.errNewEventMsg = res.error
          }
          //ahoz hogy az oldal újrafrissüljön.
          else {
            //console.log("Sikeres új esemény felvétel: ", res)
            alert("Sikeres eseményfelvétel!")
            this.base.downloadAll()
          }

        },
        error: (error: any) => {
          // console.log("Valami hiba történt az új esemény felvétele során: ",error)
        }
      }
    )
    this.newCikk = {}
  }

  showDatas() {
    this.base.getAll().subscribe(
      (res) => this.cikkek = res
    )
  }
}
