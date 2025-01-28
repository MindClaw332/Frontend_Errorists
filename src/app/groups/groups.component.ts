import { Component, inject, signal, ChangeDetectorRef, OnInit, ViewChild, forwardRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CoursedataService } from '../shared/coursedata.service';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CommonModule } from '@angular/common';
import { CalendarOptions, Calendar, EventClickArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { DateClickArg, EventDragStopArg } from '@fullcalendar/interaction';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { StudentdataService } from '../shared/studentdata.service';
import { PairingService } from '../shared/pairing.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { GroupdataService } from '../shared/groupdata.service';

@Component({
  selector: 'app-groups',
  imports: [FormsModule, FullCalendarModule, CommonModule],
  templateUrl: './groups.component.html',
  styleUrl: './groups.component.css'
})
export class GroupsComponent {
private coursedata = inject(CoursedataService);
private studentdata = inject(StudentdataService);
private pairingdata = inject(PairingService);
private groupdata = inject(GroupdataService);
private routeSub!: Subscription;

courses = this.coursedata.courses;
student = this.studentdata.specificstudent();
students = this.studentdata.users;
groups = this.groupdata.groups;


id: number = 1;

constructor (private route: ActivatedRoute) {
  this.coursedata.loadCourses();
  this.groupdata.loadGroups();
}
  
  isRequestMod= false;
  selectedSubject1: number | undefined;
  selectedSubject2: number | undefined;

  // Toggles the visibility
  toggleRequestMod() {
    this.isRequestMod = !this.isRequestMod;
    this.requestTutor = !this.requestTutor;
  }

  // Handles the request for tutoring
  async submitRequest() {
    // Returns if one or more course(s) is not chosen
    if (this.selectedSubject1 === undefined || this.selectedSubject2 === undefined) {
      alert('Please choose courses');
      return
    }
    // Sends the request to pairing
    this.pairingdata.pairUser(this.selectedSubject1, this.selectedSubject2);

    // Check for selectedSubject 1 and 2
    console.log('Request tutoring for:', this.selectedSubject1, 'Offer for giving tutoring', this.selectedSubject2);

    // Makes the form return to the original state
    this.isRequestMod = false;
    this.requestTutor = !this.requestTutor;
    this.selectedSubject1 = undefined;
    this.selectedSubject2 = undefined;
  }

  // Makes the form return to the original state 
  canncelRequest() {
    this.isRequestMod = false;
    this.requestTutor = !this.requestTutor;
    this.selectedSubject1 = undefined;
    this.selectedSubject2 = undefined;
  }

// On load
filteredGroups: {group_id: number; group_name: string; user1_id: number; user2_id: number; tutor: number; course_name: string; status: string; date: string; accepted_at: string; declined_at: string;}[] | undefined;

async ngOnInit() {
  // Load the student info
  console.log(this.id, 'begin init');
  this.routeSub = this.route.params.subscribe(params => {
      this.id = params['id'];
      console.log(this.id, 'na sub');
  })
  await this.studentdata.loadStudent(this.id);
  console.log(this.student, 'students na load');
  this.student = this.studentdata.specificstudent();
  console.log(this.student, 'test');
  await this.studentdata.loadUsers();
  this.students.set(this.studentdata.users());
  console.log(this.students(), 'students');

  // Filter on status pending and tutor
  this.filteredGroups = this.student?.groups.filter(group => group.status === 'PENDING' || group.status === 'ACCEPTED')
  .filter(group => group.tutor === 1 && group.date === null) || [];

  //Initialize visibility for all groups
  this.student?.groups.forEach(group => {
    this.groupVisibility[group.group_id] = {
      isHidden: true,  // Initial state: true
      isVisible: false // Initial state: false
    };
    this.calendar[group.group_id] = {
      hidden: true
    }
  });

  this.filteredGroups.forEach(group => this.acceptedGroups(group.group_id, group.status));
}

findUser(id: number) {
  let user = this.students().filter(student => student.id === id);
  return user;
}

acceptedGroups(id: number, status: string) {
  if (status === 'ACCEPTED') {
    this.groupVisibility[id].isVisible = !this.groupVisibility[id].isVisible;
    this.groupVisibility[id].isHidden = !this.groupVisibility[id].isHidden;
  } else {
    return
  }
}

// Calendar logic
  calendar: { [key: number]: { hidden: boolean} } = {};
  requestTutor = false;

  calendarOptions?: CalendarOptions;
  eventsModel: any;
  @ViewChild('fullcalendar') fullcalendar?: FullCalendarComponent;

  // Shows the calendar/removes the request tutoring button
  viewCalendar (groupId: number) {
    this.calendar[groupId].hidden = !this.calendar[groupId].hidden;
    this.requestTutor = !this.requestTutor;

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

  // Needs: Logic for selecting one date for tutoring (color: (de)select, only possible for one date, saves the temporary date)
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

  // Needs: method for accept button that permenantly saves the date -> database
  formattedDate: string = '';

  async saveTutoringDate (groupId: number, courseName: string) {
    // Can only save when a day is selected
    if (this.saveDay === null){
      return;
    }
    // CourseName get the complementary ID
    let course = this.courses().find(course => courseName === course.name);
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

    // Sets the correct visbility
    this.calendar[groupId].hidden = !this.calendar[groupId].hidden;
    this.groupVisibility[groupId].isHidden = !this.groupVisibility[groupId].isHidden;
    this.requestTutor = !this.requestTutor;
  }

  // Closes the calendar + reset calendar
  cancelDate (groupId: number) {
    this.calendar[groupId].hidden = !this.calendar[groupId].hidden;
    this.requestTutor = !this.requestTutor;

    // If a date is still selected, reset it
    if (this.previousDayEl) {
      this.previousDayEl.style.background = '';
      this.saveDay = null; 
    }
    console.log(this.saveDay);
  }


// Accepts the request for a tutor
// Removes the accept/decline buttons and shows the calendar button
groupVisibility: { [key: number]: { isHidden: boolean; isVisible: boolean } } = {};

async acceptTutee(groupId: number, courseName: string) {
  const visibility = this.groupVisibility[groupId];
  if (visibility) {
    visibility.isHidden = !visibility.isHidden;
    visibility.isVisible = !visibility.isVisible;
  }
  // CourseName get the complementary ID
  let course = this.courses().find(course => courseName === course.name);
  let courseId = course?.id;

  // GroupId get the complementary name
  let group = this.groups().find(group => groupId === group.id);
  let groupName = group?.groupname

  // Send PUT request
  if (courseId !== undefined && groupName !== undefined) {
    await this.pairingdata.accept(groupId, groupName, courseId);
  }
}

async declineTutee(groupId: number, courseName: string) {
  const visibility = this.groupVisibility[groupId];
  if (visibility) {
    visibility.isVisible = !visibility.isVisible;
  }
  // CourseName get the complementary ID
  let course = this.courses().find(course => courseName === course.name);
  let courseId = course?.id;

  // GroupId get the complementary name
  let group = this.groups().find(group => groupId === group.id);
  let groupName = group?.groupname

  // Send PUT request
  if (courseId !== undefined && groupName !== undefined) {
    await this.pairingdata.decline(groupId, groupName, courseId);
  }
}

}
