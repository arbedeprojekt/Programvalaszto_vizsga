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

  googleAuth(){
    this.auth.googleAuth()
    .then(()=>{
      console.log("Sikeres Google belépés!")
      this.router.navigate(['login'])
    })
    .catch(()=>console.log("Sikertelen GoogleAuth!"))
  }

  signUpMailPassword(){
    this.auth.signUpEmailPassword(this.email, this.password)
    .then(()=> this.auth.sendVerificationEmail())
    .then( ()=> this.auth.signOut() )
    .then( () =>this.router.navigate(['login']))
    // .then(
    //   ()=>this.router.navigate(['data']))
    .catch(
      (error)=>{
          this.mailRegError=true
          console.log("1")
          this.mailRegText=error
          console.log("2")

      }
    )
  }

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

            if (res.data) {
              this.erEmail = ""
              this.erName = ""
              this.erPassword = ""
              this.erEmail = res.data["email"]
              this.erName = res.data["name"]
              this.erPassword = res.data["password"]

            }
            else {
              console.log("Sikeres Bejelentkezés!")
              this.registrationSuccess = true

            }
          }
          else {

            console.log("A regisztrációban nincs res")

          }


        },
        error: (error: any) => {
          console.log("hiba", error)
        }
      }
    )

  }

  visiblePassword() {
    return this.tomb[Number(this.szem)]
  }

}
