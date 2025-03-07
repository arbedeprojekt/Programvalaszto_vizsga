import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Input, input } from '@angular/core';
import { LocalStorageService } from '../local-storage.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'app-events-subscribed',
  templateUrl: './events-subscribed.component.html',
  styleUrl: './events-subscribed.component.css'
})
export class EventsSubscribedComponent {

  @Input() data: any

  //backend elérése
  backendUrl = "http://127.0.0.1:8000/api/"

  // A táblázat megjelenítéséhez
  oszlopok = ["events_id", "comment"]
  //A fejléc magyar megjelenítéséhez
  columnName = ["Esemény azonosítója", "Kommentek"]


  cikkek:any
  // cikkekObs: Observable<any | null> = this.cikkek.asObservable()

  constructor(private http: HttpClient, localStorage: LocalStorageService) {
    // let token = localStorage.getItem("token")
    // let headers = new HttpHeaders().set("Authorization", `Bearer ${token}`)
    // this.http.get(this.backendUrl + "getsubscriptions", { headers }).subscribe(
    //   {
    //     next: (res: any) => {
    //       this.cikkek = res
    //       console.log("siker", res)
    //     },
    //     error: (error: any) => {
    //       console.log("hiba", error)
    //     }
    //   }
    // )
    this.getSubscribeEvents()
  }

  subscribeEvent(data: any) {
    let token = localStorage.getItem("token")
    let headers = new HttpHeaders().set("Authorization", `Bearer ${token}`)
    let body = {
      events_id: data.id,
      comment: ""
    }
    this.http.post(this.backendUrl, body, { headers }).subscribe(
      {
        next: (res: any) => {
          // console.log("új esemény felvétele: ",res)
          if (res.success == false) {
            console.log("hibaüzenetek: ", res.error)

          }
          //ahoz hogy az oldal újrafrissüljön.
          else {
            console.log("Sikeres új esemény felvétel: ", res)

            alert("Sikeres felíratkozás!")

          }

        },
        error: (error: any) => {
          // console.log("Valami hiba történt az új esemény felvétele során: ",error)
        }
      }
    )
    data = {}
  }

  //leíratkozás az eseményről
  unsubscribe(data: any) {
    let token = localStorage.getItem("token")
    let headers = new HttpHeaders().set("Authorization", `Bearer ${token}`)

    this.http.delete(this.backendUrl + `unsubscribe/${data.events_id}`, { headers }).subscribe(
      {
        next: (res: any) => {
          console.log("sikeres leíratkozás: ", res)
          window.location.reload();
          alert("Sikeresen leíratkoztál!")




        },
        error: (error: any) => {
          console.log("Valami hiba: ", error)
          alert("Nem vagy még felíratkozva az adott eseményre!")
        }
      }
    )

  }

  getSubscribeEvents(){
    let token = localStorage.getItem("token")
    let headers = new HttpHeaders().set("Authorization", `Bearer ${token}`)
    this.http.get(this.backendUrl + "getsubscriptions", { headers }).subscribe(
      {
        next: (res: any) => {
          this.cikkek = res
          console.log("siker", res)
        },
        error: (error: any) => {
          console.log("hiba", error)
        }
      }
    )
  }
}
