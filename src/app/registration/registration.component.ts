import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css'
})
export class RegistrationComponent {

  email=""
  password=""
  confirmPassword=""
  mailRegError=false
  mailRegText=""

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

}
