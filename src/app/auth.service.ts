import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { GoogleAuthProvider } from '@angular/fire/auth';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSub= new Subject()
  // api="https://api-53im34xaqq-uc.a.run.app/"
  api = "https://macskak-fe6d9.web.app/"
  // api="http://127.0.0.1:5001/osztalyzatokauth/us-central1/api/"
  private token:any

  constructor(private afAuth:AngularFireAuth, private router:Router, private http:HttpClient) {

    this.afAuth.authState.subscribe(
      (user:any)=>{
        if (user) {
          this.token=user._delegate.accessToken
          // user._delegate.accessToken
          this.userSub.next(user._delegate)
          console.log(user._delegate)

        }
        else{
          this.token=null
          this.userSub.next(null)
        }
      }
    )

  }

  getLoggedUser(){
    return this.userSub
  }

  getUsers(){
    console.log(this.token)
    console.log(this.api+"users-with-claims")
    const headers = new HttpHeaders().set("Authorization", this.token)
    return this.http.get(this.api+"users", {headers})
  }
  setClaims(uid:any){
    let body={
        uid:uid,
        claims:{user:true, admin:true, superAdmin:false}
      }
    const headers = new HttpHeaders().set("Authorization", this.token)
    return this.http.post(this.api+"setCustomClaims",body, {headers}).subscribe(
      {
        next: ()=>console.log("Sikeres Claims beállítás"),
        error: (err)=>console.log("Claims hiba", err)
      }
    )
  }

  getClaims(uid:any){

    const headers = new HttpHeaders().set("Authorization", this.token)
    return this.http.get(this.api+"users/"+uid+"/claims",{headers}).subscribe(
      {
        next: (claims)=>console.log("Claims", claims),
        error: (err)=>console.log("Claims lekérési hiba", err)
      }
    )
  }


  signUpEmailPassword(email:string, pass:string){
    return this.afAuth.createUserWithEmailAndPassword(email, pass)
  }

  async signInEmailPassword(email:string, pass:string){
    await this.afAuth.signInWithEmailAndPassword(email, pass)
    .then((u:any)=>{
      console.log("Belép",u.user._delegate.emailVerified)
      if (!u.user._delegate.emailVerified) {
        this.signOut()
        return new Promise((resolve, reject)=>{
          throw new Error("Email not verified!")
        })
      }
        else {
          return new Promise((resolve, reject)=>{
            resolve("Ok")
          })
        }
      })}



  sendVerificationEmail(){
    return this.afAuth.currentUser.then(
      (user)=>user?.sendEmailVerification()
    )
  }

  googleAuth(){
    return this.afAuth.signInWithPopup(new GoogleAuthProvider())
    // return this.afAuth.signInWithRedirect(new GoogleAuthProvider())
  }

  forgotPassword(email:string){
    return this.afAuth.sendPasswordResetEmail(email)
  }


  signOut(){
    // console.log("Kijeletkezés!")
    this.afAuth.signOut().then(
      ()=>this.router.navigate(['home'])
    )
  }
}
