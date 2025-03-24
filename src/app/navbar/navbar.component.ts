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
  user: any

  userName$: any
  userToken: any
  userAdmin: any
  loggedIn = false
  constructor(public auth: AuthService, private localStorage: LocalStorageService) {
    this.auth.getLoggedUser().subscribe(
      (u) => {
        this.user = u
        //console.log("user", u.name)
      }
    )

  }

  logoutUserWithLaravel() {
    this.auth.logoutUserFromLaravel()
    //console.log("A felhasználó sikeresen kijelentkezve.")
  }

}
