import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent {
passwordinput = '';
emailinput = '';

  loginform = new FormGroup({
  email: new FormControl('',[ Validators.required, Validators.email]),
  password: new FormControl('')
});
}
