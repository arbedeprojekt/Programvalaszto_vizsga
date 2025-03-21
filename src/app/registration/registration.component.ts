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

  //A jelszónál a password-nél a betűk megjelenítéséhez
  tomb = ['password', 'text']
  szem = false

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

          if (res) {

            if (res.error) {
              this.erEmail = ""
              this.erName = ""
              this.erPassword = ""
              this.erEmail = res.error["email"]
              this.erName = res.error["name"]
              this.erPassword = res.error["password"]

            }
            else {
              //console.log("Sikeres Bejelentkezés!")
              this.registrationSuccess = true

            }
          }
          else {

            //console.log("A regisztrációban nincs res")

          }


        },
        error: (error: any) => {
          //console.log("hiba", error)
        }
      }
    )

  }

  visiblePassword() {
    return this.tomb[Number(this.szem)]
  }

}
