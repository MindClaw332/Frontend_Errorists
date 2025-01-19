import { Injectable, signal } from '@angular/core';
import { Logindata } from './interfaces/logindata';
@Injectable({
  providedIn: 'root'
})


export class LoginService {
  isloggedin = signal<boolean>(false);
  currentuser = signal<any>(null);

  private apiurl: string = 'http://127.0.0.1:8000/api/login';
  constructor() { }

  async login(username: string, password: string) {
    const logindata = {
      "email": username,
      "password": password
    };
    try {
      const response = await fetch(this.apiurl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(logindata),
      });

      const result = await response.json();
      console.log(result, 'result na fetch');
      if (response.ok){
        console.log('response is ok')
        this.currentuser.set({
          "user_id": result.user_id,
          "role_id": result.role_id
        })
        this.isloggedin.set(true);
      }
      console.log(this.currentuser())
      return result;
    }
    
    catch (error) {
      console.error("Error making login request", error);
      throw error;
    }

  }
}
