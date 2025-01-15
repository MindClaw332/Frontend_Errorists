import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { StudentsComponent } from "./students/students.component";
import {TeacherComponent} from "./teacher/teacher.component"


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, StudentsComponent, TeacherComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontend_erorrists';
}
