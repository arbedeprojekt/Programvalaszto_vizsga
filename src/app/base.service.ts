import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
//import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
// import { AngularFireDatabase } from '@angular/fire/compat/database';
import { BehaviorSubject, map, Observable, Subject } from 'rxjs';
// import { ProductsListComponent } from './products-list/products-list.component';

@Injectable({
  providedIn: 'root'
})
export class BaseService {

  //IMGUrl = "http://localhost:3000/galleries/"    //galériához kapcsolódik lásd all-events.component.ts

  //Backend elérése
  backendUrl = "http://127.0.0.1:8000/api/"

  token:any
  // Ebben az objektum típusú változóban tároljuk a downloadAll metódusban megszerzett adatokat
  eventsAllSub = new BehaviorSubject<any>(null)
  myEvents =  new BehaviorSubject<any>(null)
  //Ez azért kell, hogy meg tudjam jeleníteni a comments mezőt.
  myEventsWithAllDetails =  new BehaviorSubject<any>(null)


  //Ebben fognak tárolódni a backend tags adatok
  tagsSub = new BehaviorSubject<any>(null)
  // groupsSub = new BehaviorSubject<any>(null)

  galleriesData = new BehaviorSubject<any>(null) //galériához kapcsolódik lásd all-events.component.ts


  //refData:AngularFireList<any>


  //errorüzenetek:
  //hibaüzenet új tag sikertelen felvétele esetén
  newTagErrorMessage: any
  //bool az uj tag felvétele esetén
  newTagErrorBool = false
  newTagErrorSub = new BehaviorSubject<any>(null)
  newTagErrorObs: Observable<any | null> = this.newTagErrorSub.asObservable()

  //dátum kimentése a dátumválasztóból
  dateBehaveSub = new BehaviorSubject<any>(null)
  dateObs: Observable<any | null> = this.dateBehaveSub.asObservable()

  // Ebben az objektum típusú változóban tároljuk a downloadAllUsers metódusban megszerzett adatokat
  dataUsersSub = new BehaviorSubject<any>(null)
  dataUsersObs: Observable<any | null> = this.dataUsersSub.asObservable()

  //Ebben tároljuk a kommenteket
  myExperiences = new BehaviorSubject<any>(null)


  constructor(private http: HttpClient) {
    //A termékek lap megnyitásakor lefut a downloadAll metódus
    this.downloadAll()

    //userek lekérése
    this.downloadAllUsers()
    //this.refData=db.list("adatok")

    //galériához kapcsolódik lásd all-events.component.ts
    // this.downloadGalleries()
  }



  //galériához kapcsolódik lásd all-events.component.ts
  // getAllGaleries(){
  //   return this.galleriesData
  // }

  //galériához kapcsolódik lásd all-events.component.ts
  // private downloadGalleries(){
  //   this.http.get(this.IMGUrl).subscribe(
  //     (res:any)=>{
  //       this.galleriesData.next(res)

  //     }
  //   )
  // }


  //lekéri a backendről az adatokat, majd megszűrve betölti az adatSub változóba


  //lekéri a backendről az adatokat, majd megszűrve betölti az adatSub változóba
  downloadAllUsers() {
    let token = localStorage.getItem("token")
    let headers = new HttpHeaders().set("Authorization", `Bearer ${token}`)
    if(token != null){
      this.http.get(this.backendUrl + "getusers", { headers }).subscribe(
        (res: any) => {
          this.dataUsersSub.next(res)
        }
  
      )
    }
    // this.http.get(this.backendUrl + "getusers", { headers }).subscribe(
    //   (res: any) => {
    //     this.dataUsersSub.next(res)
    //   }

    // )
    else{
      console.log("Nincs senki se bejelentkezve!")
    }
  }

  //lekéri az eseményt id alapján; ezt a részletes oldalhoz használjuk
  getEventById(id: number) {
    let token = localStorage.getItem("token")
    let headers = new HttpHeaders().set("Authorization",`Bearer ${token}`)

    return this.http.get(this.backendUrl+"/events"+`${id}`,{headers})
  }

