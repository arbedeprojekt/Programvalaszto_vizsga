import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalStorageService } from '../local-storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  name = ""
  password = ""
  email = ""

  mailRegError = false
  // mailRegText = ""
  //Dezső: ez a változó ahhoz kell, hogy a mezőnél lévő szem ikonra kattintva a jelszó látható legyen
  eyeIconToShowPassword = false
  toSwitchPasswordInputTypeDynamic = ['password', 'text']

  //hogyha bepróbál jelentkezni, de nem tudja pontosan a saját felhasználónevét vagy jelszavát
  errorNameMessage: any
  //hogyha bepróbál jelentkezni, de nem tudja pontosan a saját felhasználónevét vagy jelszavát
  errorPasswordMessage: any
  //hogyha bepróbál jelentkezni, de nem tudja pontosan a saját felhasználónevét vagy jelszavát
  unknownErrorMessage: any
  //hogyha bepróbál jelentkezni, de nem tudja pontosan a saját felhasználónevét vagy jelszavát
  unknownErrorMessageBool = false
  //visszajelez, ha hibás a login
  loginError = false





  constructor(private auth: AuthService, private router: Router, private route: ActivatedRoute, private localStorage: LocalStorageService) { }

  visiblePassword() {
    return this.toSwitchPasswordInputTypeDynamic[Number(this.eyeIconToShowPassword)]
  }




  loginUserOnLaravel() {
    this.auth.loginWithLaravel(this.name, this.password).subscribe(
      {
        next: (res: any) => {
          if (res.data) {
            if (res.data.token) {
              this.auth.setLoggedUser(res.data)

              this.loginError = false
              this.errorNameMessage = ""
              this.errorPasswordMessage = ""
              this.mailRegError = false

              this.localStorage.setItem("token", res.data.token)
              this.localStorage.setItem("user", res.data.name)
              this.localStorage.setItem("admin", res.data.admin)


              // console.log(this.auth.saveLoginData)


              this.unknownErrorMessageBool = false

              // Ellenőrizzük, hogy van-e returnUrl
              let returnUrl = this.route.snapshot.queryParams['returnUrl']

              // Ha nincs returnUrl, vagy ha maga a login oldalra mutat, akkor a főoldalra navigálunk
              if (!returnUrl || returnUrl.includes('/login')) {
                returnUrl = '/home'

                if ((localStorage.getItem('admin') === '2') || (localStorage.getItem('admin') === '1')) {
                  returnUrl = '/events-admin'
                }
              }
              this.router.navigateByUrl(returnUrl)
            }

          }
          else {
            this.loginError = true
            this.errorNameMessage = res.error['name']
            this.errorPasswordMessage = res.error['password']
            this.unknownErrorMessageBool = false
            //console.log("hiba", res.data)
          }
        },
        // console.log("Token: " ,this.token)},
        error: (res: any) => {
          this.loginError = false

          const status = res.status;

          if (status === 404) {
            this.auth.showToast("A felhasználónév vagy jelszó nem megfelelő", "danger")
          } else if (status === 401) {
            this.auth.showToast("A felhasználónév vagy jelszó nem megfelelő", "danger")
          } else if (status === 403) {
            this.auth.showToast("Igazolja vissza az e-mail címét a bejelentkezés előtt.", "danger")
          } else {
            this.auth.showToast("Hálózati vagy szerverhiba történt!", "danger")
          }
        }
      }
    )
  }

  logoutUserWithLaravel() {
    this.auth.logoutUserFromLaravel(),
      this.router.navigate(['/home'])
  }

  //jelenjen meg egy blokk a bejelentkezés oldalon, ha máshonnan irányítjuk ide a felhasználót (pl, ha olyan oldalt akar megnézni url birtokában, amit kijelentkezve nem lehet elérni)
  setVisible(): boolean {
    // Ellenőrizzük, hogy van-e returnUrl
    let returnUrl = this.route.snapshot.queryParams['returnUrl']
    if (returnUrl) {
      return true
    }
    else {
      return false
    }
  }


}
