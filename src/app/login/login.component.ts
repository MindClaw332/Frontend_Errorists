import { Component, inject, input } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { LoginService } from '../login.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent {
  auth = inject(LoginService);
  passwordinput = '';
  emailinput = '';
  showpassword: boolean = true;
  inputtype: string = 'password'

  loginform = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('')
  });
  
  handleSubmit() {
    this.auth.login(this.loginform.value.email!, this.loginform.value.password!);
  }

  togglepassword(toggle: boolean){
    this.showpassword = !this.showpassword;
    switch(toggle){
      case true:
        this.inputtype = "text";
        break;
      case false:
        this.inputtype = "password";
        break;
      default:
        this.inputtype = "password";
    }
  }

}
