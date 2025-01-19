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
  //variables
  auth = inject(LoginService);
  passwordinput = '';
  emailinput = '';
  showpassword: boolean = true;
  inputtype: string = 'password'
  loggedin = this.auth.isloggedin();

  //reactiveform declaration
  loginform = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('')
  });
  
  //when you press the submit button this will login (still add when login is correct redirect when it isnt show it to user)
  async handleSubmit() {
   const test = await this.auth.login(this.loginform.value.email!, this.loginform.value.password!);
   console.log(test, 'test');
   
  }

  //when you click the eye icon it will show the password in plain text
  togglepassword(toggle: boolean){
    // toggle the boolean
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
