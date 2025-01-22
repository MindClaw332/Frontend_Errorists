import { Component, inject, numberAttribute } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoginService } from '../login.service';
import { ClassdataService } from '../shared/classdata.service';
import { first } from 'rxjs';
import { Route, Router } from '@angular/router';
import { Class } from '../interfaces/class';

@Component({
  selector: 'app-batchadd',
  imports: [FormsModule],
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
async initializeClasses() {
  await this.classdata.loadClasses();
}

getClasses(): Class[]{
  return this.classes() || [];
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
async addUser(firstName: string,lastName: string,password: string, klas:number|null, email: string,role: number)
{
  try{
    const result = await this.registrationdata.registration(
      firstName,
      lastName, 
      email,
      password,
      role,
      klas
    );
    console.log('Gebruiker aangemaakt', result);
  }
  catch (error)
  {
    console.error('Er is een probleem met het aanmaken van gebruikers', error);
  }
}
}
