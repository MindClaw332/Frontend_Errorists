import { Component, computed, inject, signal, OnInit, OnDestroy, ViewChild, forwardRef } from '@angular/core';
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
import { PairingService } from '../shared/pairing.service';
import { CapitalizenamePipe } from '../pipes/capitalizename.pipe';
import { GroupnamePipe } from '../pipes/groupname.pipe';

@Component({
  selector: 'app-students',
  imports: [CommonModule, FullCalendarModule, CapitalizenamePipe, GroupnamePipe],
  templateUrl: './students.component.html',
  styleUrl: './students.component.css'
})
export class StudentsComponent implements OnInit, OnDestroy {

  userdata = inject(StudentdataService);
  private groupdata = inject(GroupdataService);
  private testresultdata = inject(ResultdataService);
  private pairingdata = inject(PairingService);
  private routeSub!: Subscription;
  showPercent:boolean = false;

  id: number = 1;
  student = this.userdata.specificstudent();
  students = this.userdata.users;
  groups = this.groupdata.groups;
  testresults = this.testresultdata.results;

  constructor(private route: ActivatedRoute) {
  }


  checkedDate: Array<any> = [];

  groupVisibility: { [key: number]: { isHidden: boolean; isVisible: boolean } } = {};
  filteredGroups: any[] = [];

  async ngOnInit() {
    console.log(this.id, 'begin init')
    this.routeSub = this.route.params.subscribe(params => {
      this.id = params['id'];
      console.log(this.id, 'na sub');
    })
    // refactor to one api call

    await this.userdata.loadStudent(this.id);
    this.student = this.userdata.specificstudent();
    console.log(this.student, 'students na load')
    await this.groupdata.loadGroups();
    this.groups.set(this.groupdata.groups());
    console.log(this.groups(), 'groups na load');
    this.testresultdata.loadResults(this.id);
    console.log(this.id);
    await this.userdata.loadUsers();
    this.students.set(this.userdata.users());
    console.log(this.students(), 'students');

    // Filter on ACCEPTED groups from student
    this.filteredGroups = this.student?.groups.filter(group => group.status === 'ACCEPTED') || [];

    //checks groups for acceptdate and nowdate, all +7 accepted groups -> show pop up
    this.student?.groups.filter(groups => groups.tutor === 1 && groups.accepted_at !== null)
      .forEach(group => {
        if (this.pairingdata.calculateCurrentDateDiff(group.accepted_at) >= 7) {
          console.log('HEYY LANGE GROEP')
          this.checkedDate?.push(group);
          console.log(this.checkedDate, 'checked date')
        }
      });

    this.checkedDate?.forEach(group => {
      console.log('groupje', group)
      this.groupVisibility[group.group_id] = {
        isHidden: true,  // Initial state: true
        isVisible: false // Initial state: false
      };
    });

    this.checkedDate?.forEach(group => this.selectDate(group.group_id));
  }

  ngOnDestroy(): void {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }

  togglePercent() {
    this.showPercent = !this.showPercent;
  }

  test() {
    console.log(this.student, 'wanneer alles gecalled word');
    console.log(this.testresults, 'wanneer alles gecalled word');
  }

  findUser(id: number) {
    let user = this.students().filter(student => student.id === id);
    return user;
  }

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

    console.log(iterableGroupedTests, "hoe groeped tests eruit moet zien");

    return iterableGroupedTests;
  });

  // Get average per course
  getAverage(testResults: Testresult[]): number {
    let totalValue = testResults.reduce((sum, test) => sum + test.value, 0);
    let totalMaxvalue = testResults.reduce((sum, test) => sum + test.maxvalue, 0);
    let average = (totalValue / totalMaxvalue) * 100;
    return Math.round(average);
  }

  // Get percentage for a test
  getTestScore(value: number, maxvalue: number) {
    let testScore = (value / maxvalue) * 100
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

  selectDate(groupId: number) {
    if (this.checkedDate !== undefined) {
      this.groupVisibility[groupId].isHidden = !this.groupVisibility[groupId].isHidden;
      this.calendarVisible = true;

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
    } else {
      return
    }
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

  formattedDate: string = '';

  async saveTutoringDate(groupId: number, courseName: string) {
    // Can only save when a day is selected
    if (this.saveDay === null) {
      return;
    }
    // CourseName get the complementary ID
    let course = this.course().find(course => courseName === course.coursename);
    let courseId = course?.id;

    // GroupId get the complementary name
    let group = this.groups().find(group => groupId === group.id);
    let groupName = group?.groupname

    // The selected date gets transformed into the correct format
    this.formattedDate = this.pairingdata.dateToString(this.saveDay);
    console.log(`gekozen dag: ${this.formattedDate}, groep-id: ${groupId}`);

    // Send PUT request
    if (courseId !== undefined && groupName !== undefined) {
      await this.pairingdata.acceptDate(groupId, groupName, courseId, this.formattedDate);
    }

    this.groupVisibility[groupId].isHidden = !this.groupVisibility[groupId].isHidden;
    this.calendarVisible = false;
  }

  async setLater(groupId: number, courseName: string) {
    // CourseName get the complementary ID
    let course = this.course().find(course => courseName === course.coursename);
    let courseId = course?.id;

    // GroupId get the complementary name
    let group = this.groups().find(group => groupId === group.id);
    let groupName = group?.groupname

    // Send PUT request
    if (courseId !== undefined && groupName !== undefined) {
      await this.pairingdata.accept(groupId, groupName, courseId);
    }

    this.groupVisibility[groupId].isHidden = !this.groupVisibility[groupId].isHidden;
    this.calendarVisible = false;
  }

  async declineTutee(groupId: number, courseName: string) {
    // CourseName get the complementary ID
    let course = this.course().find(course => courseName === course.coursename);
    let courseId = course?.id;

    // GroupId get the complementary name
    let group = this.groups().find(group => groupId === group.id);
    let groupName = group?.groupname

    // Send PUT request
    if (courseId !== undefined && groupName !== undefined) {
      await this.pairingdata.decline(groupId, groupName, courseId);
    }

    this.groupVisibility[groupId].isHidden = !this.groupVisibility[groupId].isHidden;
    this.calendarVisible = false;
  }
}
