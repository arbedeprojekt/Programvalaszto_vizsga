import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
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

  mailRegError=false
  mailRegText=""
  szem=false
  tomb=['password','text']

  //hogyha bepróbál jelentkezni, de nem tudja pontosan a saját felhasználónevét vagy jelszavát
  errorNameMessage: any
  //hogyha bepróbál jelentkezni, de nem tudja pontosan a saját felhasználónevét vagy jelszavát
  errorPasswordMessage: any
  //hogyha bepróbál jelentkezni, de nem tudja pontosan a saját felhasználónevét vagy jelszavát
  unknownErrorMessage:any
  //hogyha bepróbál jelentkezni, de nem tudja pontosan a saját felhasználónevét vagy jelszavát
  unknownErrorMessageBool = false
  //visszajelez, ha hibás a login
  loginError = false
  //bejelentkezés után token
  token: any
  loginName: any
  //bejelentkezés utáni név elmentése
  nameAfterLogin: any

  //bejelentkezés utáni jogosultság elmentése (0-nem admin, 1-admin, 2-superadmin)
  adminAccessCode:any

  constructor(private auth:AuthService, private router:Router, private localStorage: LocalStorageService){}

  visiblePassword(){
    return this.tomb[Number(this.szem)]
  }

  isNotValidSignUp(){
      return !this.email || !this.password
    }


    loginUserOnLaravel() {
      this.auth.loginWithLaravel(this.name, this.password).subscribe(
        {
          next: (res: any) => {
            if (res) {
              if (res.data && res.data.token) {
                this.auth.setLoggedUser(res.data)
                
                this.loginError = false
                this.errorNameMessage = ""
                this.errorPasswordMessage = ""
                this.mailRegError = false
                this.token = res.data.token
                this.adminAccessCode = res.data.admin
                this.nameAfterLogin = res.data.name
                this.localStorage.setItem("token", this.token)
                this.localStorage.setItem("user", this.nameAfterLogin)
                this.localStorage.setItem("admin", this.adminAccessCode)
                this.auth.saveLoginData = res.data
                // console.log(this.auth.saveLoginData)

                //a név megjelenítéséhez...

                this.auth.getUserNameToDisplay()
                this.auth.getUserToken()
                this.unknownErrorMessageBool = false

                this.router.navigate(['/home'])
              }
              else {
                this.loginError = true
                this.errorNameMessage = res.error['name']
                this.errorPasswordMessage = res.error['password']
                this.unknownErrorMessageBool = false

                console.log("hiba", res.data)
              }
            }
            else{
              console.log("nincsen resdata ",res)
              this.unknownErrorMessage ="Hibás felhasználónév/jelszó"
              this.unknownErrorMessageBool = true


            }

          },
          // console.log("Token: " ,this.token)},
          error: (res: any) => {
            this.mailRegError = true
            console.log("Hiba", res)

          }
        }
      )
    }

    logoutUserWithLaravel() {
      this.auth.logoutUserFromLaravel()
    }


}
