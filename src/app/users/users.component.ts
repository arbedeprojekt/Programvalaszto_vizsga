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

  addAddColumn: any
  addEditColumn: any
  addDeleteColumn: any
  errMessage: any

  users: any

  // adatok módosításához
  editModeId: number | null = null
  
  //módosításkor fellépő hibaüzenetek elmentése
  errModfyMsg: any

  selectDisabled = true

  constructor(public base: BaseService,
    // private config:ConfigService,
    private http: HttpClient,
    public localStorage: LocalStorageService) {
    this.base.dataUsersObs.subscribe(
      (res:any) => this.users = res
    )
    this.base.downloadAllUsers()
    this.getAllUsers()
    this.isUserSuperadmin() 

  }

  getAllUsers() {
    this.base.dataUsersSub.subscribe(
      (user: any) => {
        //console.log("res a users-ben:", res)
        this.users = user.data
      }
    )
  }

  // updateData(data: any) {
  //   let admin = localStorage.getItem("admin")
  //   this.base.updateUser(data)
  //   this.base.dataUsersSub.subscribe()
  // }

  updateData(data:any){
    let admin = localStorage.getItem("admin")

    if( admin === "2" || admin === "1") {
      this.base.updateUser(data).subscribe(
        {
          next:(res:any)=>{
            if(res.success == false){
              console.log("hibaüzenetek: ",res.error)
              this.base.show(res.message || "A módosítás sikertelen!", "danger")
            }
            console.log("Sikeres módosítás", res)
            this.base.show(res.message || "Sikeres módosítás!", "success")
            this.editModeId = null
            this.base.downloadAllUsers()
          },
          error:(error:any)=>{
            //console.log("Valami hiba: ",error)
            this.base.show("Hálózati hiba vagy szerverhiba történt!", "danger")
          }
        }
      )
      console.log("data" + data);
    }
  }

  isUserSuperadmin() {
    if(this.localStorage.getItem("admin") === "2"){
      this.selectDisabled = false
    }
    else{
      this.selectDisabled = true

    }
    console.log("isUserSuperadmin lefutott!!")
  }

  deleteData(data: any) {
    this.base.deleteUser(data).subscribe(
      {
        next: (res: any) => {
          //console.log("sikeres törlés: ", res)
          this.base.show(res.message || "Sikeres törlés!", "success")
          this.base.downloadAllUsers()
        },
        error: (error: any) => {
          //console.log("Valami hiba: ", error)
          this.base.show("Hálózati hiba vagy szerverhiba történt!", "danger")
        }
      }
    )
    //console.log("data" + data);
  }

  editRow(user: any) {
    this.editModeId = user.id // A sor szerkesztésének megkezdése
  }

  cancelEdit() {
    this.editModeId = null
    this.base.downloadAllUsers()
  }

}
