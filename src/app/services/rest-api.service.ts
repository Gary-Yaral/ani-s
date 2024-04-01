 import { HttpClient, HttpHeaders } from '@angular/common/http';
 import { Injectable } from '@angular/core';
 import { Observable, map } from 'rxjs';
 import { StorageData } from '../utilities/storage';
 import { API_PATHS } from 'src/constants';
 import { StorageInfo } from '../interfaces';

 @Injectable({
   providedIn: 'root'
 })
 export class RestApiService {
   constructor( private http: HttpClient ) {}

   // Método POST con token en cabecera
   public postAuth(body: {username: string, password: string}): Observable<any> {
     return this.http.post(API_PATHS.auth, body);
   }

   // Método GET con token en cabecera
   public get(url: string, params: any = {}): Observable<any> {
     return this.http.get(url, {params,  headers: this.getHeaders()})
   }

   // Método POST con token en cabecera
   public post(url: string, body: any, params: any={}): Observable<any> {
     return this.http.post(url, body, {params, headers: this.getHeaders()});
   }

   // Método PUT con token en cabecera
  public put(url: string, body: any, params: any = {}): Observable<any> {
     return this.http.put(url, body, {params, headers: this.getHeaders()});
   }

   // Método DELETE con token en cabecera
  public delete(url: string): Observable<any> {
     return this.http.delete(url, {headers: this.getHeaders()});
   }

  public refreshToken(): Observable<string> {
    return this.http.post<any>(API_PATHS.refreshToken, {}, {headers: this.getRefreshParam()}).pipe(
      map(response => {
        StorageData.set({...StorageData.get(), token: response.token })
        return StorageData.get().token
      })
    );
  }

   getHeaders() {
     const user: StorageInfo = StorageData.get()
     return new HttpHeaders().set('Authorization', `Bearer ${user.token}`)
   }

   getRefreshParam() {
     const user: StorageInfo = StorageData.get()
     return new HttpHeaders().set('Authorization', `Bearer ${user.refreshToken}`)
   }
 }
