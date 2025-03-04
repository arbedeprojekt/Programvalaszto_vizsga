import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
// import { AngularFireDatabase } from '@angular/fire/compat/database';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
// import { ProductsListComponent } from './products-list/products-list.component';

@Injectable({
  providedIn: 'root'
})
export class BaseService {
  // A fake API elérési útja
  url="http://localhost:3000/esemenyek/"
  //url="http://localhost:8000/api/events"
  IMGUrl="http://localhost:3000/galleries/"    //galériához kapcsolódik lásd all-events.component.ts

  //Backend elérése
  backendUrl = "http://127.0.0.1:8000/api/"


  // Ebben az objektum típusú változóban tároljuk a downloadAll metódusban megszerzett adatokat
  adatSub=new BehaviorSubject<any>(null)

  //Ebben fognak tárolódni a backend tags adatok
  tagsSub = new BehaviorSubject<any>(null)

  galleriesData=new BehaviorSubject<any>(null) //galériához kapcsolódik lásd all-events.component.ts

  //refData:AngularFireList<any>


  //errorüzenetek:
  //hibaüzenet új teg sikertelen felvétele esetén
  newTagErrorMessage: any
  //bool az uj teg felvétele esetén
  newTagErrorBool = false
  newTagErrorSub = new BehaviorSubject<any>(null)
  newTagErrorObs: Observable<any | null> = this.newTagErrorSub.asObservable()


  constructor(private http:HttpClient,private db:AngularFireDatabase) {
    //A termékek lap megnyitásakor lefut a downloadAll metódus
    this.downloadAll()
    //this.refData=db.list("adatok")

    //galériához kapcsolódik lásd all-events.component.ts
    this.downloadGalleries()
  }

  //visszatér az adatSub metódussal, ami a tanár webapijából kinyert adatokat tartalmazza
  getAll(){
    return this.adatSub
  }

  //galériához kapcsolódik lásd all-events.component.ts
  getAllGaleries(){
    return this.galleriesData
  }

  //galériához kapcsolódik lásd all-events.component.ts
  private downloadGalleries(){
    this.http.get(this.IMGUrl).subscribe(
      (res:any)=>{
        this.galleriesData.next(res)

      }
    )
  }


  //lekéri a tanár webapijából az adatokat, majd megszűrve betölti az adatSub változóba
  // private downloadAll(){
  //   this.http.get(this.url).subscribe(
  //     (res:any)=>{
  //         this.adatSub.next(res)}
  //   )
  // }
   //lekéri a backendről az adatokat, majd megszűrve betölti az adatSub változóba
  downloadAll(){
    // let token = localStorage.getItem("token")
    // let headers = new HttpHeaders().set("Authorization",`Bearer ${token}`)
    this.http.get(this.backendUrl+"events").subscribe(
      (res:any)=>{
          this.adatSub.next(res)}

    )
  }

   //backend adatok lekérése
   downloadAllTags() {
    let token = localStorage.getItem("token")
    let headers = new HttpHeaders().set("Authorization",`Bearer ${token}`)
    this.http.get(this.backendUrl + "tags", {headers}).subscribe(
      (res: any) => {
        this.tagsSub.next(res)
        console.log("üzenet a tegek betöltése során a base-ben: ",res)
        console.log("üzenet a tegek betöltése során a base-ben: ",headers)

      }
    )
  }

  //új cikk felvétele
  newDataWeb(data:any){
    let token = localStorage.getItem("token")
    let headers = new HttpHeaders().set("Authorization",`Bearer ${token}`)

    return this.http.post(this.backendUrl+"newevents",data,{headers})
  }

  //a már meglévő cikk módosítása
  updateDataWeb(data:any){
    let token = localStorage.getItem("token")
    let headers = new HttpHeaders().set("Authorization",`Bearer ${token}`)
    return this.http.put(this.backendUrl+"updateevents",data,{headers})
  }

  //a törölni kívánt cikk eltávolítása
  deleteDataWeb(data:any){
    let token = localStorage.getItem("token")
    let headers = new HttpHeaders().set("Authorization",`Bearer ${token}`)
    return this.http.delete(this.backendUrl+"deleteevents/"+data.id,{headers})
  }

  //új tag felvétele
  newTagWeb(data: any) {

    let token = localStorage.getItem("token")
    let headers = new HttpHeaders().set("Authorization",`Bearer ${token}`)

    return this.http.post(this.backendUrl + "newtags", data,{headers})
  }

  deleteTagWeb(data: any) {

    let token = localStorage.getItem("token")
    let headers = new HttpHeaders().set("Authorization",`Bearer ${token}`)
    return this.http.delete(this.backendUrl + "deletetags/"+data.id,{headers})

  }

  //a már meglévő cikk módosítása
  updateTagWeb(data: any) {
    let token = localStorage.getItem("token")
    let headers = new HttpHeaders().set("Authorization",`Bearer ${token}`)
    return this.http.put(this.backendUrl + "updatetags",data ,{headers})
  }


  // getDatas(){
  //   return this.refData
  // }
  // pushData(body:any){
  //   // let body ={name:"Jáger Attila", grade:4}
  //   this.refData.push(body)
  // }

  // deleteData(body:any){
  //   this.refData.remove(body.key)
  // }

  // updateData(body:any){
  //   let key = body.key
  //   delete body.key
  //   this.refData.update(key, body)
  // }
}
