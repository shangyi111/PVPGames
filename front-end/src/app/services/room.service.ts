import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  constructor(private apiService:ApiService) { }
  getAllPublicRooms(){
    this.apiService.getTypeRequest('/user/tic-tac-toe/rooms/public')
      .subscribe((res:any)=>{
        return res;
      })
  }
  joinRoom(roomId:any){
    this.apiService.postTypeRequest('/user/tic-tac-toe/rooms/join',{
      roomId
    }).subscribe((res:any)=>{
      return res
    })
  }
  leaveRoom(roomId:any){
    this.apiService.postTypeRequest('/user/tic-tac-toe/rooms/leave',{
      roomId
    }).subscribe((res:any)=>{
      return res
    })
  }
  createAndJoinRoom(roomId:any){
    this.apiService.postTypeRequest('/user/tic-tac-toe/rooms/create',{
      roomId
    }).subscribe((res:any)=>{
      return res
    })
  }
}
