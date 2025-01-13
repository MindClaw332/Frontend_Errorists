import { Component } from '@angular/core';

@Component({
  selector: 'app-points',
  imports: [],
  templateUrl: './points.component.html',
  styleUrl: './points.component.css'
})
export class PointsComponent {

isHidden = true;
isVisible = false;

viewPoints () {
  this.isHidden = !this.isHidden;
  this.isVisible = ! this.isVisible;
}

viewTests () {
  this.isHidden = !this.isHidden;
  this.isVisible = ! this.isVisible;
}

}
