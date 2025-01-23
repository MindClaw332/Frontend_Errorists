import { Component, inject, signal, ChangeDetectorRef, OnInit, ViewChild, forwardRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CoursedataService } from '../shared/coursedata.service';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CommonModule } from '@angular/common';
import { CalendarOptions, Calendar, EventClickArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { DateClickArg, EventDragStopArg } from '@fullcalendar/interaction';
import { FullCalendarComponent } from '@fullcalendar/angular';

@Component({
  selector: 'app-groups',
  imports: [FormsModule, FullCalendarModule, CommonModule],
  templateUrl: './groups.component.html',
  styleUrl: './groups.component.css'
})
export class GroupsComponent {
private coursedata = inject(CoursedataService);

courses = this.coursedata.courses

constructor () {
  this.coursedata.loadCourses();
}
  
  isRequestMod= false;
  selectedSubject ='';

  groups= [
    {id: 1, name:"History",},
    {id:2, name:"Math"},
    {id:3, name:"Dutch"}
  ]

  toggleRequestMod()
  {
    this.isRequestMod = !this.isRequestMod;
  }

  submitRequest()
  {
    //dit is voor het acepteren van bijles
    console.log('Request tutoring for:', this.selectedSubject);
    this.isRequestMod = false;
    this.selectedSubject = '';
  }

  canncelRequest()
  {
    this.isRequestMod = false;
    this.selectedSubject = '';
  }


// On load
ngOnInit() {
  // Initialize visibility for all groups
  this.groups.forEach(group => {
    this.groupVisibility[group.id] = {
      isHidden: true,  // Initial state: true
      isVisible: false // Initial state: false
    };
    this.calendar[group.id] = {
      hidden: true
    }
  });
}

// Removes/returns the request tutoring button
requestingTutor () {
  this.requestTutor = !this.requestTutor;
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
