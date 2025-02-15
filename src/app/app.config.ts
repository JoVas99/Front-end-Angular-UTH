import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withFetch, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
//import { AuthInterceptorService } from './auth-interceptor.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),provideHttpClient(withFetch()),
    //{ provide:HTTP_INTERCEPTORS, useClass:AuthInterceptorService, multi:true }
  ],

};
