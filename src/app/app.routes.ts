import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { GroupsComponent } from './groups/groups.component';
import { PointsComponent } from './points/points.component';
import { StudentsComponent } from './students/students.component';
import { TeacherComponent } from './teacher/teacher.component';
import { AuthGuard } from './guards/auth.guard';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';

export const routes: Routes = [

    { path: 'groups', component: GroupsComponent },
    { path: 'points', component: PointsComponent },
    { path: 'unauthorized', component:UnauthorizedComponent },
    {
        path: 'students',
        component: StudentsComponent,
        canActivate: [AuthGuard],
    },
    { path: 'dashboard', component: TeacherComponent },
    { path: 'login', component: LoginComponent },
    { path: '', redirectTo: '/login', pathMatch: 'full' },

];
