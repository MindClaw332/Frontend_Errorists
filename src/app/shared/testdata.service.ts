import { Injectable, signal } from '@angular/core';
import { Test } from '../interfaces/test'

@Injectable({
  providedIn: 'root'
})
export class TestdataService {
  private apiurl: string = 'http://127.0.0.1:8000/api/tests';
  tests = signal<Test[]>([]);

  constructor() { }

  async loadTests() {
    const response = await fetch(this.apiurl);
    const tests = await response.json();
    if (tests) {
      this.tests.set(tests);
    }
  }

  async addTest(vak: number,testName: string, maxScore: number, hours: number, )
  {
    const testdata = {
      "course_id": vak,
      "name": testName,
      "maxvalue": maxScore,
      "hours": hours,
    }
    try {
      const response = await fetch(`${this.apiurl}`, {
        method: "POST",
        headers:{
          "content-type":"application/json",
        },
        body: JSON.stringify(testdata),
      })
      const result = await response.json();
      return result;
      
    } catch (error) {
      console.error('error registering test', error);
      throw error;
    }
  }
  }

