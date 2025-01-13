import { Component } from '@angular/core';

@Component({
  selector: 'app-teacher',
  imports: [],
  templateUrl: './teacher.component.html',
  styleUrl: './teacher.component.css'
})
export class TeacherComponent {

isHidden = true;
isVisible = false;
  
viewStudents () {
  this.isHidden = !this.isHidden;
  this.isVisible = ! this.isVisible;
}
  
viewClasses () {
  this.isHidden = !this.isHidden;
  this.isVisible = ! this.isVisible;
}

}
