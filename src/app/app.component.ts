import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GroupsComponent } from "./groups/groups.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, GroupsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontend_erorrists';
}
