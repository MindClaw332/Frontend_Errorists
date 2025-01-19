import { Injectable, signal } from '@angular/core';
import { Logindata } from './interfaces/logindata';
@Injectable({
  providedIn: 'root'
})


export class LoginService {
  // signals to keep check on state in other components
  isloggedin = signal<boolean>(false);
  currentuser = signal<any>(null);
// login url
  private apiurl: string = 'http://127.0.0.1:8000/api/login';
  constructor() { }
// login function which you pass username/email and password parameters
  async login(username: string, password: string) {
    // turn parameters into variable
    const logindata = {
      "email": username,
      "password": password
    };
    try {
      // make post request
      const response = await fetch(this.apiurl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(logindata),
      });

      const result = await response.json();
      console.log(result, 'result na fetch');
      // if the response is not an error code set the currentuser signal to the returned user
      if (response.ok){
        console.log('response is ok')
        this.currentuser.set({
          "user_id": result.user_id,
          "role_id": result.role_id
        })
        // set the loggedin signal to true
        this.isloggedin.set(true);
      }
      console.log(this.currentuser())
      return result;
    }
    // if something goes wrong thow me an error
    catch (error) {
      console.error("Error making login request", error);
      throw error;
    }
  }
}
