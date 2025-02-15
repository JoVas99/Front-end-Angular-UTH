import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { EstudianteComponent } from './estudiante/estudiante.component';
import { RegisterComponent } from './register/register.component';

export const routes: Routes = [
  { path:'register',component: RegisterComponent },
  { path:'estudiante',component: EstudianteComponent },
  { path:'login',component: LoginComponent },
  { path: '**', redirectTo: '/login', pathMatch: 'full' }
];
