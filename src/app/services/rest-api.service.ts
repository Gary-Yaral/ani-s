import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RestApiService {

  constructor(private http: HttpClient) { }

  // Método POST con token en cabecera
  public postAuth(url: string, body: {username: string, password: string}): Observable<any> {
    return this.http.post(url, body);
  }

  // Método GET con token en cabecera
  public get(url: string, token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get(url, { headers });
  }

  // Método POST con token en cabecera
  public post(url: string, body: any, token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.post(url, body, { headers });
  }

  // Método PUT con token en cabecera
  public put(url: string, body: any, token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.put(url, body, { headers });
  }

  // Método DELETE con token en cabecera
  public delete(url: string, token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.delete(url, { headers });
  }
}
