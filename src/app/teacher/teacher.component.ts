import { Component } from '@angular/core';

@Component({
  selector: 'app-teacher',
  imports: [],
  templateUrl: './teacher.component.html',
  styleUrl: './teacher.component.css'
})
export class TeacherComponent {

//visibility
isHidden = true;
isVisible = false;
  
viewStudents () {
  this.isHidden = !this.isHidden;
  this.isVisible = ! this.isVisible;
}
  
viewClasses () {
  this.isHidden = !this.isHidden;
  this.isVisible = ! this.isVisible;
}

//arrays
classes = [
  { id: 1, name: '3wis'},
  { id: 2, name: '2wis'},
  { id: 3, name: '3eco'},
  { id: 4, name: '2eco'},
  { id: 5, name: '4eco'},
  { id: 6, name: '4wis'}
];

students = [
  { id: 1, firstname: 'Jeff', lastname: 'Dunn', class_id: 1},
  { id: 2, firstname: 'Lisa', lastname: 'Pruet', class_id: 1},
  { id: 3, firstname: 'Leo', lastname: 'Durett', class_id: 2},
  { id: 4, firstname: 'Liam', lastname: 'Bay', class_id: 1},
  { id: 5, firstname: 'Jamie', lastname: 'Baker', class_id: 2},
  { id: 6, firstname: 'Jeff', lastname: 'Olan', class_id: 3},
  { id: 7, firstname: 'Brady', lastname: 'Duran', class_id: 3},
  { id: 8, firstname: 'Remy', lastname: 'Duran', class_id: 4},
  { id: 9, firstname: 'Liz', lastname: 'Mayfair', class_id: 2},
  { id: 10, firstname: 'Noelle', lastname: 'Reaper', class_id: 4}
];


//filter student array for needed students
filteredStudents: Array<{ id: number; firstname: string; lastname: string; class_id: number }> = []

displayStudents(classId: number): void {
  this.filteredStudents = this.students.filter(student => student.class_id === classId);
}

//filter class array for needed class
selectedClass: { id: number; name: string } | null = null;

selectClass(classItem: { id: number; name: string }): void {
  this.selectedClass = classItem;
}

}
