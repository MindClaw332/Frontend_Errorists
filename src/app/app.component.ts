import { Component } from '@angular/core'
import { PointsComponent } from "./points/points.component";
@Component({
  selector: 'app-root',
  imports: [PointsComponent],

  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontend_erorrists';
}