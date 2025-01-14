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
  { id: 1, name: 'wiskunde: hoodstuk 13', courseName: 'wiskunde'},
  { id: 2, name: 'biologie: hoofdstuk 5', courseName: 'biologie'},
  { id: 3, name: 'natuurkunde: hoofstuk 28', courseName: 'natuurkunde'},
  { id: 4, name: 'chemie: hoofstuk 19', courseName: 'chemie'},
  { id: 5, name: 'aarderijkskunde: hoodstuk 3', courseName: 'aarderijkskunde'},
  { id: 6, name: 'wiskunde: examen', courseName: 'wiskunde'},
  { id: 7, name: 'wiskunde: test examen', courseName: 'wiskunde'},
  { id: 8, name: 'biologie: 21', courseName: 'biologie'},
  { id: 9, name: 'aarderijkskunde: hfdstk 20', courseName: 'aarderijkskunde'},
  { id: 10, name: 'chemie: hoofstuk 19', courseName: 'chemie'},
  { id: 11, name: 'chemie: hoofstuk 13', courseName: 'chemie'},
  { id: 12, name: 'chemie: hoofstuk 17', courseName: 'chemie'},
  { id: 13, name: 'chemie: hoofstuk 10', courseName: 'chemie'},
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

courses = [
  { id: 1, name: 'wiskunde'},
  { id: 2, name: 'biologie'},
  { id: 3, name: 'natuurkunde'},
  { id: 4, name: 'chemie'},
  { id: 5, name: 'aarderijkskunde'},
  { id: 6, name: 'geschiedenis'}
];

//filter the student array for needed students
filteredStudents: Array<{ id: number; firstname: string; lastname: string; test_id: number; value: number; maxvalue: number }> = []

displayStudents(test: number): void {
  this.filteredStudents = this.students.filter(student => student.test_id === test);
}

//filter the test array for needed test
selectedTest: { id: number; name: string; courseName: string } | null = null;

selectTest(test: { id: number; name: string; courseName: string }): void {
  this.selectedTest = test;
}

//filter against content input field
search: string = '';

searched: Array<{ id: number; name: string; courseName: string}> = [...this.tests]

onInputChange(): void {
  this.searched = this.filtered.filter(test =>
    test.name.toLowerCase().includes(this.search.toLowerCase()));
}

//filter by course
filter: string = '';

filtered: Array<{ id: number; name: string; courseName: string }> = [...this.tests];


filterCourses (filter: string): void {
  this.filter = filter;
  this.filtered = this.tests.filter(test =>
    test.courseName === filter);
  this.searched = this.filtered.filter(test =>
    test.name.toLowerCase().includes(this.search.toLowerCase()));
}

}
