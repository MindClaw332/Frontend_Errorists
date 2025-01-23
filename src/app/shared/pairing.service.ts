import { inject, Injectable, signal } from '@angular/core';
import { LoginService } from '../login.service';
import { elementAt } from 'rxjs';
import { Pairinggroup } from '../interfaces/pairinggroup';
import { Pairinguser } from '../interfaces/pairinguser';

@Injectable({
  providedIn: 'root'
})
export class PairingService {
  averagePerUserArray = signal<any[]>([]);
  chosentutor = signal<any>(null);
  private auth = inject(LoginService)
  user = this.auth.currentuser();
  private apiurl: string = "http://127.0.0.1:8000/api/pairingusers/"
  constructor() { }

  async loadAverages(course_id: number) {
    const response = await fetch(`${this.apiurl}${course_id}`);
    const averages = await response.json();
    console.log(averages, 'array we set')
    if (averages) {
      this.averagePerUserArray.set(averages);
      console.log(this.averagePerUserArray(), "set new array");
    }
  }

  async pairUser(requestedCourse_id: number, proposedCourse_id: number) {
    // this has to be finished before accessing the signal
    await this.loadAverages(requestedCourse_id);
    console.log(this.averagePerUserArray(), 'vergelijk users');
    // get the current_user data without extra api call
    const user = this.averagePerUserArray().find(element => element.id === this.auth.currentuser().user_id);
    console.log(user)
    // immediately filter out people who are not weighted enough or below in years
    const filteredUsersPerWeight = this.averagePerUserArray().filter(element => element.weight >= user.weight); //add year filter back

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
    const potentialTutors: Pairinguser[] = [];
    const backupTutors: Pairinguser[] = []
    outerloop: for (let i = 0; i < brackets.length; i++) {
      let currentkey: number = parseInt(brackets[i]);
      console.log(brackets[i], 'de key waar we door loopen')
      for (let j = 0; j < groupedAverages[currentkey].length; j++) {
        console.log(groupedAverages[currentkey][j]);
        console.log(groupedAverages[currentkey][j].groups.length)
        const groupsArray: Array<Pairinggroup> = groupedAverages[currentkey][j].groups;
        if (groupsArray.length > 0) {
          if (groupsArray.some(group => group?.status === 'PENDING' || group.status === 'ACCEPTED')) {
            console.log('has an open group')
            backupTutors.push(groupedAverages[currentkey][j]);
          }
        } else if (potentialTutors.length < 5) {
          potentialTutors.push(groupedAverages[currentkey][j]);
        } else {
          break outerloop;
        }
      }
    }
    if (potentialTutors.length < 5 && backupTutors.length > 0) {
      while (potentialTutors.length < 5 && backupTutors.length > 0) {
        const tutor: Pairinguser = backupTutors.shift()!;
        potentialTutors.push(tutor);
      }
    }
    await this.loadAverages(proposedCourse_id);
    await this.chooseTutor(potentialTutors, proposedCourse_id);
    console.log(this.chosentutor(), "potential tutor");
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

  chooseTutor(tutors: Array<Pairinguser>, proposedCourse_id: number) {

    const users: Pairinguser[] = this.averagePerUserArray();
    console.log(users, ' choosetutor users')
    const filteredtutors: Pairinguser[] = [];
    for (let i = 0; i < tutors.length; i++) {
      const u_id: number = tutors[i].id;
      filteredtutors.push(users.find(element => element.id === u_id)!);
    }
    const sortedusers = filteredtutors.sort((a, b) => b.average - a.average);
    console.log(sortedusers, "sortedusers")
    this.chosentutor.set(sortedusers[0])
  }
  //test function you can call to test the service
  async test() {
    this.pairUser(1, 2);
  }
}


