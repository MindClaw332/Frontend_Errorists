import { Component, computed, inject, signal, OnInit, OnDestroy,  ViewChild, forwardRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StudentdataService } from '../shared/studentdata.service';
import { ResultdataService } from '../shared/resultdata.service';
import { GroupdataService } from '../shared/groupdata.service';
import { CommonModule } from '@angular/common';
import { Testresult } from '../interfaces/testresult';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, Calendar, EventClickArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { DateClickArg, EventDragStopArg } from '@fullcalendar/interaction';
import { FullCalendarComponent } from '@fullcalendar/angular';

@Component({
  selector: 'app-students',
  imports: [CommonModule,FullCalendarModule],
  templateUrl: './students.component.html',
  styleUrl: './students.component.css'
})
export class StudentsComponent implements OnInit, OnDestroy {

  userdata = inject(StudentdataService);
  private groupdata = inject(GroupdataService);
  private testresultdata = inject(ResultdataService);
  private routeSub!: Subscription;
  id: number = 1;
  students = this.userdata.users
  groups = this.groupdata.groups
  testresults = this.testresultdata.results;

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    console.log(this.id, 'begin init')
    this.routeSub = this.route.params.subscribe(params => {
      this.id = params['id'];
      console.log(this.id, 'na sub');
    })
    this.userdata.loadStudent(this.id);
    console.log(this.students, 'students na load')
    this.groupdata.loadGroups();
    console.log(this.students, 'groups na load')
    this.testresultdata.loadResults(this.id);
    console.log(this.id);

    //checks groups for acceptdate and nowdate, all +7 accepted groups -> show pop up
  }

  ngOnDestroy(): void {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }
  
  test(){
    console.log(this.students, 'wanneer alles gecalled word');
    console.log(this.testresults, 'wanneer alles gecalled word');
  }


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
    let average = (totalValue / totalMaxvalue) * 100;
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
  selectedCourse: { id: number, coursename: string, tests: Testresult[] }[] = [];

  selectCourse(id: number) {
    this.selectedCourse = this.course().filter(test => test.id === id);
  }

  // Visibility
  isHidden = true;

  isVisible = false;

  viewCourses() {
    this.isHidden = !this.isHidden;
    this.isVisible = !this.isVisible;
  }

  viewTests() {
    this.isHidden = !this.isHidden;
    this.isVisible = !this.isVisible;
  }

  calendarHidden = true;
  calendarVisible = false;

  calendarOptions?: CalendarOptions;
  eventsModel: any;
  @ViewChild('fullcalendar') fullcalendar?: FullCalendarComponent;

  selectDate () {
    this.calendarHidden = !this.calendarHidden;
    this.calendarVisible = !this.calendarVisible;

    // calendar needs to be group specific, a week since acceptdate, so a specific group is like huh needs a date
    forwardRef(() => Calendar);

    this.calendarOptions = {
      plugins: [dayGridPlugin, interactionPlugin],
      editable: true,
      customButtons: {
      },
      headerToolbar: {
        left: 'next',
        center: 'title',
        right: 'today'
      },
      dateClick: this.handleDateClick.bind(this)
    };
  }

  saveDay: Date | null = null;
  previousDayEl: HTMLElement | null = null;

  handleDateClick(arg: DateClickArg) {
    const clickedDate = arg.date;
    const today = new Date();
  
    // Prevent selecting dates in the past
    if (clickedDate < today) {
      return;
    }   

    // If a previous date is selected, deselect it
    if (this.previousDayEl) {
      this.previousDayEl.classList.remove('bg-accent-green');
    }
  
    // If the clicked date is the same as the saved date, deselect it and reset saved date
    if (this.saveDay && this.saveDay.getTime() === clickedDate.getTime()) {
      this.saveDay = null; 
      this.previousDayEl = null;
    } else {
      // Select and save the date
      arg.dayEl.classList.add('bg-accent-green');
      this.saveDay = clickedDate; 
      this.previousDayEl = arg.dayEl;
    }
    console.log(this.saveDay);
  }

}
