import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { BACKEND_SERVER } from 'src/constants';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  constructor(private socket: Socket) { }

  on(event: string, callback: Function): void {
    this.socket.fromEvent<any>(event).subscribe((data) => callback(data));
  }

  emit(event: string, data: any): void {
    this.socket.emit(event, data);
  }
}
