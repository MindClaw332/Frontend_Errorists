import { Injectable, signal } from '@angular/core';
import {User} from '../interfaces/user'

@Injectable({
  providedIn: 'root'
})
export class StudentdataService {

  private apiurl: string = 'http://127.0.0.1:8000/api/users';
  users = signal<User[]>([]);

  constructor(){}

  async loadUsers(){
    const response = await fetch(this.apiurl);
    const users = await response.json();
    if (users){
      this.users.set(users);
    }
  }
}
