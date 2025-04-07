import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css'
})
export class RegistrationComponent {

  name = ""
  email=""
  password=""
  confirmPassword=""
  mailRegError=false
  mailRegText=""

  registrationSuccess = false
  erEmail: any
  erName: any
  erPassword: any

  //Dezső: ez a változó ahhoz kell, hogy a mezőnél lévő szem ikonra kattintva a jelszó látható legyen
  toSwitchPasswordInputTypeDynamic = ['password', 'text']
  eyeIconToShowPassword = false

  constructor(private auth:AuthService, private router:Router){}


  isNotValidSignUp(){
      return !this.email || !this.password || !this.confirmPassword || (this.password!==this.confirmPassword)
  }


  //user regisztrációja a backend-en
  userRegistration() {

    this.auth.registrationUserOnlaravel(this.name, this.email, this.password, this.confirmPassword)

    this.auth.saveBackendMessage.subscribe(
      {
        next: (res: any) => {
          // console.log("új esemény felvétele: ",res)
          if (res.error) {
            console.log("hibaüzenetek: ", res.error)
            this.erEmail = ""
            this.erName = ""
            this.erPassword = ""
            this.erEmail = res.error["email"]
            this.erName = res.error["name"]
            this.erPassword = res.error["password"]
            this.auth.showToast( "Hiba történt!", "danger")
          }
          else {
            //console.log("Sikeres új esemény felvétel: ", res)
            this.auth.showToast(res.message || "Sikeres regisztráció!", "success")
            this.registrationSuccess = true

            //Ha az e-mail küldés sikertelen, arról külön visszajelzést adunk
            // if (res.email_error) {
            //   this.auth.showToast("Regisztráció sikeres, de az e-mail küldés sikertelen!", "warning");
            //   console.error("E-mail küldési hiba: ", res.email_error);
            // }
          }
        },
        error: (error: any) => {
          console.log("Valami hiba történt az új esemény felvétele során: ",error)
          this.auth.showToast("Hálózati hiba vagy szerverhiba történt!", "danger")
        }
      }
    )
  }

  visiblePassword() {
    return this.toSwitchPasswordInputTypeDynamic[Number(this.eyeIconToShowPassword)]
  }

}
