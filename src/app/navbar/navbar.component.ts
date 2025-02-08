import { Component } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  // Ebben tárolom el a user adatait
  user:any
  constructor(public auth:AuthService){
    this.auth.getLoggedUser().subscribe(
      (u)=>this.user=u
    )

  }

}
