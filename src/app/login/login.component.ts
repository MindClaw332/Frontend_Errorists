import { Component, inject, input, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { LoginService } from '../shared/login.service';
import { Router } from '@angular/router';
import { PairingService } from '../shared/pairing.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent implements OnInit {
  // testing
  pairing = inject(PairingService);
  //variables
  auth = inject(LoginService);
  router = inject(Router);
  passwordinput = '';
  emailinput = '';
  showpassword: boolean = true;
  inputtype: string = 'password'
  loggedin = this.auth.isloggedin();

  //reactiveform declaration
  loginform = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl(''),
  });

  ngOnInit(): void {
    console.log('initialized');
  }
  //when you press the submit button this will login (still add when login is correct redirect when it isnt show it to user)
  async handleSubmit() {
    const result = await this.auth.login(this.loginform.value.email!, this.loginform.value.password!);
    const user = await JSON.parse(sessionStorage.getItem('user')!)
    console.log(JSON.parse(sessionStorage.getItem('user')!), ' sessionStorage')
    if (result.message === 'valid credentials') {
      this.redirect(user.role_id, user.user_id);

    }
  }

  redirect(userRole: number, user_id: number) {
    switch (userRole) {
      case 1:
        this.router.navigate([`/students/${user_id}`]);
        break;
      case 2:
        this.router.navigate(['/dashboard']);
        break;
      default:
        this.router.navigate(['/login']);
    }
  }

  //when you click the eye icon it will show the password in plain text
  togglepassword(toggle: boolean) {
    // toggle the boolean
    this.showpassword = !this.showpassword;
    switch (toggle) {
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
