import { HttpClient } from '@angular/common/http';
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
  IMGUrl="http://localhost:3000/galleries/"    //galériához kapcsolódik lásd all-events.component.ts

  // Ebben az objektum típusú változóban tároljuk a downloadAll metódusban megszerzett adatokat
  adatSub=new BehaviorSubject<any>(null)
  
  galleriesData=new BehaviorSubject<any>(null) //galériához kapcsolódik lásd all-events.component.ts

  //refData:AngularFireList<any>


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
  private downloadAll(){
    this.http.get(this.url).subscribe(
      (res:any)=>{
          this.adatSub.next(res)}
    )
  }

  //új cikk felvétele
  newDataWeb(data:any){
    this.http.post(this.url,data).forEach(
      ()=>this.downloadAll()
    )
  }

  //a már meglévő cikk módosítása
  updateDataWeb(data:any){
    this.http.put(this.url+data.id,data).forEach(
      ()=>this.downloadAll()
    )
  }

  //a törölni kívánt cikk eltávolítása
  deleteDataWeb(data:any){
    this.http.delete(this.url+data.id).forEach(
      ()=>this.downloadAll()
    )
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
