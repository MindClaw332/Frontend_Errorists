import { Component } from '@angular/core';

@Component({
  selector: 'app-groups',
  imports: [],
  templateUrl: './groups.component.html',
  styleUrl: './groups.component.css'
})
export class GroupsComponent {
  groups= [
    {id: 1, name:"History",},
    {id:2, name:"Math"},
    {id:3, name:"Dutch"}
  ]
}
