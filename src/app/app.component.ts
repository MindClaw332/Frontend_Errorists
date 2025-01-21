

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
  
  //commented out tests
  constructor(){
    // this.auth.login('lambik@test.com', 'lambikske')
    // this.logintest();
   }

  //  async logintest(){
  //   await this.auth.login('lambik@tes.com', 'lambikske');
  //   console.log(this.auth.isloggedin())
  //   console.log(this.user, 'appcomponent')
  //  }
}