import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class RestApiService {
  private token!: string
  constructor(
    private http: HttpClient,
    private storageService: StorageService
  ) {
    this.token = this.storageService.getToken()
   }

  // Método POST con token en cabecera
  public postAuth(url: string, body: {username: string, password: string}): Observable<any> {
    return this.http.post(url, body);
  }

  // Método GET con token en cabecera
  public get(url: string, data: any = {}): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });
    let params = new HttpParams();
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        params = params.append(key, data[key]);
      }
    }

    return this.http.get(url, { headers, params });
  }

  // Método POST con token en cabecera
  public post(url: string, body: any): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });
    return this.http.post(url, body, { headers });
  }

  // Método PUT con token en cabecera
  public put(url: string, body: any): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });
    return this.http.put(url, body, { headers });
  }

  // Método DELETE con token en cabecera
  public delete(url: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });
    return this.http.delete(url, { headers });
  }
}
