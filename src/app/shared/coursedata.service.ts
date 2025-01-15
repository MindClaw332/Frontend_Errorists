import { Injectable, signal } from '@angular/core';
import {Course} from '../interfaces/course'

@Injectable({
  providedIn: 'root'
})
export class CoursedataService {
  private apiurl: string = 'http://127.0.0.1:8000/api/courses';
  courses = signal<Course[]>([]);

  constructor() { }

  async loadCourses(){
    const response = await fetch(this.apiurl);
    const courses = await response.json();
    if(courses){
      this.courses.set(courses);
    }
  }
}
