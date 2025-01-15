import { Component } from '@angular/core';

@Component({
  selector: 'app-students',
  imports: [],
  templateUrl: './students.component.html',
  styleUrl: './students.component.css'
})
export class StudentsComponent {
  isHidden = true;
  isVisible = false;

  viewSubjects() 
  {
    this.isHidden = !this.isHidden;
    this.isVisible = !this.isVisible;
  }

  viewTests()
  {
    this.isHidden = !this.isHidden;
    this.isVisible = !this.isVisible;
  }

  subjects = [
    {id: 1, point: '80 %', name: 'History'},
    {id: 2, point: '90 %', name: 'Mytoligy'},
    {id: 3, point: '60 %', name: 'Lockpicking'},
    {id: 4, point: '40 %', name: 'Math'},
    {id: 5, point: '70 %', name: 'English'},
    {id: 6, point: '55 %', name: 'Dutch'},
    {id: 7, point: '70 %', name: 'English'},
    {id: 8, point: '70 %', name: 'English'},
    {id: 9, point: '70 %', name: 'English'},
  ];

  tests1 = [
    {id: 1, name: 'Test chapter 1', score: '20/30'},
    {id: 2, name: 'Test chapter 2', score: '40/80'},
    {id: 3, name: 'Test chapter 3', score: '8/10'},
    {id: 4, name: 'Test chapter 4', score: '10/20'},
    {id: 5, name: 'Test chapter 5', score: '10/10'},
    {id: 6, name: 'Test chapter 6', score: '10/20'},
    {id: 7, name: 'Test chapter 7', score: '10/20'},
    {id: 8, name: 'Test chapter 8', score: '20/30'},
    {id: 9, name: 'Test chapter 9', score: '70/100'},
    {id: 10, name: 'Test chapter 10', score: '5/10'}
  ]

  groups = [
    {id: 1, subject: 'History' , class:'Office Logistics', studentName:'Jan Janse'},
    {id: 2, subject: 'English' , class:'Office Logistics', studentName:'Emma Janse'},
    {id: 3, subject: 'Dutch' , class:'Office Logistics', studentName:'Jan Janse'},
    {id: 4, subject: 'Math' , class:'Office Logistics', studentName:'Emma Janse'},
    {id: 5, subject: 'Dutch' , class:'Office Logistics', studentName:'Jan Janse'},
    {id: 6, subject: 'Dutch' , class:'Office Logistics', studentName:'Jan Janse'},
    {id: 7, subject: 'Dutch' , class:'Office Logistics', studentName:'Jan Janse'},
    {id: 8, subject: 'Dutch' , class:'Office Logistics', studentName:'Jan Janse'},
  ]

}
