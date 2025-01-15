import { Component, inject, effect, signal } from '@angular/core';
import {CommonModule} from '@angular/common'
import { StudentdataService } from '../shared/studentdata.service';
import {User} from '../interfaces/user'
import{Class} from '../interfaces/class'

@Component({
  selector: 'app-mich-test',
  imports: [CommonModule],
  templateUrl: './mich-test.component.html',
  styleUrl: './mich-test.component.css'
})
export class MichTestComponent {
  private dataservice = inject(StudentdataService);
  students = this.dataservice.users
  constructor(){
    this.dataservice.loadUsers();
  }

}
