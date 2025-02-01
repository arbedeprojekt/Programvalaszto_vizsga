import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
// import { AngularFireDatabase } from '@angular/fire/compat/database';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
// import { ProductsListComponent } from './products-list/products-list.component';

@Injectable({
  providedIn: 'root'
})
export class BaseService {
  // A tanár webapijának elérési útja
  url="http://localhost:3000/esemenyek/"

  // Ebben az objektum típusú változóban tároljuk a downloadAll metódusban megszerzett adatokat
  adatSub=new BehaviorSubject<any>(null)



  constructor(private http:HttpClient) {
    //A termékek lap megnyitásakor lefut a downloadAll metódus
    this.downloadAll()
  }

  //visszatér az adatSub metódussal, ami a tanár webapijából kinyert adatokat tartalmazza
  getAll(){
    return this.adatSub
  }

  //lekéri a tanár webapijából az adatokat, majd megszűrve betölti az adatSub változóba
  private downloadAll(){
    this.http.get(this.url).subscribe(
      (res:any)=>{
          // let adattomb=[]
          // for (const key in res) {
          //   adattomb.push({id:key, ...res[key]})
          //   }
          // this.adatSub.next(adattomb)
          this.adatSub.next(res)}


    )
  }

  //új cikk felvétele
  newData(data:any){
    this.http.post(this.url,data).forEach(
      ()=>this.downloadAll()
    )
  }

  //a már meglévő cikk módosítása
  updateData(data:any){
    this.http.put(this.url+data.id,data).forEach(
      ()=>this.downloadAll()
    )
  }

  //a törölni kívánt cikk eltávolítása
  deleteData(data:any){
    this.http.delete(this.url+data.id).forEach(
      ()=>this.downloadAll()
    )
  }
}