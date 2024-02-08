import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { storageData, strkey } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private storageData = new BehaviorSubject<storageData>({
    id: 0,
    roleId: 0,
    userId:0,
    token: ''
  });
  storageData$ = this.storageData.asObservable();
  private storageKey = 'anis-reservation'

  createStorage(data: storageData) {
    localStorage.setItem(this.storageKey, JSON.stringify(data))
    this.storageData.next(data);
  }

  loadStorage() {
    const readData = localStorage.getItem(this.storageKey)
    if(readData) {
      let data: any = JSON.parse(readData)
      const keys = Object.keys(this.storageData.getValue())
      const copyStorage = {...this.storageData.getValue()} as {[key:string]:string | number}
      for (let index = 0; index < keys.length; index++) {
        if(data[keys[index]]){
          delete copyStorage[keys[index]]
        }
      }
      if(Object.keys(copyStorage).length === 0) {
        this.storageData.next(data as storageData);
        return true
      }
    }
    return false
  }

  getToken() {
    return this.storageData.getValue().token
  }

  getData() {
    return this.storageData.getValue()
  }

  refreshToken(token: string) {
    const data = {...this.getData()}
    data.token = token
    this.createStorage(data)
  }

  removeStorage() {
    try {
      localStorage.removeItem(this.storageKey)
      return true
    } catch(err) {
      console.error(err)
      return false
    }
  }
}
