import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavbarService {
  public user = new Subject<boolean>()
  public $user = this.user as Observable<boolean>
  constructor() { }

  hasChanges(value: boolean = true) {
    this.user.next(value)
  }
}
