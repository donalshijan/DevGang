import { Routes } from '@angular/router';
import { NotFoundComponent } from './core/not-found/not-found.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { LoginComponent } from './core/login/login.component';
import { SignupComponent } from './core/signup/signup.component';
import { DashboardComponent } from './feature/dashboard/dashboard.component';
import { AuthChildGuard } from './core/auth-child.guard';
import { AuthGuard } from './core/auth.guard';
import { CreateProjectComponent } from './feature/create-project/create-project.component';
export const routes: Routes = [
    { path: 'createproject', component: CreateProjectComponent},
    { path: '', 
    component: MainLayoutComponent,
    children:[
        { path: 'login', component: LoginComponent },
        { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
        // { path: 'dashboard', component: DashboardComponent, canActivateChild: [AuthChildGuard], canActivate: [AuthGuard] },
        { path: 'dashboard', component: DashboardComponent },
        { path: 'signup', component: SignupComponent },
        { path: '404', component: NotFoundComponent},
        { path: '**', redirectTo: '/404' }
    ],
    }
];
