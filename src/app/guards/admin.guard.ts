import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { LoginService } from '../shared/login.service';

@Injectable({
  providedIn: 'root'
})
export class adminGuard implements CanActivate {
  constructor() { }
  
  // check sessionstorage for the user if they are an admin let them through
  canActivate(): boolean {
    const user = JSON.parse(sessionStorage.getItem('user')!)
    if(user.role_id === 3){
      return true;
    }
    return false;
  }
}
