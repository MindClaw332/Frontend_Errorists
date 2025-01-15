import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from '../interfaces/user';
import { Class } from '../interfaces/class';
import { StudentdataService } from '../shared/studentdata.service';
import { ClassdataService } from '../shared/classdata.service';

@Component({
  selector: 'app-teacher',
  imports: [FormsModule],
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

  constructor() {
    this.classdata.loadClasses();
    this.userdata.loadUsers();
  }

  //visibility
  isHidden = true;
  isVisible = false;
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

  //filter against content input field classes
  searchClasses = signal('');

  searchedClasses = computed(() => {
    const searchquery = this.searchClasses().toLowerCase();
    let filteredclasses = this.classes().filter(item => item.name.toLowerCase().includes(searchquery));
    return filteredclasses;
  });
  //filter against content input field students
  searchStudents = signal('');

  searchedStudents = computed(() => {
    const searchquery = this.searchStudents().toLowerCase();
    let searchedStudents = this.filteredStudents().filter(student =>
      student.firstname.toLowerCase().includes(searchquery) ||
      student.lastname.toLowerCase().includes(searchquery));
    return searchedStudents;
  })
}
