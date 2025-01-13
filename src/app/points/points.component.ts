import { Component } from '@angular/core';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-points',
  imports: [FormsModule],
  templateUrl: './points.component.html',
  styleUrl: './points.component.css'
})
export class PointsComponent {

// Visibility
isHidden = true;
isVisible = false;

viewPoints () {
  this.isHidden = !this.isHidden;
  this.isVisible = ! this.isVisible;
}

viewTests () {
  this.isHidden = !this.isHidden;
  this.isVisible = ! this.isVisible;
}

//arrays
tests = [
  { id: 1, name: 'wiskunde'},
  { id: 2, name: 'biologie'},
  { id: 3, name: 'natuurkunde'},
  { id: 4, name: 'chemie'},
  { id: 5, name: 'aarderijkskunde'}
];

students = [
  { id: 1, firstname: 'Jeff', lastname: 'Dunn', test_id: 1, value: 16, maxvalue: 20},
  { id: 2, firstname: 'Lisa', lastname: 'Pruet', test_id: 1, value: 13, maxvalue: 20},
  { id: 3, firstname: 'Leo', lastname: 'Durett', test_id: 2, value: 8, maxvalue: 20},
  { id: 4, firstname: 'Liam', lastname: 'Bay', test_id: 1, value: 12, maxvalue: 20},
  { id: 5, firstname: 'Jamie', lastname: 'Baker', test_id: 2, value: 15, maxvalue: 20},
  { id: 6, firstname: 'Jeff', lastname: 'Olan', test_id: 3, value: 17, maxvalue: 20},
  { id: 7, firstname: 'Brady', lastname: 'Duran', test_id: 3, value: 5, maxvalue: 20},
  { id: 8, firstname: 'Remy', lastname: 'Duran', test_id: 4, value: 13, maxvalue: 20},
  { id: 9, firstname: 'Liz', lastname: 'Mayfair', test_id: 2, value: 14, maxvalue: 20},
  { id: 10, firstname: 'Noelle', lastname: 'Reaper', test_id: 4, value: 12, maxvalue: 20}
];

//filter the student array for needed students
filteredStudents: Array<{ id: number; firstname: string; lastname: string; test_id: number; value: number; maxvalue: number }> = []

displayStudents(test: number): void {
  this.filteredStudents = this.students.filter(student => student.test_id === test);
}

//filter the test array for needed test
selectedTest: { id: number; name: string } | null = null;

selectTest(test: { id: number; name: string }): void {
  this.selectedTest = test;
}

}
