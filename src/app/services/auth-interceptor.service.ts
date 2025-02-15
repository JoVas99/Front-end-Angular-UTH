import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    //obtener el token del localStorage
    const authToken = localStorage.getItem('token');

    //Clonar la solicitud y agregar el token de autorizacion en la cabecera
    if(authToken){
      const authReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${authToken}`)
      });
      return next.handle(authReq);
    }

    //Si no hay token, proceder con la solicitud original
    return next.handle(req);
  }
}

