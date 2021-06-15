import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { WebSocketService } from './web-socket.service';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  constructor(private apiService:ApiService,
              private webSocketService:WebSocketService) { }
  getRooms(){
    this.apiService.getTypeRequest('/user/tic-tac-toe/rooms/mysql')
      .subscribe((res:any)=>{
        this.webSocketService.emit("updateRoomsDb",res)
      })
  }
  leaveRoom(roomId,user){
    this.updateUsersMsgsMySql(roomId,user,`${user} leaves room ${roomId}.`,"delete");
    this.webSocketService.emit('leave', {room:roomId});
  }
  enterRoom(roomId,user){
    this.webSocketService.emit('join', {room:roomId});
    this.updateUsersMsgsMySql(roomId,user,`${user} enters room ${roomId}.`,"add");
  }
  updateUsersMsgsMySql(roomId:any,user:any,msg:any,addOrDelete:any){
    let path = `/user/tic-tac-toe/${roomId}/msgs-users/mysql`
    this.apiService.postTypeRequest(path,{
        user,
        msg,
        addOrDelete
    }).subscribe((res:any)=>{
      this.getRooms()
      this.webSocketService.emit('updateRoom',{
        msgs:res.msgs,
        users:res.users,
        room:roomId
      });
    })
  }
              

} 
