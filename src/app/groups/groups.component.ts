import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-groups',
  imports: [FormsModule],
  templateUrl: './groups.component.html',
  styleUrl: './groups.component.css'
})
export class GroupsComponent {
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
}
