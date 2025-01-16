import { Injectable, signal } from '@angular/core';
import {Testresult} from '../interfaces/testresult'

@Injectable({
  providedIn: 'root'
})
export class ResultdataService {

  private apiurl: string = 'http://127.0.0.1:8000/api';  // Base URL
  results = signal<Testresult[]>([]);
  
  constructor() {}
  
  async loadResults(id: number) {
    const response = await fetch(`${this.apiurl}/test-user/${id}`);
    const results = await response.json();
    if (results) {
      this.results.set(results);
    }
  }
}
