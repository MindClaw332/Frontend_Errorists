
import { Component, HostListener, inject, signal } from '@angular/core'
import { LoginComponent } from './login/login.component';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { LoginService } from './login.service';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],

  templateUrl: './app.component.html',
})
export class AppComponent {
  // variables we want to check on for routing purposes
  title = 'frontend_erorrists';
  auth = inject(LoginService);
  user = this.auth.currentuser();
  loggedin = this.auth.isloggedin();
  manualLogIn = signal(false);
  isMenuOpen = signal(false);

  toggleMenu() {
    this.isMenuOpen.set(!this.isMenuOpen());
    console.log(this.isMenuOpen())
  }


  //commented out tests
  constructor() {
    if (window.sessionStorage.getItem("isLoggedIn") === 'true'){
      this.manualLogIn.set(true);
    }
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