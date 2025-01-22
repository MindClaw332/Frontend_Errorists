import { Component, inject, numberAttribute } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoginService } from '../login.service';
import { first } from 'rxjs';
import { Route, Router } from '@angular/router';
import { ClassdataService } from '../shared/classdata.service';
import { Class } from '../interfaces/class';
import { CoursedataService } from '../shared/coursedata.service';
import { Course } from '../interfaces/course';

@Component({
  selector: 'app-batchadd',
  imports: [FormsModule, CommonModule],
  templateUrl: './batchadd.component.html',
  styleUrl: './batchadd.component.css'
})
export class BatchaddComponent {

  private registrationdata = inject(LoginService);
  private classdata = inject(ClassdataService);
  private coursedata = inject(CoursedataService)

  //signals
  registration = this.registrationdata.registration;
  classes = this.classdata.classes;
  courses = this.coursedata.courses;

  //curent view stat
  currentview: 'user' | 'test' = 'user';
  courseItem: any;

  //constructor
  constructor(private router: Router) {
    this.classdata.loadClasses();
    this.coursedata.loadCourses();
  }
  async initializeClasses() {
    await this.classdata.loadClasses();
    await this.coursedata.loadCourses();
  }

  getClasses(): Class[] {
    return this.classes() || [];
  }

  getCourses(): Course[]
  {
    return this.courses() || [];
  }
  //function to add users to the data base 
  async addUser(firstName: string, lastName: string, password: string, klas: number | null, email: string, role: number) {
    try {
      const result = await this.registrationdata.registration(
        firstName,
        lastName,
        email,
        password,
        role,
        klas
      );
      console.log('Gebruiker aangemaakt', result);
    }
    catch (error) {
      console.error('Er is een probleem met het aanmaken van gebruikers', error);
    }
  }
  
  //function to add test to the data base 
  addTest(klastest:number, testName:string, score:number, hours:number)
  {
    console.log(klastest, testName,score, hours )
  }
  //for stiching views 
  setView(view: 'user' | 'test') {
    this.currentview = view;
  }
  //new test addition 
}


