import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  email=""
  password=""

  mailRegError=false
  mailRegText=""
  szem=false
  tomb=['password','text']

  constructor(private auth:AuthService, private router:Router){}

  visiblePassword(){
    return this.tomb[Number(this.szem)]
  }

  googleAuth(){
    this.auth.googleAuth()
    .then(()=>{
      console.log("Sikeres Google belépés!")
      this.router.navigate(['home'])
    })
    .catch(()=>console.log("Sikertelen GoogleAuth!"))
  }

  signInMailPassword(){
    this.auth.signInEmailPassword(this.email, this.password).then(
      ()=>{this.router.navigate(['home'])
            console.log("Sikeres Email belépés!!!")
      }
    ).catch(
      (error:any)=>{
          this.mailRegError=true
          this.mailRegText=error
      }
    )
  }

  isNotValidSignUp(){
      return !this.email || !this.password
    }

    sendforgotPasswordEmail(email:string){
      if(email == null){
        console.log("Az email rész üres.");
      }
      else{
        this.auth.forgotPassword(email);
      }
    }

}
