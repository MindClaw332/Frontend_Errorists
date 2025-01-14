import { Injectable, signal } from '@angular/core';
import {Group} from '../interfaces/group'

@Injectable({
  providedIn: 'root'
})
export class StudentdataService {

  private apiurl: string = 'http://127.0.0.1:8000/api/groups';
  groups = signal<Group[]>([]);

  constructor(){}

  async loadGroups(){
    const response = await fetch(this.apiurl);
    const groups = await response.json();
    if (groups){
      this.groups.set(groups);
    }
  }
}