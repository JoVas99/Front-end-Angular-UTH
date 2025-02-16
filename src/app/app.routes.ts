import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { EstudianteComponent } from './estudiante/estudiante.component';
import { RegisterComponent } from './register/register.component';
import { ForbiddenComponent } from './pages/forbidden/forbidden.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path:'register',component: RegisterComponent, canActivate:[authGuard], data: {roles:['admin','maestro','director']} },
  { path:'estudiante',component: EstudianteComponent, canActivate:[authGuard], data:{roles:['admin','director']} },
  { path:'login',component: LoginComponent },
  { path: 'forbidden', component: ForbiddenComponent },
  { path: '**', redirectTo: '/login', pathMatch: 'full' }
];
