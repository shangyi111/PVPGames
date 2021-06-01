import { NgModule } from '@angular/core';
import { Routes, RouterModule, ActivatedRoute, Router } from '@angular/router';
import { LoginComponent } from './auth/components/login/login.component';
import { RegisterComponent } from './auth/components/register/register.component';
import { TicTacToeComponent } from './home/components/tic-tac-toe/tic-tac-toe.component';
import { UserHomeComponent } from './home/components/user-home/user-home.component';
import { AuthGuardService } from './services/auth-guard.service';



const routes: Routes = [
      {path: 'login', component:LoginComponent},
      {path: 'register', component: RegisterComponent},
      {path: 'user-home',
        component:UserHomeComponent, 
        children:[
          {
            path:'tic-tac-toe',
            component:TicTacToeComponent,
          }
        ],
        canActivate:[AuthGuardService]
      }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { 
  constructor() {
   
  }
}
