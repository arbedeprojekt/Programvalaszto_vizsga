import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { GoogleAuthProvider } from '@angular/fire/auth';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSub= new BehaviorSubject <any>(null)

  api = "https://macskak-fe6d9.web.app/"

  //backend az autentikáció miatt
  backendUrl = "http://127.0.0.1:8000/api/"

  //Ezt a Regisztrációnál fellépő hibák tárolására használom
  saveBackendMessage = new BehaviorSubject<any>(null)
  //A felhasználó bejelentkezésénél használom
  public saveUserNameBehaveSub = new BehaviorSubject <any>(null)
  public saveUserTokenBehaveSub = new BehaviorSubject <any>(null)
  public saveUserAdminBehaveSub = new BehaviorSubject <any>(null)

  public userName:Observable<any|null> = this.saveUserNameBehaveSub.asObservable()
  public userToken:Observable<any|null> = this.saveUserTokenBehaveSub.asObservable()
  public userAdminAccessCode:Observable<any|null> = this.saveUserAdminBehaveSub.asObservable()
  saveLoginData = new BehaviorSubject<any>(null)



  private token:any

  constructor(private afAuth:AngularFireAuth, private router:Router, private http:HttpClient,
    private localStorage:LocalStorageService) {

    this.afAuth.authState.subscribe(
      (user:any)=>{
        if (user) {
          this.token=user._delegate.accessToken

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

  registrationUserOnlaravel(nameArg : string, emailArg :string, passwordArg :string
    , confirm_passwordArg:string
  ){
    let body ={
      name:nameArg,
      email:emailArg,
      password:passwordArg,
      confirm_password:confirm_passwordArg
    }
    this.http.post(this.backendUrl+"register",body).subscribe(
      {
        next: (res:any)=> {

          // console.log("res: ",res['success'])
          if(res['success']){
            // console.log("Token: ",this.token)
            console.log("res: ",res)
            this.saveBackendMessage.next(res)

          }
          else{
            // console.log("hiba",res)
            if(res.error){
              this.saveBackendMessage.next(res)
            }
            else{
              console.log("másik",res.data)
              this.saveBackendMessage.next(res)

            }
            // console.log("res: ",res)


          }


        },
        error:(res) =>{
            // console.log("Hiba",res)
            // this.saveBackendMessage.next(res)
        }
      }
    )
    // this.router.navigate(['registration'])


  }

  loginWithLaravel(nameArg:string, passwordArg:string){
    let body={
      name:nameArg,
      password:passwordArg,

    }
    return this.http.post("http://localhost:8000/api/login",body)

  }

  getUserNameToDisplay(){
    this.saveUserNameBehaveSub.next(this.localStorage.getItem("user"))
  }

  getUserToken(){
    this.saveUserTokenBehaveSub.next(this.localStorage.getItem("token"))
  }

  getUserAdminAccessCode(){
    this.saveUserAdminBehaveSub.next(this.localStorage.getItem("admin"))
  }

  //elfeledtetem a felhasználó nevét és törlöm a localstorage-ból is.
  logoutUserFromLaravel(){
    let token = localStorage.getItem("token")

    // let headers = new HttpHeaders().set("Authorization",`Bearer ${token}`)
    let headers = new HttpHeaders({
      "Authorization": `Bearer ${token}`,
      "Accept": "application/json"
  });

    this.http.post(this.backendUrl + "logout",{},{headers:headers}).subscribe(
      {
        next: (res:any)=>{
          console.log("headers: ",headers)
        },
        error: (error:any) => {
          console.log("hiba: ", headers)
        }
      }

    )
    this.saveUserNameBehaveSub.next(null)
    this.saveUserAdminBehaveSub.next(null)
    this.saveUserTokenBehaveSub.next(null)
    this.localStorage.clear()

  }
}
