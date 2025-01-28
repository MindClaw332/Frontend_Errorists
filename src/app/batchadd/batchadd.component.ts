import { Component, inject, numberAttribute, viewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoginService } from '../shared/login.service';
import { first } from 'rxjs';
import { Route, Router } from '@angular/router';
import { ClassdataService } from '../shared/classdata.service';
import { Class } from '../interfaces/class';
import { CoursedataService } from '../shared/coursedata.service';
import { Course } from '../interfaces/course';
import { TestdataService } from '../shared/testdata.service';
import { ViewChild } from '@angular/core';
import { ElementRef } from '@angular/core';


@Component({
  selector: 'app-batchadd',
  imports: [FormsModule, CommonModule, ],
  templateUrl: './batchadd.component.html',
  styleUrl: './batchadd.component.css'
})
export class BatchaddComponent{

  private registrationdata = inject(LoginService);
  private classdata = inject(ClassdataService);
  private coursedata = inject(CoursedataService)
  private testdata = inject(TestdataService)

  //signals
  registration = this.registrationdata.registration;
  classes = this.classdata.classes;
  courses = this.coursedata.courses;
  tests = this.testdata.addTest;

  //curent view stat
  currentview: 'user' | 'test' = 'user';
  courseItem: any;

  //constructor
  constructor(private router: Router) {
    this.initializeData();
  }

  private async initializeData()
  {
    try{
      await Promise.all([
        this.classdata.loadClasses(),
        this.coursedata.loadCourses()
      ]);
    }
    catch(error)
    {
      console.error('Error loading initial data:', error);
    }
  }
 

  getClasses(): Class[] {
    return this.classes() || [];
  }

  getCourses(): Course[]
  {
    return this.courses() || [];
  }

  //Form resets 
  //Users
  @ViewChild('firstName') firstName?: ElementRef;
  @ViewChild('lastName') lastName?: ElementRef;
  @ViewChild('email') email?: ElementRef;
  @ViewChild('password') password?: ElementRef;
  @ViewChild('klas') klas?: ElementRef;
  @ViewChild('role') role?: ElementRef;

  //Tests
  @ViewChild('vak') vak?: ElementRef;
  @ViewChild('klastest') klastest?: ElementRef;
  @ViewChild('testName') testName?: ElementRef;
  @ViewChild('score') score?: ElementRef;
  @ViewChild('hours') hours?: ElementRef;

  //Reset User Function
  resetUserForm(): void
  {
    if (this.firstName) this.firstName.nativeElement.value = '';
    if (this.lastName) this.lastName.nativeElement.value = '';
    if (this.email) this.email.nativeElement.value = '';
    if (this.password) this.password.nativeElement.value = '';
    if (this.klas) this.klas.nativeElement.value = 'null';
    if (this.role) this.role.nativeElement.value = '';
  }

  //Reset Test Function
  resetTestFrom(): void
  {
    if (this.vak) this.vak.nativeElement.value = '';
    if (this.klastest) this.klastest.nativeElement.value = '';
    if (this.testName) this.testName.nativeElement.value = '';
    if (this.score) this.score.nativeElement.value = '';
    if (this.hours) this.hours.nativeElement.value = '';
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
      this.resetUserForm();
    }
    catch (error) {
      console.error('Er is een probleem met het aanmaken van gebruikers', error);
    }
  }
  
  //function to add test to the data base 
  async addTest(vak: number, testName: string, score: number, hours: number)
  {
   try {
    const result = await this.testdata.addTest(
      vak,
      testName,
      score,
      hours,
    )
    console.log('Test aangemaakt', result);
    this.resetTestFrom();
   }
   catch(error)
   {
    console.error('ER is iets mis gegaan in het aanmaken van de test', error);
   }
  }
  //for stiching views 
  setView(view: 'user' | 'test') {
    this.currentview = view;
  }
  //new test addition 
}


