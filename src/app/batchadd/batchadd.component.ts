import { Component, numberAttribute } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { last } from 'rxjs';

@Component({
  selector: 'app-batchadd',
  imports: [],
  templateUrl: './batchadd.component.html',
  styleUrl: './batchadd.component.css'
})
export class BatchaddComponent {

addUser(firstName: string,lastName: string,password: string, email: string,role: number)
{
let userInfo: string[] = [firstName, lastName,password, email, role.toString()]
console.log(userInfo)
}

}