  //Userek módosítása
  updateUser(data: any) {
    let admin = localStorage.getItem("admin")
    let token = localStorage.getItem("token")
    let headers = new HttpHeaders().set("Authorization", `Bearer ${token}`)
    // if(data.admin ==''){
    //   console.log("jogosultság megadása kötelező")
    //   return
    // }
    if (admin === "2") {
      //console.log("superadmin")
      //console.log("superadmin")
      this.http.put(this.backendUrl + "updateusers", data, { headers }).subscribe(
        (res: any) => { this.dataUsersSub = res.data }

      )
    }
    else if (admin === "1") {
      //console.log("admin")
      //console.log("admin")
      // if(data.admin =="2" || data.admin == "1"){
      //   console.log("nincs jogosultságod módosításra")
      // }
      //  else{
      //console.log("nyugodtan módosíthatod")
      //console.log("nyugodtan módosíthatod")
      this.http.put(this.backendUrl + "updateusers", data, { headers }).subscribe(
        (res: any) => {
          this.dataUsersSub = res.data
          //console.log("a művelet vége: ", res)
          //console.log("a művelet vége: ", res)
          alert("Sikeres Módosítás")
        })
      }
  }

  deleteUser(data: any) {
    let token = localStorage.getItem("token")
    let headers = new HttpHeaders().set("Authorization", `Bearer ${token}`)
    return this.http.delete(this.backendUrl + "deleteusers/" + data.id, { headers })
  }



  getAllUsers() {
    return this.dataUsersSub
  }

  //---------------------------------------------------
  //#region Események kezelése
  //visszatér az adatSub metódussal, ami a backendből kinyert adatokat tartalmazza
  getAll() {
    // let token = localStorage.getItem("token")
    // if (token) return this.myEvents
    return this.eventsAllSub
  }

  downloadAll() {
    // let token = localStorage.getItem("token")
    // let headers = new HttpHeaders().set("Authorization",`Bearer ${token}`)
    this.http.get(this.backendUrl + "events").subscribe(
      (res: any) => {
        this.eventsAllSub.next(res)
      }
    )
  }

  getAllMyEvents()
  {
    let token = localStorage.getItem("token")
    if (token) {
      //console.log("Van token és lekérem az eseméyneket!!!!")
      //console.log("Van token és lekérem az eseméyneket!!!!")
      let headers = new HttpHeaders().set("Authorization", `Bearer ${token}`)
      //console.log("headers", token)
      //console.log("headers", token)
      this.http.get(this.backendUrl + "getsubscriptions", { headers }).subscribe(
        {
        next:(res: any) =>
               {
                //console.log("Api válasz (My Events)", res)
                //console.log("Api válasz (My Events)", res)
                    let events=[]
                    let allDetails=[]
                    for (const element of res.data) {
                      events.push(element.event)
                      allDetails.push(element)
                    }
                    this.myEvents.next(events)
                    //Itt adom át az összes adatot a subscriptions táblából
                    this.myEventsWithAllDetails.next(allDetails)

                  },
      error: (err)=>{
        //console.log("HIbaaaa!!!!",err)
        //console.log("HIbaaaa!!!!",err)
      }
      }
    )
  }
  }

  subscribeEvent(data: any) {
    let body = {
      events_id: data.id,
      comment: ""
    }
    let token = localStorage.getItem("token")
    let headers = new HttpHeaders().set("Authorization", `Bearer ${token}`)

    return this.http.post(this.backendUrl +"subscribe/", body, { headers })
  }


  unsubscribeEvent(data: any) {
    let token = localStorage.getItem("token")
    let headers = new HttpHeaders().set("Authorization", `Bearer ${token}`)

    return this.http.delete(this.backendUrl + `unsubscribe/${data.id}`, { headers })
  }



  //új esemény felvétele
  newDataWeb(data: any) {
    let token = localStorage.getItem("token")
    let headers = new HttpHeaders().set("Authorization", `Bearer ${token}`)

    return this.http.post(this.backendUrl + "newevents", data, { headers })
  }

