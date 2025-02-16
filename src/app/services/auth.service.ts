import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private router: Router) {}

  // Obtener el token almacenado
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Obtener el rol del usuario
  getUserRole(): string | null {
    const token = this.getToken()
    if(token != null){
      const helper = new JwtHelperService();
      const decodedToken = helper.decodeToken(token);
      const rol = decodedToken.data.rol;
      return rol
    }
    else{
      return "El token es null"
    }
  }

  // Verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }

    // Verificar expiración del token (opcional si el backend no maneja exp en el token)
    return true;
  }

  isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1])); // Decodificar el JWT
      return payload.exp * 1000 < Date.now(); // Comparar fecha de expiración
    } catch (e) {
      return true;
    }
  }

  // Agregar token a las peticiones HTTP
  getAuthHeaders() {
    const token = this.getToken();
    return token ? { headers: new HttpHeaders({ 'Authorization': `Bearer ${token}` }) } : {};
  }

  // Cerrar sesión
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    this.router.navigate(['/login']);
  }
}
