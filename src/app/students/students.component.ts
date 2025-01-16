import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StudentdataService } from '../shared/studentdata.service';
import { ResultdataService } from '../shared/resultdata.service';
import { GroupdataService } from '../shared/groupdata.service';
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

students = this.userdata.users
groups = this.groupdata.groups
testresults = this.testresultdata.results
  
constructor(){
    this.userdata.loadUsers();
    this.groupdata.loadGroups();
    this.testresultdata.loadResults(this.id);
}

// The id of the specific student
id = 1;

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
course = computed(() => {
  type GroupedTestWithId = {
    id: number;
    tests: Testresult[];
  };

  let currentId = 1; // Start-ID

  // Group on coursename and add an ID
  const groupedTests = this.testresults().reduce((acc: Record<string, GroupedTestWithId>, test: Testresult) => {
    if (!acc[test.coursename]) {
      acc[test.coursename] = {
        id: currentId++,
        tests: [],
      };
    }
    acc[test.coursename].tests.push(test);
    return acc;
  }, {} as Record<string, GroupedTestWithId>);

  // Convert groupedTests to iterabble
  const iterableGroupedTests = Object.entries(groupedTests).map(([coursename, { id, tests }]) => ({
    id,
    coursename,
    tests,
  }));

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

// Filters to the selected course
selectedCourse: {id: number, coursename: string, tests: Testresult[]}[] = [];

selectCourse (id: number) {
  this.selectedCourse = this.course().filter(test => test.id === id);
}

// Visibility
isHidden = true;

isVisible = false;

viewCourses () {
    this.isHidden = !this.isHidden;
    this.isVisible = !this.isVisible;
}

viewTests () {
    this.isHidden = !this.isHidden;
    this.isVisible = !this.isVisible;
}

}
