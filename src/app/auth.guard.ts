import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {
  
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const user = localStorage.getItem('token'); // Ellenőrizzük, hogy van-e token

    if (user) {
      return true; // Ha van token, engedjük a hozzáférést
    } else {
      this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } }); // Ha nincs bejelentkezve, loginra irányít
      return false;
    }
  }

};
