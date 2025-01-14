import { Injectable, signal } from '@angular/core';
import {Class} from '../interfaces/class'

@Injectable({
  providedIn: 'root'
})
export class ClassdataService {
private apiurl: string = 'http://127.0.0.1:8000/api/classes'
classes = signal<Class[]>([]);
  constructor() { }

  async loadClasses(){
    const response = await fetch(this.apiurl);
    const classes = await response.json();
    if(classes){
      this.classes.set(classes);
    }
  }
}
