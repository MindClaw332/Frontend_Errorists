import { Injectable, OnInit, signal, WritableSignal } from '@angular/core';
import { User } from '../interfaces/user'

@Injectable({
  providedIn: 'root'
})
export class StudentdataService {

  private apiurl: string = 'http://127.0.0.1:8000/api/users';
  users = signal<User[]>([]);
  specificstudent = signal<User | null>(null);

  constructor() {
    // this.loadStudent(1);
  }

  async loadUsers() {
    try {
      const response = await fetch(this.apiurl);
      const users = await response.json();
      if (users) {
        this.users.set(users);
      }
    } catch (error) {
      console.log('error making request', error);
      throw error;
    }
  }
  async loadStudent(id: number): Promise<any> {
    try {
      const response = await fetch(`${this.apiurl}/${id}`);
      // console.log(response);
      const user = await response.json();
      // console.log(user, 'fethresult')
      // user.data = user
      this.specificstudent.set(user);
      console.log(this.specificstudent(), 'dit hoort een user te zijn')
      return this.specificstudent;
    } catch (error) {
      console.log('error making request', error);
      throw error;
    }
  }
}
