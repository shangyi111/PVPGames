import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { RoomService } from 'src/app/services/room.service';
import { WebSocketService } from 'src/app/services/web-socket.service';


@Component({
  selector: 'tic-tac-toe',
  templateUrl: './tic-tac-toe.component.html',
  styleUrls: ['./tic-tac-toe.component.scss']
})
export class TicTacToeComponent{
  
  msgs:any[]=[];
  currentUser:string;
  //updatePlayersList
  cachePlayers: any [] = [];
  //updateBoard
  playerInTurn:any = "";
  board:any = [0,0,0,0,0,0,0,0,0]; 
  rows:any = [0,0,0];
  cols:any = [0,0,0];
  diag:number = 0;
  antiDiag:number = 0;
  //updateWinner
  winner:string="";
  //updateRoom
  roomId: any ;
  isInRoom:boolean=false;
  usersByRoomId:any []=[];
  roomsMap:any=undefined;
  roomsList:any[]=[];


  constructor(private webSocketService:WebSocketService,
              private apiService:ApiService,
              private authService:AuthService){
    this.currentUser = this.authService.getUserDataFromLocalStorage('userData').username;
  
  }
  ngOnInit() {
    this.getRooms();
    // this.roomService.gFakeUsers();
    this.webSocketService
        .listen('updatePlayerList')
        .subscribe((data:any) => {
          this.cachePlayers = data.cachePlayers;
        });
    this.webSocketService
        .listen('updateBoard')
        .subscribe((data:any) => {
          this.board = data.board;
          this.playerInTurn = data.playerInTurn;
          this.antiDiag = data.antiDiag;
          this.diag = data.diag;
          this.rows = data.rows;
          this.cols = data.cols;
        });
    this.webSocketService
        .listen('updateWinner')
        .subscribe((data:any) => {
          this.winner = data.winner;
        });
    this.webSocketService
        .listen('updateRoom')//boardcast to only certain rooms
        .subscribe((data:any) => {
          this.usersByRoomId = data.users;
          this.msgs = data.msgs;
        });
      this.webSocketService
        .listen('updateRoomsDb')//boardcast to all rooms
        .subscribe((data:any) => {
          this.roomsMap = data;
        });

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
        // usersByRoomId:res.users[roomId],
        users:res.users,
        room:this.roomId
      });
    })
  }
  getRooms(){
    this.apiService.getTypeRequest('/user/tic-tac-toe/rooms/mysql')
      .subscribe((res:any)=>{
        this.webSocketService.emit("updateRoomsDb",res)
      })
  }
  leaveRoom(){
    this.isInRoom = false;
    this.unjoin();
    this.updateUsersMsgsMySql(this.roomId,this.currentUser,`${this.currentUser} leaves room ${this.roomId}.`,"delete");
    this.webSocketService.emit('leave', {room:this.roomId});
    this.cachePlayers= [];
  }
  enterRoom(id:any){
    this.isInRoom = true;
    this.roomId = id;
    this.webSocketService.emit('join', {room:this.roomId});
    this.updateUsersMsgsMySql(this.roomId,this.currentUser,`${this.currentUser} enters room ${this.roomId}.`,"add");
    // this.refreshBoard();
    // this.refreshWinner();
  }
  
  checkUser(username){
    let res = true;
    if(this.cachePlayers.length===0) return false;
    for(let e of this.cachePlayers){
      if(e.user===username) return true;
      else res = false;
    }
    return res;
  }
  join(){
    if(this.cachePlayers.includes(this.currentUser)){
      alert("You are already in game");
    }else if(this.cachePlayers.length === 2){
      alert("Queue full, please wait for available seats.")
    }else{
      this.cachePlayers.push({
        user:this.currentUser,
        sign:""
      })
      this.webSocketService.emit('updatePlayerList', {
        cachePlayers:this.cachePlayers,
        room: this.roomId
      });
      if(this.cachePlayers.length===2){
        this.start()
      }
    }
  }
  unjoin(){
    this.cachePlayers = this.cachePlayers.filter(data=>{
      return data.user!==this.currentUser;
    });
    this.webSocketService.emit('updatePlayerList', {
      cachePlayers:this.cachePlayers,
      room: this.roomId});
    this.refreshWinner();
    this.refreshBoard();
  }

  refreshBoard(){
    this.webSocketService.emit('updateBoard',{
      board:new Array(9).fill("").map(a=>""),
      playerInTurn:"",
      rows : [0,0,0],
      cols : [0,0,0],
      diag : 0,
      antiDiag:0,
      room: this.roomId,
    });
  }
  refreshWinner(){
    this.webSocketService.emit('updateWinner',{
      winner:"",
      room: this.roomId,
    });
  }
  start(){
    this.refreshWinner();
    
    this.cachePlayers[0].sign = "X";
    this.cachePlayers[1].sign = "O";
    
    this.webSocketService.emit('updateBoard',{
      board:new Array(9).fill("").map(a=>""),
      playerInTurn:this.currentUser,
      rows : [0,0,0],
      cols : [0,0,0],
      diag : 0,
      antiDiag:0,
      room: this.roomId,
    });
    this.webSocketService.emit('updatePlayerList',{
      cachePlayers:this.cachePlayers,
      room: this.roomId});
  }
  move(id:number){
    if(this.board[id]!==""){
      return;
    }else if(this.playerInTurn!==this.currentUser){
      alert("Not your turn.")
    }else if(this.board[id]==="" && this.playerInTurn===this.currentUser){
      let curRow = Math.floor(id/3);
      let curCol = Math.floor(id%3);
      let currentSign;
      if(this.cachePlayers[0].user===this.currentUser){
        currentSign = this.cachePlayers[0].sign;
        this.playerInTurn = this.cachePlayers[1].user;
      }else{
        currentSign = this.cachePlayers[1].sign;
        this.playerInTurn = this.cachePlayers[0].user;
      }
      this.board[id]=currentSign;

      //update winning criterias(row,col,dia and antiDiag)
      if(curRow===curCol){
        if(currentSign==="X"){
          this.diag++;
        }else if(currentSign==="O"){
          this.diag--;
        }
      }
      if(curRow===(2-curCol)){
        if(currentSign==="X"){
          this.antiDiag++;
        }else if(currentSign==="O"){
          this.antiDiag--;
        }
      }
      if(currentSign==="X"){
        this.rows[curRow]++;
        this.cols[curCol]++;
      }else if(currentSign==="O"){
        this.rows[curRow]--;
        this.cols[curCol]--;
      }
 
      this.webSocketService.emit('updateBoard',{
        board:this.board,
        playerInTurn:this.playerInTurn,
        rows : this.rows,
        cols : this.cols,
        diag : this.diag,
        antiDiag:this.antiDiag,
        room: this.roomId
      });
      if(this.checkWinner(id)){
        this.webSocketService.emit('updateBoard',{
          board:this.board,
          playerInTurn:"",
          rows : this.rows,
          cols : this.cols,
          diag : this.diag,
          antiDiag:this.antiDiag,
          room: this.roomId
        });
        this.webSocketService.emit('updateWinner',{
          winner:this.currentUser,
          room: this.roomId});
      }else if(!this.board.includes("")){
        this.webSocketService.emit('updateWinner',{
          winner:"No one ",
          room: this.roomId});
        this.webSocketService.emit('updateBoard',{
          board:this.board,
          playerInTurn:"",
          rows : this.rows,
          cols : this.cols,
          diag : this.diag,
          antiDiag:this.antiDiag,
          room: this.roomId
        });
      }
    }else{
      alert("The game is finished - please restart your game.")
    }
  }
  checkWinner(id:number){
    let curRow = Math.floor(id/3);
    let curCol = Math.floor(id%3);
    if(Math.abs(this.diag)===3||
       Math.abs(this.rows[curRow])===3||
       Math.abs(this.cols[curCol])===3||
       Math.abs(this.antiDiag)===3){
        return true;
    }else return false;
  }
  
  checkSocketHandler($event: any) {
    this.webSocketService.emit('message', 'OMG');
  }
}

