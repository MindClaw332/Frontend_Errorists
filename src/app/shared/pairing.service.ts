import { inject, Injectable, signal } from '@angular/core';
import { LoginService } from '../login.service';

@Injectable({
  providedIn: 'root'
})
export class PairingService {
  averagePerUserArray = signal<any[]>([]);
  private auth = inject(LoginService)
  user = this.auth.currentuser();
  private apiurl: string = "http://127.0.0.1:8000/api/pairingusers/"
  constructor() {}

  async loadAverages(course_id: number) {
    const response = await fetch(`${this.apiurl}${course_id}`);
    const averages = await response.json();
    if (averages) {
      this.averagePerUserArray.set(averages);
      console.log(this.averagePerUserArray());
    }
  }

  async pairUser(requestedCourse_id: number, proposedCourse_id: number) {
    // this has to be finished before accessing the signal
    await this.loadAverages(requestedCourse_id);
    // get the current_user data without extra api call
    const user = this.averagePerUserArray().filter(element => element.id === this.auth.currentuser().user_id);
    console.log(user)
    // immediately filter out people who are not weighted enough or below in years
    const filteredUsersPerWeight = this.averagePerUserArray().filter(element => element.weight >= user[0].weight && element.year >= user[0].year);
    
    // const filteredUsersPerYear= filteredUsersPerWeight.filter(element => element.year >= user[0].year)// group averages in a bracket we can search through
    const groupedAverages = filteredUsersPerWeight.reduce((groupedPerPercent, averageForUser) => {
      const averageResult = averageForUser.average;
      // calls the decidebracket function
      let resultBracket = this.decideBracket(averageResult);
      // if there is no match for the resultbracket create it
      if (groupedPerPercent[resultBracket] == null) groupedPerPercent[resultBracket] = [];
      // push the object at this bracket
      groupedPerPercent[resultBracket].push(averageForUser);
      return groupedPerPercent;
    }, {});

    const brackets = Object.keys(groupedAverages).sort().reverse();
    console.log(groupedAverages[brackets[0]], 'should show 90 bracket')
    const potentialTutors = [];
    for (let i = 0; i < brackets.length; i++){
      let currentkey: number = parseInt(brackets[i]);
      console.log(brackets[i], 'de key waar we door loopen')
      for (let j = 0; j < groupedAverages[currentkey].length; j++){
        console.log(groupedAverages[currentkey][j])
      }
    }

    console.log(groupedAverages)
    console.log(brackets)
    // checklist:
    // filter out everybody who is a lower year than the user ✓
    // filter out everybody who has a lower weight than user ✓
    // example: if i have a weight of 5 hours i cant get tutoring from somebody who has 4 hours ✓
    // check inside bracket highest bracket first 
    // -> if there is someone 
    // -> is there someone with a higher year?
    // -> do they have groups that are pending or accepted? 
    // -> yes check the next
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
    this.pairUser(1,2); 
  }
}

