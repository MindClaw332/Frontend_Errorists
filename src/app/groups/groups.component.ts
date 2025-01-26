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
private routeSub!: Subscription;

courses = this.coursedata.courses;
student = this.studentdata.specificstudent();
pairing = this.pairingdata;

id: number = 1;

constructor (private route: ActivatedRoute) {
  this.coursedata.loadCourses();
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
async ngOnInit() {
  console.log(this.id, 'begin init');
  this.routeSub = this.route.params.subscribe(params => {
      this.id = params['id'];
      console.log(this.id, 'na sub');
  })
  await this.studentdata.loadStudent(this.id);
  console.log(this.student, 'students na load');
  this.student = this.studentdata.specificstudent();
  console.log(this.student, 'test');

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
  saveTutoringDate (groupId: number) {
    if (this.saveDay === null){
      return;
    }
    console.log(`gekozen dag: ${this.saveDay}, groep-id: ${groupId}`);
    this.calendar[groupId].hidden = !this.calendar[groupId].hidden;
    this.groupVisibility[groupId].isHidden = !this.groupVisibility[groupId].isHidden;
    this.requestTutor = !this.requestTutor;
  }

  // Needs: method for cancel button that closes the calendar + reset calendar
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


// Needs: Accept the request for a tutor (when group logic in order)
// Removes the accept/decline buttons and shows the calendar button
groupVisibility: { [key: number]: { isHidden: boolean; isVisible: boolean } } = {};

acceptTutee(groupId: number): void {
  const visibility = this.groupVisibility[groupId];
  if (visibility) {
    visibility.isHidden = !visibility.isHidden;
    visibility.isVisible = !visibility.isVisible;
  }
}

}