// export class TicTacToeComponent {
//   player:string;
//   players:any;
//   playersList:any;
//   isGame:boolean;
//   db:any;
//   currentUser:string;
//   isTurn:any;
//   winner:any;
//   constructor(private apiService:ApiService,
//               private authService: AuthService) { 
//     this.db = new Array(9).fill("").map(a=>"");
//     this.currentUser = this.authService.getUserDataFromLocalStorage('userData').username;
//   }
//   join(){
//     this.apiService.postTypeRequest('/user/tic-tac-toe/player/add',{
//       "name":this.currentUser,
//       "isTurn":false
//     }).subscribe((res:any)=>{
//       console.log(res)
//       if(res[this.currentUser]){
//         this.players = res;
//         this.playersList = Object.keys(res);
//         alert("Joined successfully")
//       }else{
//         alert("already joined")
//       }
//     })  
//   }
//   unjoin(){
//     this.apiService.postTypeRequest('/user/tic-tac-toe/player/delete',{
//       "name":this.currentUser
//     }).subscribe((res:any)=>{
//       if(res.code===0){
//         alert('Unjoined already, no need to click again');
//       }else if(res.code===1){
//         alert('Unjoined.');
//         this.players = res;
//         this.playersList = Object.keys(res);
//       }
//     })  
//   }
//   move(id:number){ 
//     if(!this.isGame) alert("Please click start game")
//     else if(this.isTurn.username!==this.currentUser){
//       alert('Not your turn');
//     }else{
//       //get most updated board data and players data
//       this.apiService.getTypeRequest('/user/tic-tac-toe/player/board').subscribe((res:any)=>{
//           this.db = res.board;
//           this.players = res.players;
//           this.playersList = Object.keys(res);
//       })
//       //retrieve sign of currentPlayer
//       if(this.players[this.currentUser].sign===undefined){
//         this.apiService.postTypeRequest('/user/tic-tac-toe/player/updateSign',{
//           username:this.currentUser
//         }).subscribe((res:any)=>{
//           this.players = res.players;
//           this.playersList = Object.keys(res);
//         })
//       }
//       if(this.db[id]===undefined){
//         this.apiService.postTypeRequest('/user/tic-tac-toe/player/move',{
//           id,
//           username:this.currentUser
//         }).subscribe((res:any)=>{
//           this.db = res.board,
//           this.players = res.players,
//           this.playersList = Object.keys(res),
//           this.isTurn = res.isTurn,
//           this.isGame,
//           this.winner
//         })
//       }
//       //position is taken 
//       //position is open
//     }
   
    
//   }
//   start(){
//     //checkPlayers===2
//     if(!this.playersList.length || this.playersList.length<2){
//       alert('need one more player to join')
//     }else{
//       //updateCurrentUserSign
//       this.apiService.postTypeRequest('/user/tic-tac-toe/player/start',{
//         name:this.currentUser
//       }).subscribe((res:any)=>{
//         console.log(res);
//         this.isGame = res.isGame;
//         this.db = res.board;
//         this.players = res.players;
//         this.isTurn = res.isTurn;
//       })
//       //updateCurrentPlayerOfTurn
//       //ClearBoard
//     }
//   }
  
 

// }
