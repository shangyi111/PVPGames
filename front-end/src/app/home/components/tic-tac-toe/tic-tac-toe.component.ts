import { Component } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { WebSocketService } from 'src/app/services/web-socket.service';


@Component({
  selector: 'tic-tac-toe',
  templateUrl: './tic-tac-toe.component.html',
  styleUrls: ['./tic-tac-toe.component.scss']
})
export class TicTacToeComponent{
  msg:string;
  currentUser:string;
  //updatePlayersList
  cachePlayers: any [] = [];
  //updateBoard
  playerInTurn:any;
  board:any; 
  rows:any = [0,0,0];
  cols:any = [0,0,0];
  diag:number = 0;
  antiDiag:number = 0;
  //updateWinner
  winner:string="";
  

  constructor(private webSocketService:WebSocketService,
              private authService:AuthService){
    this.currentUser = this.authService.getUserDataFromLocalStorage('userData').username;
    this.refreshBoard();
    this.refreshWinner();

  }
  ngOnInit() {
    this.webSocketService
        .listen('test event')
        .subscribe(msg => {
          console.log(msg);
          this.msg = "1st "+msg;
        });
    this.webSocketService
        .listen('updatePlayerList')
        .subscribe((data:any[]) => {
          this.cachePlayers = data;
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
          console.log(this.board)
        });
    this.webSocketService
        .listen('updateWinner')
        .subscribe((data:any) => {
          this.winner = data;
        });

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
      this.webSocketService.emit('updatePlayerList', this.cachePlayers);
    }
  }
  unjoin(){
    this.cachePlayers = this.cachePlayers.filter(data=>{
      return data.user!=this.currentUser;
    });
    this.webSocketService.emit('updatePlayerList', this.cachePlayers);
    this.refreshWinner();
    this.refreshBoard();
  }

  checkSocketHandler($event: any) {
    this.webSocketService.emit('message', 'OMG');
  }
  refreshBoard(){
    this.webSocketService.emit('updateBoard',{
      board:new Array(9).fill("").map(a=>""),
      playerInTurn:"",
      rows : [0,0,0],
      cols : [0,0,0],
      diag : 0,
      antiDiag:0
    });
  }
  refreshWinner(){
    this.webSocketService.emit('updateWinner',"");
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
      antiDiag:0
    });
    this.webSocketService.emit('updatePlayerList',this.cachePlayers);
  }
  move(id:number){
    if(this.board[id]!==""){
      alert("It's taken.")
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
        antiDiag:this.antiDiag
      });
      if(this.checkWinner(id)){
        this.webSocketService.emit('updateBoard',{
          board:this.board,
          playerInTurn:"",
          rows : this.rows,
          cols : this.cols,
          diag : this.diag,
          antiDiag:this.antiDiag
        });
        this.webSocketService.emit('updateWinner',this.currentUser);
      }else if(!this.board.includes("")){
        this.webSocketService.emit('updateWinner',"No one ");
        this.webSocketService.emit('updateBoard',{
          board:this.board,
          playerInTurn:"",
          rows : this.rows,
          cols : this.cols,
          diag : this.diag,
          antiDiag:this.antiDiag
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
