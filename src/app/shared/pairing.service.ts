import { Injectable, signal } from '@angular/core';
import { Pairinggroup } from '../interfaces/pairinggroup';
import { Pairinguser } from '../interfaces/pairinguser';

@Injectable({
  providedIn: 'root'
})
export class PairingService {
  averagePerUserArray = signal<any[]>([]);
  chosentutor = signal<any>(null);
  loggedUser = JSON.parse(sessionStorage.getItem("user")!)
  private apiurl: string = "http://127.0.0.1:8000/api"
  constructor() { }

  setLoggedUser(){
    this.loggedUser = JSON.parse(sessionStorage.getItem("user")!)
  }

  async loadAverages(course_id: number) {
    const response = await fetch(`${this.apiurl}/pairingusers/${course_id}`);
    const averages = await response.json();
    if (averages) {
      this.averagePerUserArray.set(averages);
    }
  }
//#region pairing
  async pairUser(requestedCourse_id: number, proposedCourse_id: number) {
    // this has to be finished before accessing the signal
    await this.loadAverages(requestedCourse_id);
    // get the current_user data without extra api call
    const user = this.averagePerUserArray().find(element => element.id === this.loggedUser.user_id);
    // immediately filter out people who are not weighted enough or below in years
    const filteredUsersPerWeight = this.averagePerUserArray().filter(element => element.weight >= user.weight && element.year >= user.year); //add year filter back

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
    // get all keys sort them then reverse to get highest first
    const brackets = Object.keys(groupedAverages).sort().reverse();
    const potentialTutors: Pairinguser[] = [];
    const backupTutors: Pairinguser[] = [];
    // loop through all brackets
    outerloop: for (let i = 0; i < brackets.length; i++) {
      let currentkey: number = parseInt(brackets[i]);
      // loop through values withing the bracket
      for (let j = 0; j < groupedAverages[currentkey].length; j++) {
        const groupsArray: Array<Pairinggroup> = groupedAverages[currentkey][j].groups;
        // check if they have groups
        if (groupsArray.length > 0) {
          //check for open groups
          if (groupsArray.some(group => group?.status === 'PENDING' || group.status === 'ACCEPTED')) {
            backupTutors.push(groupedAverages[currentkey][j]);
            // if they have declined groups check if we are in / if we are and its been longer than 15 days count them otherwise dont
            // this stops us from getting the same person everytime
          } else if (groupsArray.some(group => group?.status === 'DECLINED')) {
            const declinedGroups = groupsArray.filter(group => group.status === 'DECLINED');
            const myDeclinedGroups = declinedGroups.filter(group => group.user1_id === user.id || group.user2_id === user.id);
            if (myDeclinedGroups.length > 0) {
              for (let k = 0; k < myDeclinedGroups.length; k++) {
                if (this.calculateCurrentDateDiff(myDeclinedGroups[k].declined_at!) > 15) {
                  potentialTutors.push(groupedAverages[currentkey][j]);
                } else {
                  return;
                }
              }
            }

          }
          // do we have 5 potentials stop looping
        } else if (potentialTutors.length < 5) {
          potentialTutors.push(groupedAverages[currentkey][j]);
        } else {
          break outerloop;
        }
      }
    } // when we dont actually find 5 potentials fill the potentials with backups
    if (potentialTutors.length < 5 && backupTutors.length > 0) {
      while (potentialTutors.length < 5 && backupTutors.length > 0) {
        const tutor: Pairinguser = backupTutors.shift()!;
        potentialTutors.push(tutor);
      }
    }
    // load the averages and feed them to choosetutor
    await this.loadAverages(proposedCourse_id);
    await this.chooseTutor(potentialTutors, proposedCourse_id);
    const groupId = await this.postGroup(requestedCourse_id, user.firstname);
    await this.PostTutee(parseInt(groupId), parseInt(user.id));
    await this.PostTutor(parseInt(groupId), parseInt(this.chosentutor().id));


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
  // get the averages of all the potentialtutors then sort them and get the person with the lowest score
  chooseTutor(tutors: Array<Pairinguser>, proposedCourse_id: number) {
    const users: Pairinguser[] = this.averagePerUserArray();
    const filteredtutors: Pairinguser[] = [];
    for (let i = 0; i < tutors.length; i++) {
      const u_id: number = tutors[i].id;
      filteredtutors.push(users.find(element => element.id === u_id)!);
    }
    const sortedusers = filteredtutors.sort((a, b) => b.average - a.average);
    this.chosentutor.set(sortedusers[0])
  }
//#endregion
  //test function you can call to test the service
  async test() {
    this.pairUser(1, 2);
  }
//#region DateFunctions
  // gets the currentdate and converts it to a datestring
  getDate() {
    // get date
    const date = new Date(Date.now());
    const year = date.getFullYear();
    // get month and day and add a leading 0
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    // return the actual date
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
  }

   // gets a date and converts it to a datestring
   dateToString(chosenDate: Date) {
    const year = chosenDate.getFullYear();
    // get month and day and add a leading 0
    const month = String(chosenDate.getMonth() + 1).padStart(2, '0');
    const day = String(chosenDate.getDate()).padStart(2, '0');
    // return the actual date
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
  }

  // gives the difference between now and a yyyy-mm-dd datestring
  calculateCurrentDateDiff(datePast: string) {
    //calculate a day in ms becouse gettime give milliseconds
    // 1000ms in a second/ 60 seconds in a minuit/ 60 minutes in an hour/ 24hours in a day
    let dayInMs = 1000 * 60 * 60 * 24;
    let currentDate = this.stringToDate(this.getDate());
    let pastDate = this.stringToDate(datePast);
    // devide time diff by these days to get the amount of days
    let result: number = Math.round((currentDate.getTime() - pastDate.getTime()) / dayInMs)
    let finalResult: number = parseInt(result.toFixed(0));

    return finalResult;
  }

  // gives database datestring back as a utc 0000 date
  stringToDate(dateString: string) {
    const timeString: string = 'T00:00:00'
    const date = new Date(dateString + timeString);
    return date;
  }
  //#endregion
//#region posts
  async postGroup(course_id: number, user_name: string) {
    const groupdata = {
      "name": `${user_name}-${this.chosentutor().firstname}`,
      "course_id": course_id,
      "status": "PENDING",
      "date": null,
      "accepted_at": null,
      "declined_at": null
    }
    try {
      const response = await fetch(`${this.apiurl}/groups`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(groupdata),
      })
      const result = await response.json();
      return result.id;
    } catch (error) {
      console.error('error posting group', error);
      throw error;
    }
  }

