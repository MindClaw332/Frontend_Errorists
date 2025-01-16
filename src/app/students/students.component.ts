import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StudentdataService } from '../shared/studentdata.service';
import { ResultdataService } from '../shared/resultdata.service';
import { GroupdataService } from '../shared/groupdata.service';
import { CoursedataService } from '../shared/coursedata.service';
import { CommonModule } from '@angular/common';
import { Testresult } from '../interfaces/testresult';

@Component({
  selector: 'app-students',
  imports: [CommonModule],
  templateUrl: './students.component.html',
  styleUrl: './students.component.css'
})
export class StudentsComponent {

private userdata = inject(StudentdataService);
private groupdata = inject(GroupdataService);
private testresultdata = inject(ResultdataService);
private coursedata = inject(CoursedataService);

students = this.userdata.users
groups = this.groupdata.groups
testresults = this.testresultdata.results
courses = this.coursedata.courses
  
constructor(){
    this.userdata.loadUsers();
    this.groupdata.loadGroups();
    this.testresultdata.loadResults(this.id);
    this.coursedata.loadCourses();
}

// The id of the specific student
id = 2;

// Get the specific student for the student profile
loadStudent = computed(() => {
    let chosenStudent = this.students().filter(student => student.id === this.id);
    return chosenStudent;
});

// Get the tutors/tuitees linked to the student
filteredGroups = computed(() => {
  // Get groups with the matching user_id
  let filter = this.groups().filter(group => group.user_id === this.id);
  
  // Get array of groupnames from those groups
  let groupNames = filter.map(group => group.groupname);
  
  // Get groups that have a groupname that matches and different user_id
  let inverse = this.groups().filter(group =>
    groupNames.includes(group.groupname) && group.user_id !== this.id
  );

  // Add student.class to each group
  return inverse.map(group => {
    const userData = this.students().find(user => user.id === group.user_id);
    return {
      ...group,
      userClass: userData?.class
    };
  });
});


// Groups tests per course
course = computed (() => {
type groupedTests = Record<string, Testresult[]>;

const groupedTests = this.testresults().reduce((acc: groupedTests, test: Testresult) => {
  acc[test.coursename] = acc[test.coursename] || [];  // Default to an empty array if undefined
  acc[test.coursename].push(test);
  return acc;
}, {} as groupedTests);

// Convert groupedTests to an iterable
const iterableGroupedTests = Object.entries(groupedTests);

console.log(iterableGroupedTests);

return iterableGroupedTests;
});

// Get average per course
getAverage(testResults: Testresult[]): number {
  let totalValue = testResults.reduce((sum, test) => sum + test.value, 0);
  let totalMaxvalue = testResults.reduce((sum, test) => sum + test.maxvalue, 0);
  let average = (totalValue/totalMaxvalue)*100;
  return Math.round(average);
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


// Visibility
isHidden = true;

isVisible = false;

viewSubjects () {
    this.isHidden = !this.isHidden;
    this.isVisible = !this.isVisible;
}

viewTests () {
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

}
