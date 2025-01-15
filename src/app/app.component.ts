import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { StudentsComponent } from "./students/students.component";
import {TeacherComponent} from "./teacher/teacher.component"
import { MichTestComponent } from './mich-test/mich-test.component';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, StudentsComponent, TeacherComponent,MichTestComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontend_erorrists';
}
