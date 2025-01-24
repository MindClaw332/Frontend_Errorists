import { Injectable, computed } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { LoginService } from '../login.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private auth: LoginService, private router: Router) { }
// just check if we have a user and they are logged in otherwise redirect to login page
  canActivate(): boolean {
    const loggedIn = sessionStorage.getItem("isLoggedIn");

    if (!this.auth.currentuser() || !loggedIn) {
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }
}
