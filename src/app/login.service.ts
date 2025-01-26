import { Injectable, signal } from '@angular/core';
import { Logindata } from './interfaces/logindata';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})


export class LoginService {
  // signals to keep check on state in other components
  isloggedin = signal<boolean>(false);
  currentUser = signal<any>(null);
  private eventSource = new BehaviorSubject<boolean>(false);
  signal$ = this.eventSource.asObservable();
  // login url
  private apiurl: string = 'http://127.0.0.1:8000/api/';
  constructor() { }

  sendSignal(status:boolean){
    this.eventSource.next(status)
  }
  // login function which you pass username/email and password parameters
  async login(username: string, password: string) {
    // turn parameters into variable
    const logindata = {
      "email": username,
      "password": password,
    };
    try {
      // make post request
      const response = await fetch(`${this.apiurl}login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(logindata),
      });

      const result = await response.json();
      // if the response is not an error code set the currentuser signal to the returned user
      if (response.ok) {
        const userdata = {
          "user_id": result.user_id,
          "role_id": result.role_id,
        }
        sessionStorage.setItem("user", JSON.stringify(userdata));
        sessionStorage.setItem("isLoggedIn", "true");
        this.sendSignal(true);
      }
      return result;
    }
    // if something goes wrong thow me an error
    catch (error) {
      console.error("Error making login request", error);
      throw error;
    }
  }

  async registration(firstname: string, lastname: string, email: string, password: string, role_id: number, class_id: number | null) {
    const userdata = {
      "firstname": firstname,
      "lastname": lastname,
      "email": email,
      "password": password,
      "role_id": role_id,
      "class_id": class_id
    }
    try {
      const response = await fetch(`${this.apiurl}register`, {
        method: "POST",
        headers:{
          "content-type":"application/json",
        },
        body: JSON.stringify(userdata),
      })
      const result = await response.json();
      return result;
      
    } catch (error) {
      console.error('error registering user', error);
      throw error;
    }
  }

  logout(){
    sessionStorage.clear();
    this.isloggedin.set(false);
    console.log(this.isloggedin())
  }
}