  //a már meglévő esemény módosítása
  updateDataWeb(data: any) {
    let token = localStorage.getItem("token")
    let headers = new HttpHeaders().set("Authorization", `Bearer ${token}`)
    return this.http.put(this.backendUrl + "updateevents", data, { headers })
  }

  //a törölni kívánt esemény eltávolítása
  deleteDataWeb(data: any) {
    let token = localStorage.getItem("token")
    let headers = new HttpHeaders().set("Authorization", `Bearer ${token}`)
    return this.http.delete(this.backendUrl + "deleteevents/" + data.id, { headers })
  }
  //#endregion

  //---------------------------------------------------
  //#region tegek (címkék) kezelése
  //backend tegek lekérése
  downloadAllTags() {
    let token = localStorage.getItem("token")
    let headers = new HttpHeaders().set("Authorization", `Bearer ${token}`)
    this.http.get(this.backendUrl + "tags", { headers }).subscribe(
      (res: any) => {
        this.tagsSub.next(res)
        //console.log("üzenet a tegek betöltése során a base-ben: ", res)
        //console.log("üzenet a tegek betöltése során a base-ben: ", headers)
        //console.log("üzenet a tegek betöltése során a base-ben: ", res)
        //console.log("üzenet a tegek betöltése során a base-ben: ", headers)

      }
    )
  }

  //új tag felvétele
  newTagWeb(data: any) {

    let token = localStorage.getItem("token")
    let headers = new HttpHeaders().set("Authorization", `Bearer ${token}`)

    return this.http.post(this.backendUrl + "newtags", data, { headers })
  }

  deleteTagWeb(data: any) {

    let token = localStorage.getItem("token")
    let headers = new HttpHeaders().set("Authorization", `Bearer ${token}`)
    return this.http.delete(this.backendUrl + "deletetags/" + data.id, { headers })

  }

  //a már meglévő tag módosítása
  updateTagWeb(data: any) {
    let token = localStorage.getItem("token")
    let headers = new HttpHeaders().set("Authorization", `Bearer ${token}`)
    return this.http.put(this.backendUrl + "updatetags", data, { headers })
  }
  //#endregion

  searchEvent(data: any) {
    let header = {
    }
    this.http.get(this.backendUrl + "searchevents", data)
  }

  getDateFromDatePicker(date: any) {
    this.dateBehaveSub.next(date)
  }


  //#region rendszerüzenetek (toastMessages) kezelése
  private messages = new BehaviorSubject<{text: string; type: string}[]>([]);
  messages$ = this.messages.asObservable()

  show(message: string, type:'success' | 'danger' | 'warning' | 'info' = 'success') {
    const currentMessages = this.messages.getValue()
    this.messages.next([...currentMessages, { text: message, type: `toast-${type}` }])

    // Automatikus eltüntetés 3 másodperc után
    setTimeout(() => {
      this.remove(message)
    }, 5000);
  }

  remove(message: string) {
    this.messages.next(this.messages.getValue().filter(m => m.text !== message))
  }

  updateUserExperience(data: any) {
    let body = {
      events_id: data.id,
      comment: data.comment
    }
    let token = localStorage.getItem("token")
    let headers = new HttpHeaders().set("Authorization", `Bearer ${token}`)
    //console.log("data.id = ",data.id)
    //console.log("data formája a base service-ben",body)
    //console.log("data.id = ",data.id)
    //console.log("data formája a base service-ben",body)
    return this.http.put(this.backendUrl + `updatesubscriptions/${data.id}`, body, { headers })
  }

  getMyExperience()
  {
    let token = localStorage.getItem("token")
    if (token) {
      //console.log("Van token és lekérem az eseméyneket!!!!")
      //console.log("Van token és lekérem az eseméyneket!!!!")
      let headers = new HttpHeaders().set("Authorization", `Bearer ${token}`)
      //console.log("headers", token)
      //console.log("headers", token)
      this.http.get(this.backendUrl + "getsubscriptions", { headers }).subscribe(
        {
        next:(res: any) =>
               {
                //console.log("Api válasz (My Experiences)", res)
                    let experiences=[]

                    for (const element of res.data) {
                      experiences.push({
                          eventId: element.events_id,
                          comment: element.comment
                        })

                    }
                    this.myExperiences.next(experiences)


                  },
      error: (err)=>{
        //console.log("HIbaaaa!!!!",err)
        //console.log("HIbaaaa!!!!",err)
      }
      }
    )
  }
  }

