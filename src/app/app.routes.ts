import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { GroupsComponent } from './groups/groups.component';
import { PointsComponent } from './points/points.component';
import { StudentsComponent } from './students/students.component';
import { TeacherComponent } from './teacher/teacher.component';
import { AuthGuard } from './guards/auth.guard';
import { teacherGuard } from './guards/teacher.guard';
import { adminGuard } from './guards/admin.guard';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { BatchaddComponent} from './batchadd/batchadd.component'

export const routes: Routes = [

    {
        path: 'points',
        component: PointsComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'unauthorized',
        component: UnauthorizedComponent,
    },
    {
        path: 'students/:id',
        component: StudentsComponent,
        canActivate: [AuthGuard],
    },
    {
        path: 'groups/:id',
        component: GroupsComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'dashboard',
        component: TeacherComponent,
        canActivate: [AuthGuard, teacherGuard],
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'admin',
        component: BatchaddComponent,
        canActivate: [AuthGuard, adminGuard]
    },

    {
        path: '',
        redirectTo: '/login',
        pathMatch: 'full'
    },
    {
        path: '**',
        component: UnauthorizedComponent
    }

];
