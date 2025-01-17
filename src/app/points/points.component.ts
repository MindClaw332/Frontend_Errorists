import { Component, computed, inject, signal } from '@angular/core';
import {FormsModule} from '@angular/forms';
import { TestdataService } from '../shared/testdata.service';
import { CoursedataService } from '../shared/coursedata.service';

@Component({
  selector: 'app-points',
  imports: [FormsModule],
  templateUrl: './points.component.html',
  styleUrl: './points.component.css'
})
export class PointsComponent {
private testdata = inject(TestdataService);
private coursedata = inject(CoursedataService);

tests = this.testdata.tests;
courses = this.coursedata.courses

constructor () {
  this.testdata.loadTests();
  this.coursedata.loadCourses();
}

// Filters to the selected test
selectedTest: { id: number; name: string; maxvalue: number; course_id: number; users: 
  { id: number; firstname: string; lastname: string; value: number }[]; }[] = [];

selectTest(id: number) {
  const foundTest = this.tests().find(test => test.id === id);
  this.selectedTest = foundTest ? [foundTest] : [];
}

// Search tests
searchTests = signal('');

searchedTests = computed(() => {
  const searchquery = this.searchTests().toLowerCase();
  let filteredTests = this.tests().filter(test => test.name.toLowerCase().includes(searchquery));
  return filteredTests;
});

//filter by course
filter = signal('');

filterCourses = computed(() => {
  const searchquery = this.filter().toLowerCase();
  let filteredCourse = this.courses().filter(course => course.name.toLocaleLowerCase().includes(searchquery));
  return filteredCourse;
});

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

}
