import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LocalStorageService } from './local-storage.service';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSub = new BehaviorSubject<any>(null)

  //Backend elérése
  backendUrl = "http://127.0.0.1:8000/api/"


  //Ezt a Regisztrációnál fellépő hibák tárolására használom
  saveBackendMessage = new BehaviorSubject<any>(null)
  //A felhasználó bejelentkezésénél használom
  public saveUserNameBehaveSub = new BehaviorSubject<any>(null)
  public saveUserTokenBehaveSub = new BehaviorSubject<any>(null)
  public saveUserAdminBehaveSub = new BehaviorSubject<any>(null)

  
  // saveLoginData = new BehaviorSubject<any>(null)

  //#region rendszerüzenetek (toastMessages) kezelése
  private messages = new BehaviorSubject<{ text: string; type: string }[]>([])
  messages$ = this.messages.asObservable()

  private token: any

  constructor(private router: Router, private http: HttpClient, private base: BaseService,
    private localStorage: LocalStorageService) { }


  //#region rendszerüzenetek (toastMessages) kezelése

  showToast(message: string, type: 'success' | 'danger' | 'warning' | 'info' = 'success') {
    const currentMessages = this.messages.getValue()
    this.messages.next([...currentMessages, { text: message, type: `toast-${type}` }])

    // Automatikus eltüntetés 3 másodperc után
    setTimeout(() => {
      this.removeToast(message)
    }, 5000)
  }

  removeToast(message: string) {
    this.messages.next(this.messages.getValue().filter(m => m.text !== message))
  }


  getLoggedUser() {
    return this.userSub
  }

  setLoggedUser(user: any) {
    this.userSub.next(user)
  }

  // getUsers() {

  //   const headers = new HttpHeaders().set("Authorization", this.token)
  //   return this.http.get(this.base.backendUrl + "users", { headers })
  // }

  getUsers() {
    const token = this.localStorage.getItem("token") // Mindig a localStorage-ből vesszük ki

    if (!token) {
      console.warn("Token nem található!")
      return
    }

    const headers = new HttpHeaders().set("Authorization", `Bearer ${token}`)
    return this.http.get(this.backendUrl + "users", { headers })
  }

  registrationUserOnlaravel(nameArg: string, emailArg: string, passwordArg: string
    , confirm_passwordArg: string
  ) {
    let body = {
      name: nameArg,
      email: emailArg,
      password: passwordArg,
      confirm_password: confirm_passwordArg
    }
    this.http.post(this.backendUrl + "register", body).subscribe(
      {
        next: (res: any) => {

          // console.log("res: ",res['success'])
          if (res['success']) {
            // console.log("Token: ",this.token)
            //console.log("res: ", res)
            this.saveBackendMessage.next(res)   //sikeres regisztráció üzenet; Beának kell a felugró ablakhoz
          }
          else {
            // console.log("hiba",res)
            if (res.error) {
              this.saveBackendMessage.next(res)  //sikertelen regisztrációs üzenetek; Beának kell a felugró ablakhoz
            }
            else {
              //console.log("másik", res.data)
              this.saveBackendMessage.next(res)
            }
            // console.log("res: ",res)
          }
        },
        error: (res) => {
          // console.log("Hiba",res)
          this.saveBackendMessage.next(res)
        }
      }
    )
    // this.router.navigate(['registration'])
  }


  loginWithLaravel(nameArg: string, passwordArg: string) {
    let body = {
      name: nameArg,
      password: passwordArg,
    }
    return this.http.post(this.backendUrl + "login", body)
  }

 

  

  //elfeledtetem a felhasználó nevét és törlöm a localstorage-ból is.
  logoutUserFromLaravel() {
    let token = localStorage.getItem("token")

    // let headers = new HttpHeaders().set("Authorization",`Bearer ${token}`)
    let headers = new HttpHeaders({
      "Authorization": `Bearer ${token}`,
      "Accept": "application/json"
    });

    this.http.post(this.base.backendUrl + "logout", {}, { headers: headers }).subscribe(
      {
        next: (res: any) => {
          //console.log("headers: ", headers)
        },
        error: (error: any) => {
          //console.log("hiba: ", headers)
        }
      }

    )
    this.saveUserNameBehaveSub.next(null)
    this.saveUserAdminBehaveSub.next(null)
    this.saveUserTokenBehaveSub.next(null)

    this.userSub.next(null)

    this.localStorage.clear()

  }
}
