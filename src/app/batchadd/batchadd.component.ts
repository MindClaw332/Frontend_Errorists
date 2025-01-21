import { Component, inject, numberAttribute } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoginService } from '../login.service';
import { ClassdataService } from '../shared/classdata.service';
import { first } from 'rxjs';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-batchadd',
  imports: [],
  templateUrl: './batchadd.component.html',
  styleUrl: './batchadd.component.css'
})
export class BatchaddComponent {

private registrationdata = inject(LoginService);
private classdata = inject(ClassdataService);

//signals
registration = this.registrationdata.registration;
classes = this.classdata.classes;

//constructor
constructor(private router :Router)
{
  this.classdata.loadClasses();
  
}

//visibility
isHidden = true;
isVisible = false;

//for vieuwing classes
viewClasses()
{
  this.isHidden = !this.isHidden;
  this.isVisible = !this.isVisible;
}

//fillter class array for needed classes
selectedClass: {id: number; name:string} | null = null;

selectClass(classItem:{id:number; name:string}): void{
  this.selectedClass = classItem;
}

//function to add users to the data base 
addUser(firstName: string,lastName: string,password: string, klas:number, email: string,role: number)
{
  const user = {
    firstName,
    lastName,
    email, 
    password,
    klas,
    role,
  };
  
}
}
