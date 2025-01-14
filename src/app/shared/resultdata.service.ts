import { Injectable, signal } from '@angular/core';
import {Testresult} from '../interfaces/testresult'

@Injectable({
  providedIn: 'root'
})
export class StudentdataService {

  private apiurl: string = 'http://127.0.0.1:8000/api/test-user';
  results = signal<Testresult[]>([]);

  constructor(){}

  async loadResults(id: number){
    const response = await fetch(this.apiurl);
    const results = await response.json();
    if (results){
      this.results.set(results);
    }
  }
}
