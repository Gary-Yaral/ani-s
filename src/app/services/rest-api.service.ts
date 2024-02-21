import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RestApiService {
  constructor(
    private http: HttpClient,
  ) {}

  // Método POST con token en cabecera
  public postAuth(url: string, body: {username: string, password: string}): Observable<any> {
    return this.http.post(url, body);
  }

  // Método GET con token en cabecera
  public get(url: string, data: any = {}): Observable<any> {
    let params = new HttpParams();
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        params = params.append(key, data[key]);
      }
    }
    return this.http.get(url, { params });
  }

  // Método POST con token en cabecera
  public post(url: string, body: any): Observable<any> {
    return this.http.post(url, body);
  }

  // Método PUT con token en cabecera
  public put(url: string, body: any): Observable<any> {
    return this.http.put(url, body);
  }

  // Método DELETE con token en cabecera
  public delete(url: string): Observable<any> {
    return this.http.delete(url);
  }

  public handleError(error: HttpErrorResponse) {
    let errorMessage: any = 'Error desconocido'

    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: Código ${error.status}`
    } else {
      // Error del lado del servidor
      errorMessage = {code: error.status, error: error.error.error};
    }
    return throwError(errorMessage);
  }
}
