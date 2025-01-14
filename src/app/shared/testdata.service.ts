import { Injectable, signal } from '@angular/core';
import { Test } from '../interfaces/test'

@Injectable({
  providedIn: 'root'
})
export class TestdataService {
  private apiurl: string = 'http://127.0.0.1:8000/api/tests';
  tests = signal<Test[]>([]);

  constructor() { }

  async loadUsers() {
    const response = await fetch(this.apiurl);
    const tests = await response.json();
    if (tests) {
      this.tests.set(tests);
    }
  }
}
