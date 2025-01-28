import { Injectable, computed } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { LoginService } from '../shared/login.service';

@Injectable({
  providedIn: 'root'
})
export class teacherGuard implements CanActivate {
  constructor() { }
  
  // just check if we have a user and they are logged in otherwise redirect to login page
  canActivate(): boolean {
    const user = JSON.parse(sessionStorage.getItem('user')!)
    if(user.role_id === 2){
      return true;
    }
    return false;
  }
}
