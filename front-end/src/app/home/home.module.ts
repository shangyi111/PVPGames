import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HomeComponent } from './components/home/home.component';
import { AppRoutingModule } from '../app-routing.module';
import { UserHomeComponent } from './components/user-home/user-home.component';
import { TicTacToeComponent } from './components/tic-tac-toe/tic-tac-toe.component';
import { RoomComponent } from './components/room/room.component';



@NgModule({
  declarations: [
    HomeComponent,
    UserHomeComponent,
    TicTacToeComponent,
    RoomComponent
  ],
  imports: [
    FormsModule,
    CommonModule,
    AppRoutingModule
  ],
  exports:[
    HomeComponent
  ]
})
export class HomeModule { }