  async PostTutee(group_id: number, user_id: number) {
    const groupTutee = {
      "group_id": group_id,
      "user_id": user_id,
      "tutor": 0
    }

    try {
      const response = await fetch(`${this.apiurl}/group-user`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(groupTutee),
      })
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('error posting group', error);
      throw error;
    }
  }

  async PostTutor(group_id: number, user_id: number) {
    const groupTutor = {
      "group_id": group_id,
      "user_id": user_id,
      "tutor": 1
    }

    try {
      const response = await fetch(`${this.apiurl}/group-user`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(groupTutor),
      })
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('error posting group', error);
      throw error;
    }
  }

  async accept(group_id: number, group_name: string, course_id: number) {
    const groupdata = {
      "name": group_name,
      "course_id": course_id,
      "status": "ACCEPTED",
      "date": null,
      "accepted_at": this.getDate(),
      "declined_at": null
    }
    try {
      const response = await fetch(`${this.apiurl}/groups/${group_id}`, {
        method: "PUT",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(groupdata),
      })
      const result = await response.json();
      return result.id;
    } catch (error) {
      console.error('error posting group', error);
      throw error;
    }
  }

  async decline(group_id: number, group_name: string, course_id: number) {
    const groupdata = {
      "name": group_name,
      "course_id": course_id,
      "status": "DECLINED",
      "date": null,
      "accepted_at": null,
      "declined_at": this.getDate()
    }
    try {
      const response = await fetch(`${this.apiurl}/groups/${group_id}`, {
        method: "PUT",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(groupdata),
      })
      const result = await response.json();
      return result.id;
    } catch (error) {
      console.error('error posting group', error);
      throw error;
    }
  }

  async acceptDate(group_id: number, group_name: string, course_id: number, date: string) {
    const groupdata = {
      "name": group_name,
      "course_id": course_id,
      "status": "ACCEPTED",
      "date": date,
      "accepted_at": null,
      "declined_at": null
    }
    try {
      const response = await fetch(`${this.apiurl}/groups/${group_id}`, {
        method: "PUT",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(groupdata),
      })
      const result = await response.json();
      return result.id;
    } catch (error) {
      console.error('error posting group', error);
      throw error;
    }
  }

  async finish(group_id: number, username: string, tutorName: string, course_id: number, date: string) {
    const groupdata = {
      "name": `${username}-${tutorName}`,
      "course_id": course_id,
      "status": "FINISHED",
      "date": date,
      "accepted_at": null,
      "declined_at": null
    }
    try {
      const response = await fetch(`${this.apiurl}/groups/${group_id}`, {
        method: "PUT",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(groupdata),
      })
      const result = await response.json();
      return result.id;
    } catch (error) {
      console.error('error posting group', error);
      throw error;
    }
  }
//#endregion
}


