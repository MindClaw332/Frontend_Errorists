import { Component, computed, inject, signal } from '@angular/core';
import {FormsModule} from '@angular/forms';
import { TestdataService } from '../shared/testdata.service';
import { CoursedataService } from '../shared/coursedata.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-points',
  imports: [FormsModule, CommonModule],
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
  const filteredCourse = this.courses().find(course => 
    course.name.toLocaleLowerCase().includes(searchquery)
  );
  if (!filteredCourse) return [];

  const filteredTests = this.tests().filter(test => test.course_id === filteredCourse.id);
  return filteredTests;
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

// Get percentage for a test
getTestScore(value: number, maxvalue: number) {
  let testScore = (value/maxvalue)*100
  return testScore;
}

 // Colour depending on score
 GetClassColor(percentage: number) {
  if (percentage >= 66) {
    return 'bg-accent-green-light dark:bg-accent-green'
  } else if (percentage > 50 && percentage < 66) {
    return 'bg-accent-orange-light dark:bg-accent-orange'
  } else {
    return 'bg-accent-red-light dark:bg-accent-red'
  }
}

}
