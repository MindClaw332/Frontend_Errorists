import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from '../interfaces/user';
import { Class } from '../interfaces/class';
import { StudentdataService } from '../shared/studentdata.service';
import { ClassdataService } from '../shared/classdata.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CapitalizenamePipe } from '../pipes/capitalizename.pipe';

@Component({
  selector: 'app-teacher',
  imports: [FormsModule, CommonModule, CapitalizenamePipe],
  templateUrl: './teacher.component.html',
  styleUrl: './teacher.component.css'
})
export class TeacherComponent {
  private userdata = inject(StudentdataService);
  private classdata = inject(ClassdataService);
  studentfilter = signal<number>(1);

  //signals 
  classes = this.classdata.classes;
  students = this.userdata.users;

  // constructor initializes the service so it can read those signals
  constructor(private router :Router) {
    this.classdata.loadClasses();
    this.userdata.loadUsers();
  }

  //visibility
  isHidden = true;
  isVisible = false;

  ishovered = false;


  // toggle classes off and students on
  viewStudents() {
    this.isHidden = !this.isHidden;
    this.isVisible = !this.isVisible;
  }

  // toggle classes on and students off
  viewClasses() {
    this.isHidden = !this.isHidden;
    this.isVisible = !this.isVisible;
  }

  // changes the studentfilter signal 
  SetStudentFilter(id: number) {
    this.studentfilter.set(id);
  }

  //filter student array for needed students
  filteredStudents = computed(() => {
    const filterid = this.studentfilter();
    const filteredstudentsarray = this.students().filter(student => student.class_id == filterid);
    return filteredstudentsarray;
  }
  )
  //filter class array for needed class
  selectedClass: { id: number; name: string } | null = null;

  selectClass(classItem: { id: number; name: string }): void {
    this.selectedClass = classItem;
  }

  //signal that reads input of searchbar to search for users
  searchClasses = signal('');

  // signal that changes the classes you are actively searching for
  searchedClasses = computed(() => {
    const searchquery = this.searchClasses().toLowerCase();
    let filteredclasses = this.classes().filter(item => item.name.toLowerCase().includes(searchquery));
    return filteredclasses;
  });
  //signal that reads input of searchbar so it ccan search for it
  searchStudents = signal('');

  // signal that changes the students you are actively searching for
  searchedStudents = computed(() => {
    const searchquery = this.searchStudents().toLowerCase();
    let searchedStudents = this.filteredStudents().filter(student =>
      student.firstname.toLowerCase().includes(searchquery) ||
      student.lastname.toLowerCase().includes(searchquery));
    return searchedStudents;
  })

  GetClassColor(percentage: number) {
    if (percentage >= 66) {
      return 'bg-accent-green-light dark:bg-accent-green'
    } else if (percentage > 33 && percentage < 66) {
      return 'bg-accent-orange-light dark:bg-accent-orange'
    } else {
      return 'bg-accent-red-light dark:bg-accent-red'
    }
  }
  RedirectToStudent(id:number){
    this.router.navigate([`/students/${id}`]);
  }
}
