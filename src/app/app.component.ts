import { Component, inject } from '@angular/core'
import { LoginComponent } from './login/login.component';
import { RouterOutlet, RouterLink,RouterLinkActive } from '@angular/router';
import { LoginService } from './login.service';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],

  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontend_erorrists';
  private auth = inject(LoginService);
  user = this.auth.user;
  
  constructor(){
    this.auth.login('lambik@test.com', 'lambikske')
    this.logintest();
   }

   async logintest(){
    await this.auth.login('lambik@test.com', 'lambikske');
    console.log(this.user(), 'appcomponent')
   }
}