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

  userek: any
  

  //módosításkor fellépő hibaüzenetek elmentése
  errModfyMsg: any
  //új esemény felvételekor fellépő hibaüzenetek tárolása
  errNewEventMsg: any

  selectDesabled = true

  constructor(public base: BaseService,
    // private config:ConfigService,
    private http: HttpClient,
    public localStorage: LocalStorageService) {


    //a base service getAll metódusát meghívva átadjuk a usereket
    // this.base.getAll().subscribe(
    //   (res)=>this.userek=res
    // )

    // this.base.getAllUsers().subscribe(
    //   (res) => this.userek = res
    // )
    this.base.dataUsersObs.subscribe(
      (res:any) => this.userek = res
    )
    this.base.downloadAllUsers()

    this.isUserSuperadmin() 

  }

  getDataFromApi() {
    this.base.dataUsersSub.subscribe(
      (res: any) => {
        //console.log("res a users-ben:", res)
        this.userek = res.data
      }
    )
  }


  updateData(data: any) {
    let admin = localStorage.getItem("admin")
    this.base.updateUser(data)
    this.base.dataUsersSub.subscribe()

  }

  isUserSuperadmin() {
    if(this.localStorage.getItem("admin") === "2"){
      this.selectDesabled = false
    }
    else{
      this.selectDesabled = true

    }
    console.log("isUserSuperadmin lefutott!!")
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

}
