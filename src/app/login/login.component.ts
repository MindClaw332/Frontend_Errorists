import { Component, inject, input } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { LoginService } from '../login.service';
import { Router } from '@angular/router';
import { PairingService } from '../shared/pairing.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent {
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
  //when you press the submit button this will login (still add when login is correct redirect when it isnt show it to user)
  async handleSubmit() {
    const result = await this.auth.login(this.loginform.value.email!, this.loginform.value.password!);
    console.log(this.auth.currentuser())
    if (result.message === 'valid credentials' && this.auth.currentuser().role_id === 2) {
      const diff = this.pairing.calculateCurrentDateDiff("2025-01-22")
      console.log(diff, 'current diff should be 2 or 3')
      // this.pairing.test();
      this.router.navigate(['/dashboard'])
    } else if (result.message === 'valid credentials' && this.auth.currentuser().role_id === 1) {
      console.log('student login');
      this.pairing.test();

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
