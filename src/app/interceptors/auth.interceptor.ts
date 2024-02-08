import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { loadStorage } from '../utilities/storageOptions';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private router: Router
  ) {

  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const storage = loadStorage()
    if(!storage.error) {
      if (storage.data.token) {
        // Si hay un token, lo añadimos a la solicitud HTTP
        request = request.clone({
          setHeaders: {
            Authorization: `Bearer ${storage.data.token}`
          }
        });
      }
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Maneja el código de estado 401 aquí
          console.log("Respuesta con código de estado 401 interceptada");
          // Puedes redirigir al usuario a la página de inicio de sesión o mostrar un mensaje de error
        }
        // Propaga el error para que el código que realizó la solicitud original también pueda manejarlo
        return throwError(error);
      })
    );
  }
}
