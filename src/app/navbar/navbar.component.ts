import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { LocalStorageService } from '../local-storage.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  // Ebben tárolom el a user adatait, és ezen keresztül jelzem a felhasználónak
  //a sikeres belépését.
  user:any

  userName$:any
  userToken:any
  userAdmin:any
  loggedIn = false
  constructor(public auth:AuthService, private localStorage:LocalStorageService){
    this.auth.getLoggedUser().subscribe(
      (u)=>this.user=u
    )

    this.userName$ = this.auth.userName
    setInterval(()=>{
      if(this.localStorage.getItem("user")==null ){
        console.log("A localstorage üres")
        this.loggedIn = false
      }
      else{

        console.log("A localstorage nem üres, tartalma: ",this.localStorage.getItem("user"))
        this.auth.getUserNameToDisplay()
        this.auth.getUserToken()
        this.auth.getUserAdminAccessCode()
        this.userName$ = this.auth.userName
        this.userAdmin = this.auth.userAdminAccessCode
        this.loggedIn = true

      }
    }

    ,3000)
    // if(this.localStorage.getItem("user")==null ){
    //   console.log("A localstorage üres")
    //   this.loggedIn = false
    // }
    // else{

    //   console.log("A localstorage nem üres, tartalma: ",this.localStorage.getItem("user"))
    //   this.auth.getUserNameToDisplay()
    //   this.auth.getUserToken()
    //   this.userName$ = this.auth.userName
    //   this.loggedIn = true

    // }


  }

  logoutUserWithLaravel(){
    this.auth.logoutUserFromLaravel()
    console.log("A felhasználó sikeresen kijelentkezve.")
  }

}
