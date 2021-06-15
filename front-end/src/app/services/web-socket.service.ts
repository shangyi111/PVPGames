import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  socket: any;
  readonly url: string = "ws://localhost:3000";
  constructor() {
    this.socket = io(this.url);
  }

  listen(eventName:string) {
    return new Observable((subscriber) => {
      this.socket.on(eventName, (data) => {
        subscriber.next(data);
      })
    });
  }

  emit(eventName: string,data:any) {
    if (eventName === 'updatePlayerList') {
      console.log(data);
    }
    this.socket.emit(eventName, data);
  }
  
}
