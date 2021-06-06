import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { WebSocketService } from './web-socket.service';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  constructor(private apiService:ApiService,
              private webSocketService:WebSocketService) { }
  gFakeUsers(){
    let fakeRoomIds=["Hello Kitty","Normal","Loving Cats","Stress Club","Master One","Losers"];
    let fakeNameIds=[0,1,2,3,4,5]
    
    for(let fakeRoomId of fakeRoomIds){
      setTimeout(()=>{
        for(let fakeNameId of fakeNameIds){
          setTimeout(()=>{
            this.enterRoom(fakeRoomId,fakeNameId);
          },3000)
        }
      },3000)
    }
    
    for(let fakeRoomId of fakeRoomIds){
      setTimeout(()=>{
        for(let fakeNameId of fakeNameIds){
          setTimeout(()=>{
            this.leaveRoom(fakeRoomId,fakeNameId);
          },3000)
        }
      },3000)
    }
  }
  getRooms(){
    this.apiService.getTypeRequest('/user/tic-tac-toe/rooms')
      .subscribe((res:any)=>{
        this.webSocketService.emit("updateRoomsDb",res)
      })
  }
  leaveRoom(roomId,user){
    this.updateUsersMsgs(roomId,user,`${user} leaves room ${roomId}.`,"delete");
    this.webSocketService.emit('leave', {room:roomId});
  }
  enterRoom(roomId,user){
    this.webSocketService.emit('join', {roomId});
    this.updateUsersMsgs(roomId,user,`${user} enters room ${roomId}.`,"add");
    // this.refreshBoard();
    // this.refreshWinner();
  }
  updateUsersMsgs(roomId:any,user:any,msg:any,addOrDelete:any){
    let path = `/user/tic-tac-toe/${roomId}/msgs-users`
    this.apiService.postTypeRequest(path,{
        user,
        msg,
        addOrDelete
    }).subscribe((res:any)=>{
      this.getRooms()
      this.webSocketService.emit('updateRoom',{
        msgs:res.msgs,
        usersByRoomId:res.users[roomId],
        roomsMap:res.users,
        room:roomId
      });
    })
  }

} 
