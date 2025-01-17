import { Component } from '@angular/core';
import { BatchaddComponent } from "./batchadd/batchadd.component";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [BatchaddComponent]
})
export class AppComponent {
  title = 'frontend_erorrists';
}
