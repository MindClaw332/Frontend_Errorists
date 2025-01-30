import { Injectable, computed } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { LoginService } from '../shared/login.service';

@Injectable({
  providedIn: 'root'
})
export class teacherGuard implements CanActivate {
  constructor() { }
  
  // get the user from the sessionstorage if they are a teacher they can go here otherwise they cant
  canActivate(): boolean {
    const user = JSON.parse(sessionStorage.getItem('user')!)
    if(user.role_id === 2){
      return true;
    }
    return false;
  }
}
