import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './components/home/home.component';
import { AppRoutingModule } from '../app-routing.module';
import { UserHomeComponent } from './components/user-home/user-home.component';
import { TicTacToeComponent } from './components/tic-tac-toe/tic-tac-toe.component';



@NgModule({
  declarations: [
    HomeComponent,
    UserHomeComponent,
    TicTacToeComponent
  ],
  imports: [
    CommonModule,
    AppRoutingModule
  ],
  exports:[
    HomeComponent
  ]
})
export class HomeModule { }
