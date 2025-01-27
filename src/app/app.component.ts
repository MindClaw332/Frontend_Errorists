
import { Component, HostListener, inject, OnInit, signal } from '@angular/core'
import { LoginComponent } from './login/login.component';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { LoginService } from './shared/login.service';
import { JsonPipe } from '@angular/common';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],

  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit{
  // variables we want to check on for routing purposes
  title = 'frontend_erorrists';
  auth = inject(LoginService);
  loggedin = this.auth.isloggedin();
  manualLogIn = signal(false);
  isMenuOpen = signal(false);
  manualUser = signal<any>(null);
  router = inject(Router)

  toggleMenu() {
    this.isMenuOpen.set(!this.isMenuOpen());
    console.log(this.isMenuOpen())
  }

  ngOnInit(): void {
    this.auth.signal$.subscribe((status) => {
      if (status){
        console.log('signal triggered')
        this.getData();
      }
    });
    this.getData();
  }

  getData(){
    console.log("getting data")
    if (window.sessionStorage.getItem("isLoggedIn") === 'true'){
      this.manualLogIn.set(true);
      console.log(this.manualLogIn(), "this.manualLogIn")
    }
    if (window.sessionStorage.getItem("user")){
      this.manualUser.set(JSON.parse(window.sessionStorage.getItem("user")!));
      console.log(this.manualUser(), 'manualuser')
    }
  }
  //commented out tests
  constructor() {
    // if (window.sessionStorage.getItem("isLoggedIn") === 'true'){
    //   this.manualLogIn.set(true);
    // }
    // if (JSON.parse(window.sessionStorage.getItem("user")!)){
    //   this.manualUser.set()
    // }
  }
  redirectToGroups(){
    const user = JSON.parse(window.sessionStorage.getItem("user")!)
    this.router.navigate([`/groups/${user.user_id}`])
  }
  logout(){
    this.auth.logout();
    this.manualLogIn.set(false);
    this.isMenuOpen.set(false);
  }
  //  async logintest(){
  //   await this.auth.login('lambik@tes.com', 'lambikske');
  //   console.log(this.auth.isloggedin())
  //   console.log(this.user, 'appcomponent')
  //  }
}