import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService); // Inyectamos el servicio de autenticación
  const router = inject(Router); // Inyectamos el Router para redirigir si es necesario

  const token = authService.getToken(); // Obtener el token del localStorage o donde esté guardado
  if (!token || authService.isTokenExpired(token)) {
    router.navigate(['/login']); // Si no hay token o está vencido, redirigir al login
    return false;
  }

  // Obtener el rol del usuario desde el servicio de autenticación
  const userRole = authService.getUserRole();
  const allowedRoles = route.data?.['roles'] as Array<string>;

  if(userRole != null){
    if (allowedRoles && !allowedRoles.includes(userRole)) {
      router.navigate(['/forbidden']); // Si el usuario no tiene el rol adecuado, redirigir
      return false;
    }
  }

  return true; // Si cumple con los requisitos, permitir la navegación
};
