import { Component } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent {


  users:any
  constructor(private auth:AuthService){
    this.auth.getUsers().subscribe(
      (users)=>this.users=users
    )
  }

  //itt fogom tudni beállítani a felhasználónak az admin jogot
  addAdmin(uid:any){
    this.auth.setClaims(uid)
  }

  //itt tudom lekérdezni, hogy a felhasználónak milyen jogai vannak
  getCleims(uid:any){
    this.auth.getClaims(uid)
  }

}
