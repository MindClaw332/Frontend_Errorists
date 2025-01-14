import { Component, inject, effect, signal } from '@angular/core';
import {CommonModule} from '@angular/common'
import {ClassdataService} from '../shared/classdata.service'
import {User} from '../interfaces/user'
import{Class} from '../interfaces/class'

@Component({
  selector: 'app-mich-test',
  imports: [CommonModule],
  templateUrl: './mich-test.component.html',
  styleUrl: './mich-test.component.css'
})
export class MichTestComponent {
  private dataservice = inject(ClassdataService);
  classes = this.dataservice.classes;
  constructor(){
    this.dataservice.loadClasses();
  }

}