  //DezsŐ:szűrés ábc,dátum szerint
  toSort(terms:string, events:any) {
    console.log("events: ",events)
    console.log("terms: ",terms)

    // let sortedEventsArray = []
    let sortedEventsArray :any

    let eventsArray = events
    console.log("eventsArray Tartalma: ",eventsArray)
    

    if (terms === "ascByABC") {
      // console.log("ascByABC")

      sortedEventsArray = eventsArray
      sortedEventsArray = sortedEventsArray.sort(
        (a: any, b: any) => {

          // console.log("a értéke: ", a)
          // console.log("b értéke: ", b)
          return a.name.localeCompare(b.name)
        }
      )

      //a keresett tartalmak szűréséhez
      // if (this.isSearch == true) {
      //   this.searchResults = this.searchResults.sort(
      //     (a: any, b: any) => {

            // console.log("a értéke: ", a)
            // console.log("b értéke: ", b)
      //       return a.name.localeCompare(b.name)
      //     }
      //   )
      // }
    }

    else if (terms === "descByABC") {
      // console.log("descByABC")
      sortedEventsArray = eventsArray
      console.log("sortedEventsArray:",sortedEventsArray)
      sortedEventsArray = sortedEventsArray.sort(
        (a: any, b: any) => {

          // console.log("a értéke: ", a)
          // console.log("b értéke: ", b)
          return b.name.localeCompare(a.name)
        }
      )

      //a keresett tartalmak szűréséhez

      // if (this.isSearch == true) {
      //   this.searchResults = this.searchResults.sort(
      //     (a: any, b: any) => {

            // console.log("a értéke: ", a)
            // console.log("b értéke: ", b)
      //       return b.name.localeCompare(a.name)
      //     }
      //   )
      // }
    }

    else if (terms === "ascByDate") {
      // console.log("ascByDate")
      sortedEventsArray = eventsArray
      sortedEventsArray = sortedEventsArray.sort(
        (a: any, b: any) => {

          // console.log("a értéke: ", a)
          // console.log("b értéke: ", b)
          return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
        }
      )

      //a keresett tartalmak szűréséhez

      // if (this.isSearch == true) {
      //   this.searchResults = this.searchResults.sort(
      //     (a: any, b: any) => {

            // console.log("a értéke: ", a)
            // console.log("b értéke: ", b)
      //       return new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
      //     }
      //   )
      // }
    }

    else if (terms === "descByDate") {
      // console.log("descByDate")
      sortedEventsArray = eventsArray
      sortedEventsArray = sortedEventsArray.sort(
        (a: any, b: any) => {

          return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
        }
      )

      //a keresett tartalmak szűréséhez

      // if (this.isSearch == true) {
      //   this.searchResults = this.searchResults.sort(
      //     (a: any, b: any) => {

            // console.log("a értéke: ", a)
            // console.log("b értéke: ", b)
      //       return new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
      //     }
      //   )
      // }

    }

    // console.log("szortírozás után : ", sortedEventsArray)
    // if (this.searchControl.value === '') {
    //   this.searchResults = []
    // }
  }

  
  search(query: string):Observable<any> {
    let res:any
    let token = localStorage.getItem("token")
    let headers = new HttpHeaders().set("Authorization", `Bearer ${token}`)
    console.log(".base.search")
    // if (!query.trim()) {
    //   return new Observable(observer => observer.next([])); // Ha üres a kereső, ne küldjön kérést
    // }
    return this.http.get(`${this.backendUrl}searchevents/?query=${query}`, { headers }).pipe(
      map((response: any) => {
        res = response.data
        console.log("res",res)
        return res 
      })


      // distinctUntilChanged()
    )
    
    // GET kérés küldése a backendnek
  }

}
