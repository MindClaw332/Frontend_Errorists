import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PairingService {
  averagePerUserArray = signal<any[]>([]);
  private apiurl: string = "http://127.0.0.1:8000/api/pairingusers/"
  constructor() { }

  async loadAverages(course_id: number) {
    const response = await fetch(`${this.apiurl}${course_id}`);
    const averages = await response.json();
    if (averages) {
      this.averagePerUserArray.set(averages);
      console.log(this.averagePerUserArray());
    }
  }

  async pairUser(course_id: number) {
    // this has to be finished before accessing the signal
    await this.loadAverages(course_id);
    // group averages in a bracket we can search through
    const groupedAverages = this.averagePerUserArray().reduce((groupedPerPercent, averageForUser) => {
      const averageResult = averageForUser.average;
      // calls the decidebracket function
      let resultBracket = this.decideBracket(averageResult);
      // if there is no match for the resultbracket create it
      if (groupedPerPercent[resultBracket] == null) groupedPerPercent[resultBracket] = [];
      // push the object at this bracket
      groupedPerPercent[resultBracket].push(averageForUser);
      return groupedPerPercent;
    }, {})
    console.log(groupedAverages, 'averages');
  }
  // check in what bracket the result falls
  decideBracket(result: number) {
    if (result >= 90) {
      return 90;
    } else if (result >= 80) {
      return 80;
    } else if (result >= 70) {
      return 70;
    } else if (result >= 60) {
      return 60;
    } else {
      return 50;
    }
  }
  //test function you can call to test the service
  async test() {
    this.pairUser(1);
  }
}

