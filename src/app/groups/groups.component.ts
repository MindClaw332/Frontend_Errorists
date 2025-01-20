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
  subjects = ['History', 'Math', 'Dutch', 'English'];

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

  calendarOptions?: CalendarOptions;
  eventsModel: any;
  @ViewChild('fullcalendar') fullcalendar?: FullCalendarComponent;

  ngOnInit() {
    // need for load calendar bundle first
    forwardRef(() => Calendar);

    this.calendarOptions = {
      plugins: [dayGridPlugin, interactionPlugin],
      editable: true,
      customButtons: {
        myCustomButton: {
          text: 'custom!',
          click: function () {
            alert('clicked the custom button!');
          }
        }
      },
      headerToolbar: {
        left: 'prev,next today myCustomButton',
        center: 'title',
        right: 'dayGridMonth'
      },
      dateClick: this.handleDateClick.bind(this),
      eventClick: this.handleEventClick.bind(this),
      eventDragStop: this.handleEventDragStop.bind(this)
    };
  }

  handleDateClick(arg: DateClickArg) {
    console.log(arg);
  }

  handleEventClick(arg: EventClickArg) {
    console.log(arg);
  }

  handleEventDragStop(arg: EventDragStopArg) {
    console.log(arg);
  }

  updateHeader() {
    this.calendarOptions!.headerToolbar = {
      left: 'prev,next myCustomButton',
      center: 'title',
      right: ''
    };
  }

  updateEvents() {
    const nowDate = new Date();
    const yearMonth = nowDate.getUTCFullYear() + '-' + (nowDate.getUTCMonth() + 1);

    this.calendarOptions!.events = [{
      title: 'Updated Event',
      start: yearMonth + '-08',
      end: yearMonth + '-10'
    }];
  }
}
