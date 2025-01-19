import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { GroupsComponent } from './groups/groups.component';
import { PointsComponent } from './points/points.component';
import { StudentsComponent } from './students/students.component';
import { TeacherComponent } from './teacher/teacher.component';

export const routes: Routes = [
    {path: 'login', component: LoginComponent},
    {path: 'groups', component:GroupsComponent},
    {path: 'points', component:PointsComponent},
    {path: 'students', component:StudentsComponent},
    {path: 'dashboard', component:TeacherComponent}
];
